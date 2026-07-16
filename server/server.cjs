require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { query } = require('./db.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Helper: Check if OpenAI is configured
const isOpenAIConfigured = () => {
  const key = process.env.OPENAI_API_KEY;
  return key && key.trim() !== '' && key !== 'your_openai_api_key_here';
};

// Simulation Engine Fallback
function generateSimulatedAIResponse(data) {
  const { source, destination, people, days, travelMode, tripType, hotelType, budget } = data;
  const p = Number(people) || 1;
  const d = Number(days) || 1;

  // Local calculation engine mimicking AI
  const travelRates = { bus: 450, train: 850, car: 1300, flight: 4200 };
  const travelCost = Math.round((travelRates[travelMode] || 900) * d * 0.16 * 2 * p);

  const hotelRates = {
    'Budget Hostel': 450,
    'Budget Hotel': 900,
    'Mid-Range Hotel': 1900,
    'Luxury Hotel': 4200,
    'Resort': 7200,
  };
  const hotelNight = hotelRates[hotelType] || (tripType === 'student' ? 500 : 2200);
  const hotelCost = Math.round(hotelNight * d * Math.ceil(p / 2));

  const foodRate = tripType === 'student' ? 380 : 850;
  const foodCost = Math.round(foodRate * p * d);

  const actRate = tripType === 'student' ? 320 : 650;
  const activitiesCost = Math.round(actRate * p * d);

  const miscCost = Math.round((travelCost + hotelCost + foodCost + activitiesCost) * 0.08);
  const subtotal = travelCost + hotelCost + foodCost + activitiesCost + miscCost;
  const gstCost = Math.round(subtotal * 0.05);
  const emergencyCost = Math.round(subtotal * 0.10);
  const totalCost = subtotal + gstCost + emergencyCost;

  // Costs Object
  const costs = {
    travel: travelCost,
    hotel: hotelCost,
    food: foodCost,
    activities: activitiesCost,
    misc: miscCost,
    gst: gstCost,
    emergency: emergencyCost,
    total: totalCost
  };

  // Optimizations Object
  const optimizations = [
    { category: 'Travel', title: 'Travel Overnight by Sleeper Train', desc: 'Save on 1 night lodging plus travel. Book 3AC Sleeper for comfortable, budget-friendly transit.', saving: Math.round(1200 * p) },
    { category: 'Hotel', title: 'Choose Dorm Hostels', desc: 'Switching to highly-rated community dorms saves up to 60% on lodging costs.', saving: Math.round(800 * d * p) },
    { category: 'Timing', title: 'Plan Weekday Sightseeing', desc: 'Visiting entry-fee attractions on Mon-Thu helps lock down off-peak booking rates.', saving: Math.round(600 * p) },
    { category: 'Local Travel', title: 'Utilize Public Metros/Buses', desc: 'Avoid expensive private tour cabs. Use city transit and walking tours instead.', saving: Math.round(400 * d * p) }
  ];

  // Recommendations List
  const recommendations = tripType === 'student' ? [
    { name: 'Heritage Ruins Tour', desc: 'Explore historic rock monuments and boulder-strewn landscapes.', cost: '₹200/day', distance: '12 km', rating: 4.8, season: 'Oct-Feb', time: '4 hrs', tag: 'Heritage', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', emoji: '🏛️', free: true },
    { name: 'River Rafting & Campfire', desc: 'Thrilling white water rafting and riverside tent stays under the stars.', cost: '₹1,500', distance: '8 km', rating: 4.9, season: 'Mar-May', time: '6 hrs', tag: 'Adventure', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', emoji: '🏞️', free: false },
    { name: 'Local Beach Bazaar', desc: 'Sizzle on sandy shorelines, enjoy vibrant flea markets, and sample cheap shacks.', cost: '₹500/day', distance: '2 km', rating: 4.7, season: 'Nov-Feb', time: '3 hrs', tag: 'Beach', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', emoji: '🏖️', free: false },
    { name: 'Mountain Sunset Point', desc: 'Breathtaking golden-hour viewpoints overlooking valleys and ancient shrines.', cost: '₹0', distance: '5 km', rating: 4.6, season: 'Year-round', time: '2 hrs', tag: 'Nature', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', emoji: '🏔️', free: true }
  ] : [
    { name: 'City Palace Guided Walk', desc: 'Opulent royal courtyards, historical archives, and architectural marvels.', cost: '₹600/day', distance: '3 km', rating: 4.8, season: 'Oct-Mar', time: '3 hrs', tag: 'Heritage', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', emoji: '🏯', free: false },
    { name: 'Eco Nature Botanical Park', desc: 'Boating lakes, floral conservatories, and quiet green pathways perfect for families.', cost: '₹300/day', distance: '10 km', rating: 4.7, season: 'Sep-Mar', time: '4 hrs', tag: 'Nature', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', emoji: '🌿', free: false },
    { name: 'Colonial Hill Toy Train ride', desc: 'Panoramic mountain vistas and tunnels in a historic narrow-gauge steam rail ride.', cost: '₹400', distance: '15 km', rating: 4.9, season: 'Dec-Feb', time: '2 hrs', tag: 'Hills', image: 'https://images.unsplash.com/photo-1570458436416-b8fcccfe883f?w=600&q=80', emoji: '🚂', free: false },
    { name: 'National Wildlife Safari', desc: 'Guided jeep drive through forest terrain observing indigenous wildlife.', cost: '₹1,200', distance: '25 km', rating: 4.8, season: 'Oct-Jun', time: '5 hrs', tag: 'Adventure', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', emoji: '🦁', free: false }
  ];

  return { costs, optimizations, recommendations, simulation: true };
}

// ─── API ENDPOINTS ───

// 1. POST /api/trips: Plan a trip and calculate budget (Using OpenAI or Simulation Fallback)
app.post('/api/trips', async (req, res) => {
  try {
    const {
      source, destination, people, days, travelMode, budget,
      tripType, hotelType, foodPref, adventureLevel, luxuryLevel, activities
    } = req.body;

    if (!source || !destination || !budget) {
      return res.status(400).json({ error: 'Source, destination, and budget are required fields.' });
    }

    let aiData;

    if (isOpenAIConfigured()) {
      console.log('Requesting OpenAI budget advice...');
      try {
        const prompt = `
          You are an expert travel planner and budget optimizer assistant.
          Based on the following travel details:
          From: ${source}
          To: ${destination}
          People: ${people}
          Days: ${days}
          Travel Mode: ${travelMode}
          User Budget: ₹${budget}
          Trip Style: ${tripType} (${tripType === 'student' ? 'Budget-focused, student groups, hostels, sleeper trains' : 'Comfort-focused, family friendly, safety verified resorts, car/AC travel'})
          Hotel Preference: ${hotelType}
          Food Preference: ${foodPref}
          Adventure Level: ${adventureLevel}/5
          Luxury Level: ${luxuryLevel}/5
          Preferred Activities: ${activities ? activities.join(', ') : 'None'}

          Please estimate the travel costs and build custom tourist recommendations.
          Generate a structured JSON output with the following fields:
          1. "costs": {
               "travel": number, (Total travel cost for return trip for all people in INR)
               "hotel": number, (Total lodging cost for all people in INR)
               "food": number, (Total food cost for all people in INR)
               "activities": number, (Total activity cost for all people in INR)
               "misc": number, (Shopping and local transport in INR)
               "gst": number, (5% of the subtotal in INR)
               "emergency": number, (10% buffer in INR)
               "total": number (Sum of all the above costs)
             }
          2. "optimizations": [
               {
                 "category": "Travel" | "Hotel" | "Food" | "Activities" | "Timing" | "Local Travel",
                 "title": string,
                 "desc": string,
                 "saving": number (Estimated amount saved in INR)
               }
             ] (Generate 4 specific cost optimization suggestions)
          3. "recommendations": [
               {
                 "name": string,
                 "desc": string,
                 "cost": string, (e.g. "₹500/day")
                 "distance": string, (e.g. "12 km")
                 "rating": number, (e.g. 4.8)
                 "season": string,
                 "time": string,
                 "tag": string,
                 "image": string, (Use a valid unsplash landscape image url or similar)
                 "emoji": string,
                 "free": boolean
               }
             ] (Generate 4 tourist spots that match this travel style)
        `;

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an AI travel advisor. You respond only with a raw structured JSON object.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        });

        const rawJson = response.choices[0].message.content;
        aiData = JSON.parse(rawJson);
        aiData.simulation = false;
      } catch (err) {
        console.error('OpenAI API call failed, falling back to simulation:', err.message);
        aiData = generateSimulatedAIResponse(req.body);
      }
    } else {
      console.log('OpenAI not configured. Using Simulation Mode calculations...');
      aiData = generateSimulatedAIResponse(req.body);
    }

    // Save trip details and calculations into SQLite DB
    const sql = `
      INSERT INTO trips (
        source, destination, people, days, travelMode, budget, tripType,
        hotelType, foodPref, adventureLevel, luxuryLevel, activities,
        costs, optimizations, recommendations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      source,
      destination,
      Number(people) || 1,
      Number(days) || 1,
      travelMode,
      Number(budget),
      tripType,
      hotelType || '',
      foodPref || '',
      Number(adventureLevel) || 1,
      Number(luxuryLevel) || 1,
      JSON.stringify(activities || []),
      JSON.stringify(aiData.costs),
      JSON.stringify(aiData.optimizations),
      JSON.stringify(aiData.recommendations)
    ];

    const result = await query.run(sql, params);
    
    // Construct response
    const savedTrip = {
      id: result.id,
      source,
      destination,
      people,
      days,
      travelMode,
      budget,
      tripType,
      hotelType,
      foodPref,
      adventureLevel,
      luxuryLevel,
      activities,
      costs: aiData.costs,
      optimizations: aiData.optimizations,
      recommendations: aiData.recommendations,
      simulation: aiData.simulation,
      createdAt: new Date().toISOString()
    };

    res.status(201).json(savedTrip);
  } catch (err) {
    console.error('POST /api/trips error:', err.message);
    res.status(500).json({ error: 'Failed to process and save trip analysis.' });
  }
});

// 2. GET /api/trips: Retrieve all saved trips
app.get('/api/trips', async (req, res) => {
  try {
    const rows = await query.all('SELECT * FROM trips ORDER BY id DESC');
    const trips = rows.map(r => ({
      ...r,
      activities: JSON.parse(r.activities || '[]'),
      costs: JSON.parse(r.costs || '{}'),
      optimizations: JSON.parse(r.optimizations || '[]'),
      recommendations: JSON.parse(r.recommendations || '[]')
    }));
    res.json(trips);
  } catch (err) {
    console.error('GET /api/trips error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve saved trips.' });
  }
});

// 3. GET /api/trips/:id: Retrieve single trip by ID
app.get('/api/trips/:id', async (req, res) => {
  try {
    const r = await query.get('SELECT * FROM trips WHERE id = ?', [req.params.id]);
    if (!r) return res.status(404).json({ error: 'Trip not found.' });

    const trip = {
      ...r,
      activities: JSON.parse(r.activities || '[]'),
      costs: JSON.parse(r.costs || '{}'),
      optimizations: JSON.parse(r.optimizations || '[]'),
      recommendations: JSON.parse(r.recommendations || '[]')
    };
    res.json(trip);
  } catch (err) {
    console.error('GET /api/trips/:id error:', err.message);
    res.status(500).json({ error: 'Failed to fetch trip details.' });
  }
});

// 4. GET /api/expenses: List expenses (optionally filtered by tripId)
app.get('/api/expenses', async (req, res) => {
  try {
    const tripId = req.query.tripId;
    let rows;
    if (tripId) {
      rows = await query.all('SELECT * FROM expenses WHERE tripId = ? ORDER BY id DESC', [tripId]);
    } else {
      rows = await query.all('SELECT * FROM expenses ORDER BY id DESC');
    }
    res.json(rows);
  } catch (err) {
    console.error('GET /api/expenses error:', err.message);
    res.status(500).json({ error: 'Failed to fetch expenses.' });
  }
});

// 5. POST /api/expenses: Add expense to SQL
app.post('/api/expenses', async (req, res) => {
  try {
    const { tripId, category, desc, amount, date } = req.body;
    if (!category || !desc || !amount || !date) {
      return res.status(400).json({ error: 'Category, description, amount, and date are required.' });
    }

    const sql = 'INSERT INTO expenses (tripId, category, desc, amount, date) VALUES (?, ?, ?, ?, ?)';
    const result = await query.run(sql, [tripId || null, category, desc, Number(amount), date]);

    res.status(201).json({
      id: result.id,
      tripId: tripId || null,
      category,
      desc,
      amount: Number(amount),
      date
    });
  } catch (err) {
    console.error('POST /api/expenses error:', err.message);
    res.status(500).json({ error: 'Failed to record expense.' });
  }
});

// 6. DELETE /api/expenses/:id: Remove expense by ID
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const result = await query.run('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Expense deleted successfully.', id: req.params.id });
  } catch (err) {
    console.error('DELETE /api/expenses/:id error:', err.message);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
});

// 7. PUT /api/expenses/:id: Update expense by ID
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { category, desc, amount, date } = req.body;
    if (!category || !desc || !amount || !date) {
      return res.status(400).json({ error: 'Category, description, amount, and date are required.' });
    }
    const sql = 'UPDATE expenses SET category = ?, desc = ?, amount = ?, date = ? WHERE id = ?';
    await query.run(sql, [category, desc, Number(amount), date, req.params.id]);
    res.json({
      id: Number(req.params.id),
      category,
      desc,
      amount: Number(amount),
      date
    });
  } catch (err) {
    console.error('PUT /api/expenses/:id error:', err.message);
    res.status(500).json({ error: 'Failed to update expense.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`SmartTravel API Backend running on port ${PORT}`);
});

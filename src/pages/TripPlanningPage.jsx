import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaWallet, FaBus,
  FaTrain, FaCar, FaArrowRight, FaBrain, FaUtensils,
  FaStar, FaCheck, FaHotel, FaPlane
} from 'react-icons/fa';
import './TripPlanningPage.css';

const travelModes = [
  { id: 'bus', icon: FaBus, label: 'Bus', desc: 'Budget friendly' },
  { id: 'train', icon: FaTrain, label: 'Train', desc: 'Comfortable' },
  { id: 'car', icon: FaCar, label: 'Car', desc: 'Flexible' },
  { id: 'flight', icon: FaPlane, label: 'Flight', desc: 'Fastest' },
];

const hotelTypes = ['Budget Hostel', 'Budget Hotel', 'Mid-Range Hotel', 'Luxury Hotel', 'Resort'];
const foodPrefs = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'All Types'];
const activities = ['Sightseeing', 'Adventure Sports', 'Beach', 'Cultural Tour', 'Shopping', 'Trekking', 'Wildlife Safari'];

export default function TripPlanningPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tripType = location.state?.tripType || 'student';

  const [form, setForm] = useState({
    source: '',
    destination: '',
    people: 1,
    days: 3,
    travelMode: 'train',
    budget: '',
    tripType: tripType,
    hotelType: tripType === 'student' ? 'Budget Hostel' : 'Mid-Range Hotel',
    foodPref: 'All Types',
    adventureLevel: 3,
    luxuryLevel: 2,
    activities: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleActivity = (act) => {
    setForm(f => ({
      ...f,
      activities: f.activities.includes(act)
        ? f.activities.filter(a => a !== act)
        : [...f.activities, act]
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.source.trim()) e.source = 'Please enter your source location';
    if (!form.destination.trim()) e.destination = 'Please enter your destination';
    if (!form.budget || Number(form.budget) < 1000) e.budget = 'Please enter a valid budget (min ₹1,000)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const calculateCosts = (data) => {
    const { people, days, travelMode, tripType, hotelType } = data;
    const p = Number(people) || 1;
    const d = Number(days) || 1;
    const travelRates = { bus: 400, train: 800, car: 1200, flight: 4000 };
    const travel = Math.round((travelRates[travelMode] || 800) * d * 0.15 * 2 * p);
    const hotelRates = {
      'Budget Hostel': 400,
      'Budget Hotel': 800,
      'Mid-Range Hotel': 1800,
      'Luxury Hotel': 4000,
      'Resort': 7000,
    };
    const hotelNightRate = hotelRates[hotelType] || (tripType === 'student' ? 500 : 2000);
    const hotel = Math.round(hotelNightRate * d * Math.ceil(p / 2));
    const food = Math.round((tripType === 'student' ? 350 : 800) * p * d);
    const activities = Math.round((tripType === 'student' ? 300 : 600) * p * d);
    const misc = Math.round((travel + hotel + food + activities) * 0.08);
    const subtotal = travel + hotel + food + activities + misc;
    const gst = Math.round(subtotal * 0.05);
    const emergency = Math.round(subtotal * 0.10);
    const total = subtotal + gst + emergency;
    return { travel, hotel, food, activities, misc, gst, emergency, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('API server returned error status');
      const data = await response.json();
      localStorage.setItem('activeTrip', JSON.stringify({ tripData: data, costs: data.costs }));
      navigate('/budget', { state: { tripData: data, costs: data.costs } });
    } catch (err) {
      console.warn('Backend server error, using client simulation fallback:', err.message);
      const fallbackCosts = calculateCosts(form);
      const fallbackTrip = { ...form, costs: fallbackCosts };
      localStorage.setItem('activeTrip', JSON.stringify({ tripData: fallbackTrip, costs: fallbackCosts }));
      setTimeout(() => {
        navigate('/budget', { state: { tripData: fallbackTrip, costs: fallbackCosts } });
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-page page-enter">
      {/* Animated map background */}
      <div className="plan-page__bg">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&q=80"
          alt="Map background"
          className="plan-page__bg-img"
        />
        <div className="plan-page__bg-overlay" />
      </div>

      <div className="container">
        {/* Header */}
        <div className="plan-page__header text-center">
          <div className="section-badge"><FaBrain /> Step 2 of 3 — Trip Details</div>
          <h1 className="plan-page__title">
            Plan Your <span className="gradient-text">Dream Trip</span>
          </h1>
          <p className="plan-page__subtitle">
            Fill in the details and let our AI calculate the perfect budget and itinerary for you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="plan-form glass-card" noValidate>
          <div className="plan-form__inner">

            {/* ── Section 1: Locations ── */}
            <div className="plan-section">
              <h2 className="plan-section__title">
                <FaMapMarkerAlt className="plan-section__icon" /> Travel Route
              </h2>
              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label" htmlFor="source">🏠 From (Source)</label>
                  <div className="input-wrap">
                    <FaMapMarkerAlt className="input-icon" />
                    <input
                      id="source"
                      className={`input-field ${errors.source ? 'input-field--error' : ''}`}
                      placeholder="e.g., Mumbai, Delhi, Bangalore"
                      value={form.source}
                      onChange={e => update('source', e.target.value)}
                    />
                  </div>
                  {errors.source && <span className="input-error">{errors.source}</span>}
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="dest">📍 To (Destination)</label>
                  <div className="input-wrap">
                    <FaMapMarkerAlt className="input-icon" style={{ color: '#ec4899' }} />
                    <input
                      id="dest"
                      className={`input-field ${errors.destination ? 'input-field--error' : ''}`}
                      placeholder="e.g., Goa, Manali, Rajasthan"
                      value={form.destination}
                      onChange={e => update('destination', e.target.value)}
                    />
                  </div>
                  {errors.destination && <span className="input-error">{errors.destination}</span>}
                </div>
              </div>
            </div>

            {/* ── Section 2: Trip Details ── */}
            <div className="plan-section">
              <h2 className="plan-section__title">
                <FaCalendarAlt className="plan-section__icon" /> Trip Details
              </h2>
              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label" htmlFor="people">👥 Number of People: <strong>{form.people}</strong></label>
                  <div className="slider-wrap">
                    <input
                      id="people"
                      type="range" min="1" max="20" value={form.people}
                      onChange={e => update('people', Number(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>1</span><span>20</span>
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="days">📅 Number of Days: <strong>{form.days}</strong></label>
                  <div className="slider-wrap">
                    <input
                      id="days"
                      type="range" min="1" max="30" value={form.days}
                      onChange={e => update('days', Number(e.target.value))}
                      className="slider"
                    />
                    <div className="slider-labels">
                      <span>1</span><span>30</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="input-group">
                <label className="input-label" htmlFor="budget">💰 Total Budget (₹)</label>
                <div className="input-wrap">
                  <FaWallet className="input-icon" style={{ color: '#10b981' }} />
                  <input
                    id="budget"
                    type="number"
                    className={`input-field ${errors.budget ? 'input-field--error' : ''}`}
                    placeholder="Enter your total budget in ₹"
                    value={form.budget}
                    onChange={e => update('budget', e.target.value)}
                    min="1000"
                  />
                </div>
                {errors.budget && <span className="input-error">{errors.budget}</span>}
                <div className="budget-hints">
                  {[5000, 10000, 20000, 50000, 100000].map(b => (
                    <button
                      key={b}
                      type="button"
                      className={`budget-hint ${Number(form.budget) === b ? 'budget-hint--active' : ''}`}
                      onClick={() => update('budget', b)}
                    >
                      ₹{b.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Section 3: Travel Mode ── */}
            <div className="plan-section">
              <h2 className="plan-section__title">
                <FaBus className="plan-section__icon" /> Travel Mode
              </h2>
              <div className="travel-modes">
                {travelModes.map(({ id, icon: Icon, label, desc }) => (
                  <label key={id} className="radio-card">
                    <input
                      type="radio"
                      name="travelMode"
                      value={id}
                      checked={form.travelMode === id}
                      onChange={() => update('travelMode', id)}
                    />
                    <div className={`travel-mode-card ${form.travelMode === id ? 'travel-mode-card--active' : ''}`}>
                      <Icon className="travel-mode-card__icon" />
                      <span className="travel-mode-card__label">{label}</span>
                      <span className="travel-mode-card__desc">{desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Section 4: Trip Type ── */}
            <div className="plan-section">
              <h2 className="plan-section__title">
                <FaUsers className="plan-section__icon" /> Trip Type
              </h2>
              <div className="grid-2">
                {['student', 'family'].map(type => (
                  <label key={type} className="radio-card">
                    <input
                      type="radio"
                      name="tripType"
                      value={type}
                      checked={form.tripType === type}
                      onChange={() => update('tripType', type)}
                    />
                    <div className={`type-radio ${form.tripType === type ? 'type-radio--active' : ''}`}>
                      <span className="type-radio__emoji">
                        {type === 'student' ? '🎓' : '👨‍👩‍👧'}
                      </span>
                      <span className="type-radio__label">
                        {type === 'student' ? 'Student Trip' : 'Family Trip'}
                      </span>
                      {form.tripType === type && <FaCheck className="type-radio__check" />}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Section 5: Preferences ── */}
            <div className="plan-section">
              <h2 className="plan-section__title">
                <FaStar className="plan-section__icon" /> Optional Preferences
              </h2>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label" htmlFor="hotelType">🏨 Hotel Preference</label>
                  <div className="input-wrap">
                    <FaHotel className="input-icon" />
                    <select
                      id="hotelType"
                      className="input-field"
                      value={form.hotelType}
                      onChange={e => update('hotelType', e.target.value)}
                    >
                      {hotelTypes.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="foodPref">🍽️ Food Preference</label>
                  <div className="input-wrap">
                    <FaUtensils className="input-icon" />
                    <select
                      id="foodPref"
                      className="input-field"
                      value={form.foodPref}
                      onChange={e => update('foodPref', e.target.value)}
                    >
                      {foodPrefs.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">
                    🧗 Adventure Level: <strong>{['Easy', 'Low', 'Medium', 'High', 'Extreme'][form.adventureLevel - 1]}</strong>
                  </label>
                  <div className="slider-wrap">
                    <input
                      type="range" min="1" max="5" value={form.adventureLevel}
                      onChange={e => update('adventureLevel', Number(e.target.value))}
                      className="slider slider--adventure"
                    />
                    <div className="slider-labels">
                      <span>Easy</span><span>Extreme</span>
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label">
                    👑 Luxury Level: <strong>{['Budget', 'Economy', 'Standard', 'Premium', 'Luxury'][form.luxuryLevel - 1]}</strong>
                  </label>
                  <div className="slider-wrap">
                    <input
                      type="range" min="1" max="5" value={form.luxuryLevel}
                      onChange={e => update('luxuryLevel', Number(e.target.value))}
                      className="slider slider--luxury"
                    />
                    <div className="slider-labels">
                      <span>Budget</span><span>Luxury</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="input-group">
                <label className="input-label">🎯 Preferred Activities</label>
                <div className="activities-grid">
                  {activities.map(act => (
                    <button
                      key={act}
                      type="button"
                      className={`activity-tag ${form.activities.includes(act) ? 'activity-tag--active' : ''}`}
                      onClick={() => toggleActivity(act)}
                    >
                      {form.activities.includes(act) && <FaCheck />}
                      {act}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`btn-primary plan-submit ${loading ? 'plan-submit--loading' : ''}`}
              disabled={loading}
              id="calculate-budget-btn"
            >
              {loading ? (
                <>
                  <div className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  AI is calculating your budget...
                </>
              ) : (
                <>
                  <FaBrain />
                  Calculate Budget with AI
                  <FaArrowRight />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

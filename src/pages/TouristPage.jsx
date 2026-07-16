import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaRupeeSign, FaStar, FaClock, FaHeart,
  FaPlus, FaSearch, FaArrowRight, FaGlobe,
  FaCamera, FaLeaf, FaUsers, FaGraduationCap
} from 'react-icons/fa';
import './TouristPage.css';

const allDestinations = {
  student: [
    { id: 1, name: 'Hampi', state: 'Karnataka', desc: 'Ancient ruins and boulder landscapes. UNESCO World Heritage site with breathtaking rock temples.', cost: '₹1,200/day', distance: '350 km', rating: 4.8, season: 'Oct-Feb', time: '6 hrs', tag: 'Heritage', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80', emoji: '🏛️', free: true },
    { id: 2, name: 'Rishikesh', state: 'Uttarakhand', desc: 'Yoga capital of India. White water rafting, bungee jumping, and spiritual experiences.', cost: '₹800/day', distance: '230 km', rating: 4.9, season: 'Mar-May', time: '4 hrs', tag: 'Adventure', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', emoji: '🏞️', free: false },
    { id: 3, name: 'Goa Beaches', state: 'Goa', desc: 'Stunning beaches, vibrant nightlife, and Portuguese heritage. Perfect budget beach getaway.', cost: '₹1,500/day', distance: '450 km', rating: 4.7, season: 'Nov-Feb', time: '8 hrs', tag: 'Beach', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', emoji: '🏖️', free: false },
    { id: 4, name: 'Varanasi', state: 'UP', desc: 'The spiritual capital of India. Ganga Aarti, ghats, and ancient temples are a must-see.', cost: '₹900/day', distance: '800 km', rating: 4.6, season: 'Oct-Mar', time: '12 hrs', tag: 'Spiritual', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80', emoji: '🕯️', free: true },
    { id: 5, name: 'Spiti Valley', state: 'HP', desc: 'Remote cold desert mountain valley with ancient monasteries and stunning landscapes.', cost: '₹1,800/day', distance: '560 km', rating: 4.9, season: 'May-Sep', time: '15 hrs', tag: 'Mountains', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', emoji: '🏔️', free: false },
    { id: 6, name: 'Coorg', state: 'Karnataka', desc: 'Scotland of India. Coffee plantations, waterfalls, and lush green hills.', cost: '₹1,100/day', distance: '270 km', rating: 4.7, season: 'Oct-May', time: '5 hrs', tag: 'Nature', image: 'https://images.unsplash.com/photo-1580708088059-3dd2a2b3b33a?w=600&q=80', emoji: '☕', free: false },
  ],
  family: [
    { id: 7, name: 'Jaipur', state: 'Rajasthan', desc: 'Pink City with majestic forts, palaces, and vibrant bazaars. Perfect for family exploration.', cost: '₹2,500/day', distance: '280 km', rating: 4.8, season: 'Oct-Mar', time: '5 hrs', tag: 'Heritage', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80', emoji: '🏯', free: false },
    { id: 8, name: 'Munnar', state: 'Kerala', desc: 'Tea gardens, scenic hills, and wildlife. Child-safe with excellent family resorts.', cost: '₹3,000/day', distance: '480 km', rating: 4.9, season: 'Sep-Mar', time: '9 hrs', tag: 'Nature', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', emoji: '🌿', free: false },
    { id: 9, name: 'Shimla', state: 'HP', desc: 'Colonial hill station with toy trains, apple orchards, and snow. Family paradise in hills.', cost: '₹2,800/day', distance: '350 km', rating: 4.7, season: 'Dec-Feb', time: '7 hrs', tag: 'Hills', image: 'https://images.unsplash.com/photo-1570458436416-b8fcccfe883f?w=600&q=80', emoji: '🏔️', free: false },
    { id: 10, name: 'Agra', state: 'UP', desc: 'Home to the Taj Mahal, Agra Fort, and Fatehpur Sikri. An iconic family destination.', cost: '₹2,200/day', distance: '200 km', rating: 4.8, season: 'Oct-Mar', time: '4 hrs', tag: 'Heritage', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', emoji: '🕌', free: false },
    { id: 11, name: 'Ooty', state: 'Tamil Nadu', desc: 'Queen of Hill Stations. Botanical gardens, lake boating, and cool weather perfect for families.', cost: '₹2,400/day', distance: '300 km', rating: 4.6, season: 'Apr-Jun', time: '6 hrs', tag: 'Hills', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80', emoji: '🌸', free: false },
    { id: 12, name: 'Andaman Islands', state: 'A&N', desc: 'Crystal clear waters, pristine beaches, and coral reefs. Premium family beach destination.', cost: '₹4,500/day', distance: 'Flight', rating: 4.9, season: 'Nov-Apr', time: 'By flight', tag: 'Beach', image: 'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=600&q=80', emoji: '🐠', free: false },
  ]
};

const tags = ['All', 'Heritage', 'Beach', 'Nature', 'Mountains', 'Hills', 'Adventure', 'Spiritual'];

export default function TouristPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTrip] = useState(() => {
    if (location.state?.tripData) {
      return { tripData: location.state.tripData };
    }
    const cached = localStorage.getItem('activeTrip');
    return cached ? JSON.parse(cached) : null;
  });
  const tripData = activeTrip?.tripData;
  const tripType = tripData?.tripType || 'student';

  const [activeMode, setActiveMode] = useState(tripType);
  const [activeTag, setActiveTag] = useState('All');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(new Set());

  const destinations = allDestinations[activeMode];

  const filtered = destinations.filter(d => {
    const tagMatch = activeTag === 'All' || d.tag === activeTag;
    const searchMatch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.desc.toLowerCase().includes(search.toLowerCase());
    return tagMatch && searchMatch;
  });

  const toggleSave = (id) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="tourist-page page-enter">
      <div className="tourist-page__bg" />

      <div className="container">
        {/* Header */}
        <div className="tourist-page__header text-center">
          <div className="section-badge"><FaGlobe /> Discover India</div>
          <h1 className="tourist-page__title">
            <span className="gradient-text">AI-Curated</span> Destinations
          </h1>
          <p className="tourist-page__subtitle">
            Handpicked destinations with real-time cost estimates tailored to your traveler profile.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="tourist-mode-toggle">
          <button
            className={`mode-btn ${activeMode === 'student' ? 'mode-btn--active' : ''}`}
            onClick={() => setActiveMode('student')}
            id="student-mode-btn"
          >
            <FaGraduationCap /> Student Mode
          </button>
          <button
            className={`mode-btn ${activeMode === 'family' ? 'mode-btn--active' : ''}`}
            onClick={() => setActiveMode('family')}
            id="family-mode-btn"
          >
            <FaUsers /> Family Mode
          </button>
        </div>

        {/* Search & Filter */}
        <div className="tourist-controls">
          <div className="tourist-search">
            <FaSearch className="tourist-search__icon" />
            <input
              className="tourist-search__input"
              placeholder="Search destinations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search destinations"
            />
          </div>
          <div className="tourist-tags">
            {tags.map(tag => (
              <button
                key={tag}
                className={`tourist-tag ${activeTag === tag ? 'tourist-tag--active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="tourist-results-count">
          Showing <strong>{filtered.length}</strong> destinations for
          <strong> {activeMode === 'student' ? '🎓 Students' : '👨‍👩‍👧 Families'}</strong>
        </div>

        {/* Destinations Grid */}
        <div className="tourist-grid">
          {filtered.map((dest, i) => (
            <div
              key={dest.id}
              className="dest-detail-card glass-card"
              style={{ '--delay': `${i * 0.08}s`, animationDelay: `${i * 0.08}s` }}
            >
              {/* Image */}
              <div className="dest-detail-card__img-wrap">
                <img src={dest.image} alt={dest.name} className="dest-detail-card__img" loading="lazy" />
                <div className="dest-detail-card__img-overlay" />

                <div className="dest-detail-card__tags">
                  <span className="dest-detail-card__tag">{dest.emoji} {dest.tag}</span>
                  {dest.free && <span className="dest-detail-card__free">Free Entry</span>}
                </div>

                <button
                  className={`dest-detail-card__heart ${saved.has(dest.id) ? 'dest-detail-card__heart--saved' : ''}`}
                  onClick={() => toggleSave(dest.id)}
                  aria-label="Save destination"
                >
                  <FaHeart />
                </button>

                <div className="dest-detail-card__rating">
                  <FaStar /> {dest.rating}
                </div>
              </div>

              {/* Body */}
              <div className="dest-detail-card__body">
                <div className="flex-between">
                  <h3 className="dest-detail-card__name">{dest.name}</h3>
                  <span className="dest-detail-card__state">{dest.state}</span>
                </div>

                <p className="dest-detail-card__desc">{dest.desc}</p>

                <div className="dest-detail-card__meta">
                  <div className="dest-meta-item">
                    <FaRupeeSign />
                    <span>{dest.cost}</span>
                  </div>
                  <div className="dest-meta-item">
                    <FaMapMarkerAlt />
                    <span>{dest.distance}</span>
                  </div>
                  <div className="dest-meta-item">
                    <FaClock />
                    <span>{dest.time}</span>
                  </div>
                  <div className="dest-meta-item">
                    <FaLeaf />
                    <span>{dest.season}</span>
                  </div>
                </div>

                <div className="dest-detail-card__actions">
                  <button className="dest-btn-primary">
                    <FaCamera /> View Details
                  </button>
                  <button
                    className={`dest-btn-secondary ${saved.has(dest.id) ? 'dest-btn-secondary--saved' : ''}`}
                    onClick={() => toggleSave(dest.id)}
                  >
                    <FaPlus /> {saved.has(dest.id) ? 'Added ✓' : 'Add to Plan'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="tourist-empty">
            <div style={{ fontSize: '4rem' }}>🔍</div>
            <h3>No destinations found</h3>
            <p>Try different search terms or filters</p>
            <button className="btn-secondary mt-4" onClick={() => { setSearch(''); setActiveTag('All'); }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Navigate */}
        {tripData && (
          <div className="tourist-cta">
            <button className="btn-primary btn-glow" onClick={() => navigate('/summary', { state: { tripData } })}>
              <FaArrowRight /> View Trip Summary
            </button>
            <button className="btn-secondary" onClick={() => navigate('/expense')}>
              📊 Open Expense Tracker
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

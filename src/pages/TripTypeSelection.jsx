import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCheck, FaArrowRight,
  FaBus, FaBed, FaUtensils, FaStar, FaMapMarkerAlt
} from 'react-icons/fa';
import './TripTypeSelection.css';

const tripTypes = [
  {
    id: 'student',
    emoji: '🎓',
    title: 'Student Trip',
    subtitle: 'Budget-Friendly Adventure',
    description: 'Perfect for college groups and solo backpackers. Maximize experiences while minimizing spending with our AI-optimized student packages.',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.1))',
    borderColor: 'rgba(124,58,237,0.5)',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    features: [
      { icon: FaBed, text: 'Hostel Recommendations' },
      { icon: FaBus, text: 'Bus & Sleeper Train Travel' },
      { icon: FaUtensils, text: 'Affordable Street Food' },
      { icon: FaMapMarkerAlt, text: 'Budget Tourist Spots' },
      { icon: FaStar, text: 'Free Attractions First' },
      { icon: FaCheck, text: 'Group Cost Splitting' },
    ],
    savings: 'Save up to 60%',
    avgBudget: '₹3,000 - ₹8,000',
    rating: '4.9 ⭐',
    badge: 'Most Popular',
    badgeColor: '#7c3aed',
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧‍👦',
    title: 'Family Trip',
    subtitle: 'Comfortable & Safe Journeys',
    description: 'Designed for families with kids and seniors. Safety-verified hotels, family-friendly attractions, and comfortable travel options.',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.1))',
    borderColor: 'rgba(6,182,212,0.5)',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=600&q=80',
    features: [
      { icon: FaBed, text: 'Comfortable Hotels & Resorts' },
      { icon: FaBus, text: 'Car & AC Train Travel' },
      { icon: FaUtensils, text: 'Family Restaurants' },
      { icon: FaMapMarkerAlt, text: 'Safe Premium Attractions' },
      { icon: FaStar, text: 'Theme Parks & Nature' },
      { icon: FaCheck, text: 'Kid-Safe Destinations' },
    ],
    savings: 'Save up to 35%',
    avgBudget: '₹12,000 - ₹50,000',
    rating: '4.8 ⭐',
    badge: 'Premium',
    badgeColor: '#06b6d4',
  },
];

export default function TripTypeSelection() {
  const [selected, setSelected] = useState(null);
  const [hovering, setHovering] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    setSelected(id);
    setTimeout(() => {
      navigate('/plan', { state: { tripType: id } });
    }, 600);
  };

  return (
    <div className="trip-type page-enter">
      {/* Background */}
      <div className="trip-type__bg">
        <img
          src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1400&q=80"
          alt="Travel background"
          className="trip-type__bg-img"
        />
        <div className="trip-type__bg-overlay" />
      </div>

      <div className="container">
        {/* Header */}
        <div className="trip-type__header text-center">
          <div className="section-badge">
            <FaMapMarkerAlt /> Step 1 of 3
          </div>
          <h1 className="trip-type__title">
            Choose Your <span className="gradient-text">Trip Style</span>
          </h1>
          <p className="trip-type__subtitle">
            Our AI tailors every recommendation based on your traveler profile.
            Select the one that best describes you.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="trip-type__cards">
          {tripTypes.map((type) => (
            <div
              key={type.id}
              className={`type-card ${selected === type.id ? 'type-card--selected' : ''} ${hovering === type.id ? 'type-card--hovering' : ''}`}
              onClick={() => handleSelect(type.id)}
              onMouseEnter={() => setHovering(type.id)}
              onMouseLeave={() => setHovering(null)}
              style={{
                '--card-color': type.color,
                '--card-gradient': type.gradient,
                '--card-border': type.borderColor,
              }}
              id={`trip-type-${type.id}`}
            >
              {/* Badge */}
              <div className="type-card__badge" style={{ background: type.badgeColor }}>
                {type.badge}
              </div>

              {/* Image */}
              <div className="type-card__img-wrap">
                <img src={type.image} alt={type.title} className="type-card__img" />
                <div className="type-card__img-overlay" />
                <div className="type-card__emoji">{type.emoji}</div>
              </div>

              {/* Content */}
              <div className="type-card__body">
                <div className="type-card__meta">
                  <span className="tag tag-primary">{type.savings}</span>
                  <span className="type-card__rating">{type.rating}</span>
                </div>

                <h2 className="type-card__title">{type.title}</h2>
                <p className="type-card__subtitle">{type.subtitle}</p>
                <p className="type-card__desc">{type.description}</p>

                {/* Features */}
                <div className="type-card__features">
                  {type.features.map(({ icon: Icon, text }, i) => (
                    <div key={i} className="type-card__feature">
                      <Icon className="type-card__feature-icon" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Budget */}
                <div className="type-card__budget-row">
                  <span className="type-card__budget-label">Avg. Budget per person</span>
                  <span className="type-card__budget">{type.avgBudget}</span>
                </div>

                {/* CTA */}
                <button
                  className="type-card__cta"
                  style={{ background: type.color }}
                >
                  {selected === type.id ? (
                    <>✅ Selected! Loading...</>
                  ) : (
                    <>Select {type.title} <FaArrowRight /></>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="trip-type__note text-center">
          <p>
            🤖 <strong>AI-Powered</strong> — Our system adapts recommendations in real-time based on your selection
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaBus, FaWallet,
  FaDownload, FaPrint, FaShare, FaBrain, FaCheck, FaPlane,
  FaHotel, FaUtensils, FaCamera, FaStar, FaArrowRight
} from 'react-icons/fa';
import './TripSummaryPage.css';

const travelIcons = {
  bus: FaBus,
  train: FaPlane,
  car: FaPlane,
  flight: FaPlane,
};

const sampleAttractions = [
  { name: 'Main Beach', type: 'Beach', cost: '₹0', rating: 4.8 },
  { name: 'Fort Area', type: 'Heritage', cost: '₹150', rating: 4.6 },
  { name: 'Night Market', type: 'Food', cost: '₹300', rating: 4.7 },
  { name: 'Sunset Point', type: 'Nature', cost: '₹0', rating: 4.9 },
];

export default function TripSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTrip] = useState(() => {
    if (location.state?.tripData) {
      const cached = localStorage.getItem('activeTrip');
      const parsedCached = cached ? JSON.parse(cached) : {};
      const data = {
        tripData: location.state.tripData,
        costs: location.state.costs || parsedCached.costs,
        optimizedCost: location.state.optimizedCost !== undefined ? location.state.optimizedCost : parsedCached.optimizedCost,
        totalSavings: location.state.totalSavings !== undefined ? location.state.totalSavings : parsedCached.totalSavings
      };
      localStorage.setItem('activeTrip', JSON.stringify(data));
      return data;
    }
    const cached = localStorage.getItem('activeTrip');
    return cached ? JSON.parse(cached) : null;
  });
  const tripData = activeTrip?.tripData;
  const costs = activeTrip?.costs;
  const optimizedCost = activeTrip?.optimizedCost;
  const totalSavings = activeTrip?.totalSavings;

  const handlePrint = () => window.print();
  const handleDownload = () => {
    const text = `SmartTravel AI - Trip Summary\n\nFrom: ${tripData?.source}\nTo: ${tripData?.destination}\nPeople: ${tripData?.people}\nDays: ${tripData?.days}\nBudget: ₹${Number(tripData?.budget).toLocaleString()}\nEstimated Cost: ₹${costs?.total.toLocaleString()}\nOptimized Cost: ₹${(optimizedCost || costs?.total)?.toLocaleString()}\nSavings: ₹${(totalSavings || 0).toLocaleString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'trip-summary.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!tripData) {
    return (
      <div className="summary-empty page-enter">
        <div className="container text-center">
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📋</div>
          <h2>No Trip Data Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Please complete the trip planning flow to see your summary.
          </p>
          <button className="btn-primary" onClick={() => navigate('/trip-type')}>
            Start Planning
          </button>
        </div>
      </div>
    );
  }

  const TravelIcon = travelIcons[tripData.travelMode] || FaBus;
  const finalCost = optimizedCost || costs?.total || 0;
  const savings = totalSavings || (costs ? Math.max(costs.total - finalCost, 0) : 0);
  const budget = Number(tripData.budget) || 0;

  const summaryItems = [
    { label: 'From', value: tripData.source, icon: FaMapMarkerAlt, color: '#7c3aed' },
    { label: 'To', value: tripData.destination, icon: FaMapMarkerAlt, color: '#ec4899' },
    { label: 'People', value: tripData.people, icon: FaUsers, color: '#06b6d4' },
    { label: 'Duration', value: `${tripData.days} Days`, icon: FaCalendarAlt, color: '#10b981' },
    { label: 'Travel Mode', value: tripData.travelMode?.toUpperCase(), icon: TravelIcon, color: '#f59e0b' },
    { label: 'Trip Type', value: tripData.tripType === 'student' ? '🎓 Student' : '👨‍👩‍👧 Family', icon: FaUsers, color: '#8b5cf6' },
    { label: 'Hotel', value: tripData.hotelType, icon: FaHotel, color: '#3b82f6' },
    { label: 'Food', value: tripData.foodPref, icon: FaUtensils, color: '#14b8a6' },
  ];

  const costBreakdown = costs ? [
    { label: 'Travel', value: costs.travel, icon: '✈️' },
    { label: 'Hotel', value: costs.hotel, icon: '🏨' },
    { label: 'Food', value: costs.food, icon: '🍽️' },
    { label: 'Activities', value: costs.activities, icon: '🎡' },
    { label: 'Misc + GST + Emergency', value: costs.misc + costs.gst + costs.emergency, icon: '📋' },
  ] : [];

  return (
    <div className="summary-page page-enter">
      <div className="summary-page__bg" />

      <div className="container">
        {/* Header */}
        <div className="summary-page__header text-center">
          <div className="section-badge">🎉 Trip Ready!</div>
          <h1 className="summary-page__title">
            Your <span className="gradient-text">Trip Summary</span>
          </h1>
          <p className="summary-page__subtitle">
            Complete trip details and budget breakdown for your journey.
          </p>
          <div className="summary-actions">
            <button className="btn-primary btn-glow" onClick={handleDownload} id="download-summary-btn">
              <FaDownload /> Download Summary
            </button>
            <button className="btn-secondary" onClick={handlePrint} id="print-summary-btn">
              <FaPrint /> Print
            </button>
            <button className="btn-secondary" id="share-summary-btn">
              <FaShare /> Share
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="summary-hero-card glass-card">
          <div className="summary-hero-card__bg">
            <img
              src={`https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=70`}
              alt={tripData.destination}
              className="summary-hero-card__img"
            />
            <div className="summary-hero-card__overlay" />
          </div>
          <div className="summary-hero-card__content">
            <div className="summary-hero-badge">
              {tripData.tripType === 'student' ? '🎓 Student Trip' : '👨‍👩‍👧 Family Trip'}
            </div>
            <h2 className="summary-hero-title">
              {tripData.source} → {tripData.destination}
            </h2>
            <p className="summary-hero-meta">
              {tripData.people} travelers · {tripData.days} days · {tripData.travelMode?.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Budget Summary Cards */}
        <div className="summary-budget-row">
          <div className="summary-budget-card glass-card" style={{ '--bc': '#ef4444' }}>
            <div className="summary-budget-card__icon">💰</div>
            <div className="summary-budget-card__label">Your Budget</div>
            <div className="summary-budget-card__value" style={{ color: '#ef4444' }}>
              ₹{budget.toLocaleString()}
            </div>
          </div>
          <div className="summary-budget-card glass-card" style={{ '--bc': '#f59e0b' }}>
            <div className="summary-budget-card__icon">📊</div>
            <div className="summary-budget-card__label">Estimated Cost</div>
            <div className="summary-budget-card__value" style={{ color: '#f59e0b' }}>
              ₹{(costs?.total || 0).toLocaleString()}
            </div>
          </div>
          <div className="summary-budget-card glass-card" style={{ '--bc': '#10b981' }}>
            <div className="summary-budget-card__icon">🚀</div>
            <div className="summary-budget-card__label">Optimized Cost</div>
            <div className="summary-budget-card__value" style={{ color: '#10b981' }}>
              ₹{finalCost.toLocaleString()}
            </div>
          </div>
          <div className="summary-budget-card glass-card" style={{ '--bc': '#a78bfa' }}>
            <div className="summary-budget-card__icon">💎</div>
            <div className="summary-budget-card__label">Total Savings</div>
            <div className="summary-budget-card__value" style={{ color: '#a78bfa' }}>
              ₹{savings.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="summary-main-grid">
          {/* Trip Details */}
          <div className="glass-card summary-details-card">
            <h2 className="summary-section-title">
              <FaMapMarkerAlt /> Trip Details
            </h2>
            <div className="summary-items-grid">
              {summaryItems.map(({ label, value, icon: Icon, color }, i) => (
                <div key={i} className="summary-detail-item">
                  <div className="summary-detail-item__icon" style={{ background: color + '20', color }}>
                    <Icon />
                  </div>
                  <div>
                    <div className="summary-detail-item__label">{label}</div>
                    <div className="summary-detail-item__value">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Activities */}
            {tripData.activities?.length > 0 && (
              <div className="summary-activities">
                <p className="summary-activities__label">Preferred Activities</p>
                <div className="summary-activities__tags">
                  {tripData.activities.map(a => (
                    <span key={a} className="tag tag-primary">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="summary-breakdown-col">
            {costs && (
              <div className="glass-card summary-cost-card">
                <h2 className="summary-section-title">
                  <FaWallet /> Cost Breakdown
                </h2>
                <div className="summary-cost-list">
                  {costBreakdown.map(({ label, value, icon }, i) => (
                    <div key={i} className="summary-cost-row">
                      <span className="summary-cost-row__label">
                        <span>{icon}</span>{label}
                      </span>
                      <span className="summary-cost-row__value">₹{value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="summary-cost-row summary-cost-row--total">
                    <span>Total</span>
                    <span>₹{costs.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Attractions */}
            <div className="glass-card summary-attractions-card">
              <h2 className="summary-section-title">
                <FaCamera /> Recommended Attractions
              </h2>
              <div className="summary-attractions-list">
                {sampleAttractions.map(({ name, type, cost, rating }, i) => (
                  <div key={i} className="summary-attraction-item">
                    <div className="summary-attraction-left">
                      <div className="summary-attraction-dot" />
                      <div>
                        <p className="summary-attraction-name">{name}</p>
                        <p className="summary-attraction-type">{type}</p>
                      </div>
                    </div>
                    <div className="summary-attraction-right">
                      <span className="summary-attraction-cost">{cost}</span>
                      <span className="summary-attraction-rating">
                        <FaStar /> {rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Badge */}
        <div className="summary-ai-banner">
          <div className="summary-ai-banner__icon">🤖</div>
          <div>
            <strong>Optimized by SmartTravel AI</strong>
            <p>This trip plan was AI-analyzed for optimal budget utilization and experience quality.</p>
          </div>
          <div className="summary-ai-badge">
            <FaCheck /> AI Verified
          </div>
        </div>

        {/* Final CTAs */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
          <button className="btn-primary btn-glow" onClick={() => navigate('/expense')}>
            <FaBrain /> Open Expense Tracker <FaArrowRight />
          </button>
          <button className="btn-secondary" onClick={() => navigate('/tourist', { state: { tripData } })}>
            <FaCamera /> Explore Tourist Places
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

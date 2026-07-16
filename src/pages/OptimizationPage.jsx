import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaBrain, FaMagic, FaCheck, FaArrowRight, FaArrowDown,
  FaTrain, FaBus, FaBed, FaClock, FaPercent,
  FaMapMarkerAlt, FaUsers, FaLightbulb, FaRocket, FaMoneyBillWave
} from 'react-icons/fa';
import CountUp from '../components/CountUp';
import './OptimizationPage.css';

const aiTips = [
  { icon: FaTrain, title: 'Travel Overnight by Sleeper Train', desc: 'Save on one night hotel + travel costs. Book 3AC sleeper for 50% savings vs AC coach.', saving: '₹2,500', category: 'Travel', color: '#7c3aed' },
  { icon: FaBed, title: 'Switch to Hostel Accommodation', desc: 'Dormitory hostels are 70% cheaper than budget hotels with same cleanliness.', saving: '₹1,800', category: 'Hotel', color: '#06b6d4' },
  { icon: FaClock, title: 'Reduce Trip by 1-2 Days', desc: 'Focus on key attractions instead of spending extra days for marginal gains.', saving: '₹3,000', category: 'Duration', color: '#10b981' },
  { icon: FaBus, title: 'Use Local Public Transport', desc: 'Metro and local buses cost 90% less than cabs. Plan routes with Google Maps.', saving: '₹800', category: 'Local Travel', color: '#f59e0b' },
  { icon: FaMapMarkerAlt, title: 'Visit Free Attractions First', desc: 'Parks, beaches, ghats, forts with free entry save ₹200-500 per person.', saving: '₹1,200', category: 'Activities', color: '#ec4899' },
  { icon: FaPercent, title: 'Book Early Bird Discounts', desc: 'Book trains/hotels 30+ days in advance to get 20-40% discounts.', saving: '₹2,000', category: 'Booking', color: '#8b5cf6' },
  { icon: FaUsers, title: 'Travel on Weekdays', desc: 'Monday-Thursday flights and hotels are 30% cheaper than weekends.', saving: '₹1,500', category: 'Timing', color: '#3b82f6' },
  { icon: FaLightbulb, title: 'Choose Nearby Alternatives', desc: 'Explore nearby destinations with similar experiences at lower travel cost.', saving: '₹2,200', category: 'Destination', color: '#14b8a6' },
];

export default function OptimizationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTrip] = useState(() => {
    if (location.state?.tripData) {
      return { tripData: location.state.tripData, costs: location.state.costs };
    }
    const cached = localStorage.getItem('activeTrip');
    return cached ? JSON.parse(cached) : null;
  });
  const tripData = activeTrip?.tripData;
  const costs = activeTrip?.costs;
  const [selectedTips, setSelectedTips] = useState(new Set([0, 1, 2]));
  const [animate, setAnimate] = useState(false);
  const [aiThinking, setAiThinking] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setAiThinking(false), 2000);
    const t2 = setTimeout(() => setAnimate(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const toggleTip = (i) => {
    setSelectedTips(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  if (!tripData || !costs) {
    return (
      <div className="opt-empty page-enter">
        <div className="container text-center">
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🤖</div>
          <h2>No Budget Data Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Please complete budget analysis first.</p>
          <button className="btn-primary" onClick={() => navigate('/trip-type')}>Start Planning</button>
        </div>
      </div>
    );
  }

  const totalSavings = [...selectedTips].reduce((sum, i) => {
    const val = parseInt(aiTips[i].saving.replace(/[₹,]/g, ''), 10);
    return sum + val;
  }, 0);

  const originalCost = costs.total;
  const optimizedCost = Math.max(originalCost - totalSavings, 0);
  const savingsPct = Math.round((totalSavings / originalCost) * 100);
  const aiConfidence = Math.min(65 + selectedTips.size * 4, 98);

  const budget = Number(tripData?.budget) || 0;
  const withinBudget = optimizedCost <= budget;

  return (
    <div className="opt-page page-enter">
      <div className="opt-page__bg" />

      <div className="container">
        {/* Header */}
        <div className="opt-page__header text-center">
          <div className="section-badge">
            <FaBrain /> AI Budget Optimizer
          </div>
          <h1 className="opt-page__title">
            <span className="gradient-text">AI-Powered</span> Cost Optimization
          </h1>
          <p className="opt-page__subtitle">
            Our AI analyzed your trip and found smart ways to reduce costs without sacrificing experience.
          </p>
        </div>

        {/* AI Thinking Loader */}
        {aiThinking ? (
          <div className="ai-thinking">
            <div className="ai-thinking__brain">🧠</div>
            <div className="ai-thinking__bars">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="ai-thinking__bar" style={{ '--delay': `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="ai-thinking__text">AI is analyzing your trip details...</p>
            <div className="ai-thinking__dots">
              <span /><span /><span />
            </div>
          </div>
        ) : (
          <>
            {/* Savings Summary Cards */}
            <div className="opt-summary-grid">
              <div className="opt-summary-card glass-card">
                <div className="opt-summary-card__icon" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  <FaMoneyBillWave />
                </div>
                <div className="opt-summary-card__label">Original Cost</div>
                <div className="opt-summary-card__value" style={{ color: '#ef4444' }}>
                  {animate && <CountUp end={originalCost} duration={2} separator="," prefix="₹" />}
                </div>
              </div>

              <div className="opt-summary-card glass-card opt-summary-card--center">
                <div className="opt-arrow-down">
                  <FaArrowDown />
                </div>
                <div className="opt-savings-badge">
                  {animate && <CountUp end={totalSavings} duration={1.5} separator="," prefix="-₹" />}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Savings</div>
              </div>

              <div className="opt-summary-card glass-card">
                <div className="opt-summary-card__icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                  <FaRocket />
                </div>
                <div className="opt-summary-card__label">Optimized Cost</div>
                <div className="opt-summary-card__value" style={{ color: '#10b981' }}>
                  {animate && <CountUp end={optimizedCost} duration={2.5} separator="," prefix="₹" />}
                </div>
              </div>

              <div className="opt-summary-card glass-card">
                <div className="opt-summary-card__icon" style={{ background: 'rgba(124,58,237,0.1)', color: '#a78bfa' }}>
                  <FaPercent />
                </div>
                <div className="opt-summary-card__label">Savings</div>
                <div className="opt-summary-card__value" style={{ color: '#a78bfa' }}>
                  {animate && <CountUp end={savingsPct} duration={2} suffix="%" />}
                </div>
              </div>
            </div>

            {/* AI Confidence */}
            <div className="glass-card ai-confidence">
              <div className="ai-confidence__header">
                <div className="ai-confidence__label">
                  <FaBrain /> AI Confidence Score
                </div>
                <div className="ai-confidence__score">{aiConfidence}%</div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: animate ? `${aiConfidence}%` : '0%',
                    background: `linear-gradient(90deg, #7c3aed, #06b6d4)`
                  }}
                />
              </div>
              <p className="ai-confidence__note">
                Based on {selectedTips.size} applied optimizations | Budget status:
                <span style={{ color: withinBudget ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                  {withinBudget ? ' ✅ Within Budget' : ' ⚠️ Still Over Budget'}
                </span>
              </p>
            </div>

            {/* Status Banner */}
            <div className={`opt-status-banner ${withinBudget ? 'opt-status-banner--ok' : 'opt-status-banner--warn'}`}>
              <span className="opt-status-banner__icon">{withinBudget ? '🎉' : '💡'}</span>
              <div>
                <strong>
                  {withinBudget
                    ? `Your optimized trip fits within ₹${budget.toLocaleString()}!`
                    : `Select more optimizations to fit within your ₹${budget.toLocaleString()} budget.`}
                </strong>
                <p>
                  {withinBudget
                    ? `You're saving ₹${(budget - optimizedCost).toLocaleString()} extra!`
                    : `Still ₹${(optimizedCost - budget).toLocaleString()} over budget. Apply more tips below.`}
                </p>
              </div>
            </div>

            {/* AI Tips */}
            <div className="opt-tips-section">
              <h2 className="opt-tips-title">
                <FaMagic /> AI Recommendations
                <span className="opt-tips-subtitle">Click to select/deselect optimizations</span>
              </h2>
              <div className="opt-tips-grid">
                {aiTips.map((tip, i) => (
                  <div
                    key={i}
                    className={`ai-tip-card ${selectedTips.has(i) ? 'ai-tip-card--selected' : ''}`}
                    style={{ '--tip-color': tip.color }}
                    onClick={() => toggleTip(i)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="ai-tip-card__header">
                      <div className="ai-tip-card__icon-wrap" style={{ background: tip.color + '22', color: tip.color }}>
                        <tip.icon />
                      </div>
                      <div className="ai-tip-card__meta">
                        <span className="tag" style={{ background: tip.color + '22', color: tip.color, border: `1px solid ${tip.color}44` }}>
                          {tip.category}
                        </span>
                        <span className="ai-tip-card__saving">{tip.saving}</span>
                      </div>
                    </div>
                    <h3 className="ai-tip-card__title">{tip.title}</h3>
                    <p className="ai-tip-card__desc">{tip.desc}</p>
                    <div className="ai-tip-card__check">
                      {selectedTips.has(i) ? <FaCheck /> : <span>+</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="budget-actions" style={{ justifyContent: 'center', display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
              <button
                className="btn-primary btn-glow"
                onClick={() => navigate('/tourist', { state: { tripData } })}
              >
                <FaMapMarkerAlt /> View Tourist Places <FaArrowRight />
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/summary', { state: { tripData, costs, optimizedCost, totalSavings } })}
              >
                <FaCheck /> View Trip Summary
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

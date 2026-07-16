import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chart as ChartJS, registerables } from 'chart.js';

import {
  FaPlane, FaHotel, FaUtensils,
  FaCamera, FaBox, FaPercent, FaShieldAlt, FaMagic,
  FaArrowRight, FaDownload, FaMapMarkerAlt
} from 'react-icons/fa';
import CountUp from '../components/CountUp';
import './BudgetAnalysisPage.css';

ChartJS.register(...registerables);

const defaultCosts = {
  travel: 0,
  hotel: 0,
  food: 0,
  activities: 0,
  misc: 0,
  gst: 0,
  emergency: 0,
  total: 0
};

/* ── Cost Calculation Engine ── */
function calculateCosts(data) {
  const { people, days, travelMode, tripType, hotelType } = data;
  const p = Number(people) || 1;
  const d = Number(days) || 1;

  // Travel costs per person (one-way, multiplied by 2 for return)
  const travelRates = { bus: 400, train: 800, car: 1200, flight: 4000 };
  const travelCostPerPerson = (travelRates[travelMode] || 800) * d * 0.15 * 2;
  const travel = Math.round(travelCostPerPerson * p);

  // Hotel cost per night
  const hotelRates = {
    'Budget Hostel': 400,
    'Budget Hotel': 800,
    'Mid-Range Hotel': 1800,
    'Luxury Hotel': 4000,
    'Resort': 7000,
  };
  const hotelNightRate = hotelRates[hotelType] || (tripType === 'student' ? 500 : 2000);
  const hotel = Math.round(hotelNightRate * d * Math.ceil(p / 2));

  // Food cost per person per day
  const foodRatePerDay = tripType === 'student' ? 350 : 800;
  const food = Math.round(foodRatePerDay * p * d);

  // Activities
  const actRate = tripType === 'student' ? 300 : 600;
  const activities = Math.round(actRate * p * d);

  // Misc (shopping, transport local, etc.)
  const misc = Math.round((travel + hotel + food + activities) * 0.08);

  const subtotal = travel + hotel + food + activities + misc;
  const gst = Math.round(subtotal * 0.05);
  const emergency = Math.round(subtotal * 0.10);
  const total = subtotal + gst + emergency;

  return { travel, hotel, food, activities, misc, gst, emergency, total, subtotal };
}

export default function BudgetAnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [animate, setAnimate] = useState(false);

  const donutCanvasRef = useRef(null);
  const barCanvasRef = useRef(null);
  const donutChartRef = useRef(null);
  const barChartRef = useRef(null);

  // Load from router state or fall back to localStorage cache
  const [activeTrip, setActiveTripState] = useState(() => {
    if (location.state?.tripData) {
      const data = {
        tripData: location.state.tripData,
        costs: location.state.costs || calculateCosts(location.state.tripData)
      };
      localStorage.setItem('activeTrip', JSON.stringify(data));
      return data;
    }
    const cached = localStorage.getItem('activeTrip');
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!location.state?.tripData) return;
    const data = {
      tripData: location.state.tripData,
      costs: location.state.costs || calculateCosts(location.state.tripData)
    };
    localStorage.setItem('activeTrip', JSON.stringify(data));
    const timer = setTimeout(() => setActiveTripState(data), 0);
    return () => clearTimeout(timer);
  }, [location.state?.tripData, location.state?.costs]);

  const tripData = activeTrip?.tripData || null;
  const costs = useMemo(() => activeTrip?.costs || defaultCosts, [activeTrip]);

  const budget = Number(tripData?.budget) || 0;
  const overBudget = costs.total > budget;
  const budgetDiff = Math.abs(costs.total - budget);
  const budgetPercent = budget > 0 ? Math.min(Math.round((costs.total / budget) * 100), 999) : 0;

  const costItems = useMemo(() => [
    { label: 'Travel Cost', value: costs.travel, icon: FaPlane, color: '#7c3aed', emoji: '✈️' },
    { label: 'Hotel Cost', value: costs.hotel, icon: FaHotel, color: '#06b6d4', emoji: '🏨' },
    { label: 'Food Cost', value: costs.food, icon: FaUtensils, color: '#10b981', emoji: '🍽️' },
    { label: 'Activities', value: costs.activities, icon: FaCamera, color: '#f59e0b', emoji: '🎡' },
    { label: 'Miscellaneous', value: costs.misc, icon: FaBox, color: '#ec4899', emoji: '📦' },
    { label: 'GST (5%)', value: costs.gst, icon: FaPercent, color: '#8b5cf6', emoji: '📋' },
    { label: 'Emergency Fund', value: costs.emergency, icon: FaShieldAlt, color: '#ef4444', emoji: '🛡️' },
  ], [costs]);

  const donutData = useMemo(() => ({
    labels: costItems.map(c => c.label),
    datasets: [{
      data: costItems.map(c => c.value),
      backgroundColor: costItems.map(c => c.color + 'cc'),
      borderColor: costItems.map(c => c.color),
      borderWidth: 2,
      hoverOffset: 8,
    }]
  }), [costItems]);

  const barData = useMemo(() => ({
    labels: ['Travel', 'Hotel', 'Food', 'Activities', 'Misc', 'GST', 'Emergency'],
    datasets: [{
      label: 'Cost (₹)',
      data: costItems.map(c => c.value),
      backgroundColor: costItems.map(c => c.color + '99'),
      borderColor: costItems.map(c => c.color),
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  }), [costItems]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Poppins', size: 12 } }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString()}`
        }
      }
    }
  }), []);

  const barOptions = useMemo(() => ({
    ...chartOptions,
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: {
        ticks: {
          color: '#64748b',
          callback: (v) => '₹' + v.toLocaleString()
        },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  }), [chartOptions]);

  useEffect(() => {
    if (donutChartRef.current) donutChartRef.current.destroy();
    if (barChartRef.current) barChartRef.current.destroy();

    if (donutCanvasRef.current) {
      const ctx = donutCanvasRef.current.getContext('2d');
      donutChartRef.current = new ChartJS(ctx, {
        type: 'doughnut',
        data: donutData,
        options: chartOptions
      });
    }

    if (barCanvasRef.current) {
      const ctx = barCanvasRef.current.getContext('2d');
      barChartRef.current = new ChartJS(ctx, {
        type: 'bar',
        data: barData,
        options: barOptions
      });
    }

    return () => {
      if (donutChartRef.current) donutChartRef.current.destroy();
      if (barChartRef.current) barChartRef.current.destroy();
    };
  }, [donutData, chartOptions, barData, barOptions]);

  if (!activeTrip || !activeTrip.tripData) {
    return (
      <div className="budget-empty page-enter">
        <div className="container text-center">
          <div className="budget-empty__icon">📊</div>
          <h2>No Trip Data Found</h2>
          <p>Please plan your trip first to see the budget analysis.</p>
          <button className="btn-primary mt-6" onClick={() => navigate('/trip-type')}>
            Start Planning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-page page-enter">
      <div className="budget-page__bg" />
      <div className="container">

        {/* Header */}
        <div className="budget-page__header text-center">
          <div className="section-badge"><FaMagic /> Step 3 of 3 — Budget Analysis</div>
          <h1 className="budget-page__title">
            Your <span className="gradient-text">Budget Breakdown</span>
          </h1>
          <p className="budget-page__subtitle">
            AI-calculated cost breakdown for your trip from <strong>{tripData.source}</strong> to <strong>{tripData.destination}</strong>
          </p>
        </div>

        {/* Trip Summary Pill */}
        <div className="budget-trip-summary">
          <div className="budget-trip-item">
            <FaMapMarkerAlt />
            <span>{tripData.source} → {tripData.destination}</span>
          </div>
          <div className="budget-trip-item">👥 {tripData.people} People</div>
          <div className="budget-trip-item">📅 {tripData.days} Days</div>
          <div className="budget-trip-item">
            {tripData.tripType === 'student' ? '🎓 Student' : '👨‍👩‍👧 Family'}
          </div>
          <div className="budget-trip-item">
            💰 Budget: ₹{Number(budget).toLocaleString()}
          </div>
        </div>

        {/* Total Banner */}
        <div className={`budget-total-banner ${overBudget ? 'budget-total-banner--over' : 'budget-total-banner--ok'}`}>
          <div className="budget-total-banner__left">
            <span className="budget-total-banner__icon">{overBudget ? '⚠️' : '✅'}</span>
            <div>
              <p className="budget-total-banner__label">Total Estimated Cost</p>
              <p className="budget-total-banner__status">
                {overBudget
                  ? `Exceeds budget by ₹${budgetDiff.toLocaleString()}`
                  : `₹${budgetDiff.toLocaleString()} under budget — Great!`}
              </p>
            </div>
          </div>
          <div className="budget-total-banner__right">
            <div className="budget-total-value">
              {animate && <CountUp end={costs.total} duration={2.5} separator="," prefix="₹" />}
            </div>
            <div className="budget-total-percent">
              {budgetPercent}% of your budget
            </div>
          </div>
        </div>

        {/* Cost Cards Grid */}
        <div className="budget-cards-grid">
          {costItems.map(({ label, value, color, emoji }, i) => (
            <div key={i} className="budget-cost-card glass-card" style={{ '--card-color': color }}>
              <div className="budget-cost-card__emoji">{emoji}</div>
              <div className="budget-cost-card__label">{label}</div>
              <div className="budget-cost-card__value">
                {animate && <CountUp end={value} duration={2} separator="," prefix="₹" />}
              </div>
              <div className="budget-cost-card__bar">
                <div
                  className="budget-cost-card__fill"
                  style={{
                    width: animate ? `${Math.round((value / costs.total) * 100)}%` : '0%',
                    background: color
                  }}
                />
              </div>
              <div className="budget-cost-card__pct">
                {Math.round((value / costs.total) * 100)}%
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="budget-charts">
          <div className="chart-container budget-donut-wrap">
            <h3 className="chart-title">💰 Cost Distribution</h3>
            <div className="donut-wrap">
              <canvas ref={donutCanvasRef} />
            </div>
          </div>
          <div className="chart-container budget-bar-wrap">
            <h3 className="chart-title">📊 Cost Breakdown Bar Chart</h3>
            <div className="bar-wrap">
              <canvas ref={barCanvasRef} style={{ maxHeight: '280px' }} />
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="glass-card budget-progress-card">
          <h3 className="budget-progress-card__title">Budget Utilization</h3>
          <div className="budget-progress-row">
            <div className="budget-progress-row__label">
              <span>Estimated Cost</span>
              <strong style={{ color: overBudget ? '#ef4444' : '#10b981' }}>
                ₹{costs.total.toLocaleString()}
              </strong>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: animate ? `${Math.min(budgetPercent, 100)}%` : '0%',
                  background: overBudget
                    ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                    : 'linear-gradient(90deg, #10b981, #059669)'
                }}
              />
            </div>
            <div className="budget-progress-row__label">
              <span>Your Budget</span>
              <strong style={{ color: '#10b981' }}>₹{budget.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="budget-actions">
          <button
            className="btn-primary btn-glow"
            onClick={() => navigate('/optimization', { state: { tripData, costs } })}
          >
            <FaMagic /> {overBudget ? 'Optimize Budget (AI)' : 'View AI Suggestions'} <FaArrowRight />
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/tourist', { state: { tripData } })}
          >
            <FaMapMarkerAlt /> See Tourist Places
          </button>
          <button className="btn-secondary" onClick={() => navigate('/summary', { state: { tripData, costs } })}>
            <FaDownload /> View Trip Summary
          </button>
        </div>
      </div>
    </div>
  );
}

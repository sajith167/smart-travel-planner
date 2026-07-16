import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';

import {
  FaPlus, FaTrash, FaExclamationTriangle, FaBrain,
  FaShoppingBag, FaUtensils, FaHotel, FaCar, FaGasPump,
  FaTicketAlt, FaGamepad, FaEllipsisH, FaChartPie, FaTimes, FaEdit
} from 'react-icons/fa';
import CountUp from '../components/CountUp';
import './ExpenseTracker.css';

ChartJS.register(...registerables);

const CATEGORIES = [
  { id: 'food', label: 'Food', icon: FaUtensils, color: '#10b981' },
  { id: 'travel', label: 'Travel', icon: FaCar, color: '#7c3aed' },
  { id: 'hotel', label: 'Hotel', icon: FaHotel, color: '#06b6d4' },
  { id: 'shopping', label: 'Shopping', icon: FaShoppingBag, color: '#f59e0b' },
  { id: 'fuel', label: 'Fuel', icon: FaGasPump, color: '#ef4444' },
  { id: 'tickets', label: 'Tickets', icon: FaTicketAlt, color: '#ec4899' },
  { id: 'entertainment', label: 'Entertainment', icon: FaGamepad, color: '#8b5cf6' },
  { id: 'others', label: 'Others', icon: FaEllipsisH, color: '#64748b' },
];

const TOTAL_BUDGET = 15000;

const demoExpenses = [
  { id: 1, category: 'travel', desc: 'Train tickets to Goa', amount: 2400, date: '2024-01-15' },
  { id: 2, category: 'hotel', desc: 'Hostel - 3 nights', amount: 1800, date: '2024-01-15' },
  { id: 3, category: 'food', desc: 'Breakfast + Lunch', amount: 450, date: '2024-01-16' },
  { id: 4, category: 'entertainment', desc: 'Beach activities', amount: 800, date: '2024-01-16' },
  { id: 5, category: 'shopping', desc: 'Souvenirs', amount: 600, date: '2024-01-17' },
];

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [budget] = useState(() => {
    const cached = localStorage.getItem('activeTrip');
    if (cached) {
      const parsed = JSON.parse(cached);
      const cost = parsed.optimizedCost || parsed.costs?.total || parsed.tripData?.budget;
      if (cost) return Number(cost);
    }
    return TOTAL_BUDGET;
  });
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState({ category: 'food', desc: '', amount: '' });
  const [animate, setAnimate] = useState(false);

  const donutCanvasRef = useRef(null);
  const barCanvasRef = useRef(null);
  const donutChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 200);
    
    // Load expenses from SQLite database
    fetch('/api/expenses')
      .then(res => {
        if (!res.ok) throw new Error('API server returned error status');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setExpenses(data);
        } else {
          setExpenses(demoExpenses);
        }
      })
      .catch(err => {
        console.warn('Backend expenses API failed, using client demo state:', err.message);
        setExpenses(demoExpenses);
      });

    return () => clearTimeout(t);
  }, []);

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - totalSpent;
  const usedPct = Math.min(Math.round((totalSpent / budget) * 100), 100);
  const isWarning = usedPct >= 70;
  const isOver = totalSpent > budget;

  // Category totals
  const catTotals = useMemo(() => CATEGORIES.map(c => ({
    ...c,
    total: expenses.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0)
  })).filter(c => c.total > 0), [expenses]);

  const donutData = useMemo(() => ({
    labels: catTotals.map(c => c.label),
    datasets: [{
      data: catTotals.map(c => c.total),
      backgroundColor: catTotals.map(c => c.color + 'cc'),
      borderColor: catTotals.map(c => c.color),
      borderWidth: 2,
      hoverOffset: 8,
    }]
  }), [catTotals]);

  const barData = useMemo(() => ({
    labels: catTotals.map(c => c.label),
    datasets: [{
      label: 'Amount Spent (₹)',
      data: catTotals.map(c => c.total),
      backgroundColor: catTotals.map(c => c.color + 'aa'),
      borderColor: catTotals.map(c => c.color),
      borderWidth: 2,
      borderRadius: 8,
    }]
  }), [catTotals]);

  const chartOpts = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Poppins', size: 11 } } },
      tooltip: { callbacks: { label: ctx => ` ₹${ctx.parsed.toLocaleString()}` } }
    }
  }), []);

  const barOpts = useMemo(() => ({
    ...chartOpts,
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#64748b', callback: v => '₹' + v.toLocaleString() }, grid: { color: 'rgba(255,255,255,0.04)' } }
    }
  }), [chartOpts]);

  useEffect(() => {
    if (donutChartRef.current) donutChartRef.current.destroy();
    if (barChartRef.current) barChartRef.current.destroy();

    if (donutCanvasRef.current && catTotals.length > 0) {
      const ctx = donutCanvasRef.current.getContext('2d');
      donutChartRef.current = new ChartJS(ctx, {
        type: 'doughnut',
        data: donutData,
        options: chartOpts
      });
    }

    if (barCanvasRef.current && catTotals.length > 0) {
      const ctx = barCanvasRef.current.getContext('2d');
      barChartRef.current = new ChartJS(ctx, {
        type: 'bar',
        data: barData,
        options: barOpts
      });
    }

    return () => {
      if (donutChartRef.current) donutChartRef.current.destroy();
      if (barChartRef.current) barChartRef.current.destroy();
    };
  }, [expenses, donutData, chartOpts, barData, barOpts, catTotals]);

  const handleStartEdit = (exp) => {
    setEditingExpense(exp);
    setForm({ category: exp.category, desc: exp.desc, amount: String(exp.amount) });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingExpense(null);
    setForm({ category: 'food', desc: '', amount: '' });
    setShowModal(false);
  };

  const addExpense = async () => {
    if (!form.desc.trim() || !form.amount || Number(form.amount) <= 0) return;
    
    const newExp = {
      category: form.category,
      desc: form.desc,
      amount: Number(form.amount),
      date: new Date().toISOString().slice(0, 10),
    };

    if (editingExpense) {
      try {
        const response = await fetch(`/api/expenses/${editingExpense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExp)
        });
        if (!response.ok) throw new Error('API server failed to update');
        const updatedItem = await response.json();
        setExpenses(prev => prev.map(e => e.id === editingExpense.id ? updatedItem : e));
      } catch (err) {
        console.warn('Backend expense update failed, updating locally:', err.message);
        setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...e, ...newExp } : e));
      }
    } else {
      try {
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newExp)
        });
        if (!response.ok) throw new Error('API server failed to save');
        const savedItem = await response.json();
        setExpenses(prev => [savedItem, ...prev]);
      } catch (err) {
        console.warn('Backend expense save failed, using local fallback:', err.message);
        setExpenses(prev => [
          {
            id: Date.now(),
            ...newExp
          },
          ...prev
        ]);
      }
    }

    handleCloseModal();
  };

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('API server failed to delete');
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.warn('Backend expense delete failed, removing locally:', err.message);
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const getCat = (id) => CATEGORIES.find(c => c.id === id);

  const aiSuggestions = [
    'Switch to cooking at hostel for 2 days to save ₹900',
    'Use metro instead of cab — save ₹200/day',
    'Visit free beaches in the morning — same experience!',
    'Book activities in groups for 30% discount',
  ];

  return (
    <div className="expense-page page-enter">
      <div className="expense-page__bg" />

      <div className="container">
        {/* Header */}
        <div className="expense-page__header text-center">
          <div className="section-badge"><FaChartPie /> Expense Tracker</div>
          <h1 className="expense-page__title">
            Smart <span className="gradient-text">Expense Dashboard</span>
          </h1>
          <p className="expense-page__subtitle">
            Track every expense in real-time with AI-powered budget alerts.
          </p>
        </div>

        {/* Warning Banner */}
        {(isWarning || isOver) && (
          <div className={`expense-warning ${isOver ? 'expense-warning--over' : 'expense-warning--warn'}`}>
            <FaExclamationTriangle />
            <div>
              <strong>
                {isOver ? '🚨 Budget Exceeded!' : '⚠️ 70% Budget Used'}
              </strong>
              <p>
                {isOver
                  ? `You've exceeded your budget by ₹${(totalSpent - budget).toLocaleString()}. AI suggests cutting back on non-essentials.`
                  : 'You\'ve used 70% of your budget. Consider reviewing your spending.'}
              </p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="expense-summary-grid">
          {[
            { label: 'Total Budget', value: budget, icon: '💰', color: '#7c3aed', prefix: '₹' },
            { label: 'Total Spent', value: totalSpent, icon: '💸', color: isOver ? '#ef4444' : '#f59e0b', prefix: '₹' },
            { label: 'Remaining', value: Math.abs(remaining), icon: remaining < 0 ? '⚠️' : '✅', color: remaining < 0 ? '#ef4444' : '#10b981', prefix: remaining < 0 ? '-₹' : '₹' },
            { label: 'Transactions', value: expenses.length, icon: '📋', color: '#06b6d4', prefix: '' },
          ].map(({ label, value, icon, color, prefix }, i) => (
            <div key={i} className="expense-summary-card glass-card" style={{ '--card-color': color }}>
              <div className="expense-summary-card__icon">{icon}</div>
              <div className="expense-summary-card__label">{label}</div>
              <div className="expense-summary-card__value" style={{ color }}>
                {animate && (
                  <CountUp
                    end={value}
                    duration={1.5}
                    separator=","
                    prefix={prefix}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Budget Progress */}
        <div className="glass-card expense-budget-card">
          <div className="expense-budget-header">
            <span className="expense-budget-label">Budget Progress</span>
            <span className="expense-budget-pct" style={{ color: isOver ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981' }}>
              {usedPct}% Used
            </span>
          </div>
          <div className="progress-bar" style={{ height: 12 }}>
            <div
              className="progress-fill"
              style={{
                width: animate ? `${usedPct}%` : '0%',
                background: isOver
                  ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                  : isWarning
                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                    : 'linear-gradient(90deg, #10b981, #059669)'
              }}
            />
          </div>
          <div className="expense-budget-footer">
            <span>₹0</span>
            <span>₹{(budget / 2).toLocaleString()}</span>
            <span>₹{budget.toLocaleString()}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="expense-main-grid">
          {/* Left: List + Add */}
          <div className="expense-list-col">
            <div className="expense-list-header">
              <h2 className="expense-list-title">Recent Expenses</h2>
              <button
                className="btn-primary expense-add-btn"
                onClick={() => setShowModal(true)}
                id="add-expense-btn"
              >
                <FaPlus /> Add Expense
              </button>
            </div>

            {/* Category filter chips */}
            <div className="expense-cat-chips">
              {CATEGORIES.map(c => {
                const total = expenses.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0);
                if (!total) return null;
                return (
                  <div key={c.id} className="expense-cat-chip" style={{ '--cat-color': c.color }}>
                    <c.icon style={{ color: c.color }} />
                    <span>{c.label}</span>
                    <strong>₹{total.toLocaleString()}</strong>
                  </div>
                );
              })}
            </div>

            {/* Expense List */}
            <div className="expense-list">
              {expenses.map(exp => {
                const cat = getCat(exp.category);
                return (
                  <div key={exp.id} className="expense-item glass-card">
                    <div className="expense-item__icon" style={{ background: cat.color + '20', color: cat.color }}>
                      <cat.icon />
                    </div>
                    <div className="expense-item__info">
                      <div className="expense-item__desc">{exp.desc}</div>
                      <div className="expense-item__meta">
                        <span className="expense-item__cat" style={{ color: cat.color }}>{cat.label}</span>
                        <span className="expense-item__date">{exp.date}</span>
                      </div>
                    </div>
                    <div className="expense-item__amount">₹{exp.amount.toLocaleString()}</div>
                    <div className="expense-item__actions">
                      <button
                        className="expense-item__edit"
                        onClick={() => handleStartEdit(exp)}
                        aria-label="Edit expense"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="expense-item__delete"
                        onClick={() => deleteExpense(exp.id)}
                        aria-label="Delete expense"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
              {expenses.length === 0 && (
                <div className="expense-empty">
                  <span style={{ fontSize: '3rem' }}>💼</span>
                  <p>No expenses yet. Click "Add Expense" to start tracking.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Charts */}
          <div className="expense-charts-col">
            {catTotals.length > 0 ? (
              <>
                <div className="chart-container">
                  <h3 className="chart-title">💰 Spending by Category</h3>
                  <div style={{ maxWidth: 260, margin: '0 auto' }}>
                    <canvas ref={donutCanvasRef} />
                  </div>
                </div>
                <div className="chart-container">
                  <h3 className="chart-title">📊 Category Breakdown</h3>
                  <canvas ref={barCanvasRef} />
                </div>
              </>
            ) : (
              <div className="chart-container" style={{ textAlign: 'center', padding: 40 }}>
                <FaChartPie style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: 16 }} />
                <p style={{ color: 'var(--text-muted)' }}>Charts will appear after adding expenses</p>
              </div>
            )}

            {/* AI Suggestions */}
            {isWarning && (
              <div className="ai-card expense-ai-suggestions">
                <h3 className="expense-ai-title">
                  <FaBrain /> AI Budget Suggestions
                </h3>
                <div className="expense-ai-list">
                  {aiSuggestions.map((s, i) => (
                    <div key={i} className="expense-ai-item">
                      <span className="expense-ai-bullet">💡</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
              <button className="modal__close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal__body">
              <div className="input-group">
                <label className="input-label">Category</label>
                <div className="expense-cat-grid">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`expense-cat-btn ${form.category === c.id ? 'expense-cat-btn--active' : ''}`}
                      style={{ '--cat-color': c.color }}
                      onClick={() => setForm(f => ({ ...f, category: c.id }))}
                    >
                      <c.icon />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="exp-desc">Description</label>
                <div className="input-wrap">
                  <input
                    id="exp-desc"
                    className="input-field"
                    placeholder="What did you spend on?"
                    value={form.desc}
                    onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="exp-amount">Amount (₹)</label>
                <div className="input-wrap">
                  <input
                    id="exp-amount"
                    type="number"
                    className="input-field"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="modal__footer">
              <button className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-primary" onClick={addExpense} id="save-expense-btn">
                {editingExpense ? 'Save Changes' : <><FaPlus /> Add Expense</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

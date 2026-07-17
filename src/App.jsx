import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FaPlane } from 'react-icons/fa';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTop';
import AIAssistant from './components/AIAssistant';
import ScrollToTop from './components/ScrollToTopHelper';

// Pages
import LandingPage from './pages/LandingPage';
import TripTypeSelection from './pages/TripTypeSelection';
import TripPlanningPage from './pages/TripPlanningPage';
import BudgetAnalysisPage from './pages/BudgetAnalysisPage';
import OptimizationPage from './pages/OptimizationPage';
import TouristPage from './pages/TouristPage';
import TripSummaryPage from './pages/TripSummaryPage';
import ExpenseTracker from './pages/ExpenseTracker';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function MainLayout() {
  const { pathname } = useLocation();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setPageLoading(true);
    }, 0);

    const hideTimer = setTimeout(() => {
      setPageLoading(false);
    }, 450);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  return (
    <div className="app-container">
      {/* Dynamic ambient backgrounds */}
      <div className="glow-bubble" />
      <div className="glow-bubble glow-bubble--secondary" />

      {/* Sticky header navbar */}
      <Navbar />

      {/* Page Transition Loader */}
      {pageLoading && (
        <div className="page-transition-loader">
          <div className="loader-content">
            <div className="loader-logo">
              <FaPlane className="loader-plane-icon" />
            </div>
            <div className="loader-spinner"></div>
            <p className="loader-text">AI is mapping your journey...</p>
          </div>
        </div>
      )}

      {/* Routing content area */}
      <main className="main-content">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/trip-type" element={<TripTypeSelection />} />
            <Route path="/plan" element={<TripPlanningPage />} />
            <Route path="/budget" element={<BudgetAnalysisPage />} />
            <Route path="/optimization" element={<OptimizationPage />} />
            <Route path="/tourist" element={<TouristPage />} />
            <Route path="/summary" element={<TripSummaryPage />} />
            <Route path="/expense" element={<ExpenseTracker />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Floating interactive AI widget */}
      <AIAssistant />

      {/* Scroll to Top floating button */}
      {pathname !== '/' && <ScrollToTopButton />}

      {/* Page footer */}
      {pathname !== '/' && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout />
      <SpeedInsights />
    </Router>
  );
}

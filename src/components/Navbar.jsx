import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaPlane, FaBars, FaTimes, FaUser, FaMoon, FaSun,
  FaHome, FaRoute, FaWallet, FaMagic, FaMapMarkerAlt,
  FaChartPie, FaInfoCircle, FaEnvelope
} from 'react-icons/fa';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/', icon: FaHome },
  { label: 'Trip Planner', path: '/trip-type', icon: FaRoute },
  { label: 'Budget', path: '/budget', icon: FaWallet },
  { label: 'Optimization', path: '/optimization', icon: FaMagic },
  { label: 'Tourist Places', path: '/tourist', icon: FaMapMarkerAlt },
  { label: 'Expense Tracker', path: '/expense', icon: FaChartPie },
  { label: 'About', path: '/about', icon: FaInfoCircle },
  { label: 'Contact', path: '/contact', icon: FaEnvelope },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleNav = (path) => { navigate(path); setMenuOpen(false); };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__container">
          {/* Logo */}
          <div className="navbar__logo" onClick={() => handleNav('/')}>
            <div className="navbar__logo-icon">
              <FaPlane />
            </div>
            <div className="navbar__logo-text">
              <span className="navbar__logo-main">SmartTravel</span>
              <span className="navbar__logo-sub">AI Planner</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <ul className="navbar__links">
            {navLinks.map(({ label, path, icon: Icon }) => (
              <li key={path}>
                <button
                  className={`navbar__link ${location.pathname === path ? 'navbar__link--active' : ''}`}
                  onClick={() => handleNav(path)}
                >
                  <Icon className="navbar__link-icon" />
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="navbar__actions">
            <button
              className="navbar__action-btn"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button className="navbar__action-btn navbar__avatar" aria-label="User profile">
              <FaUser />
            </button>
            <button
              className="btn-primary navbar__cta"
              onClick={() => handleNav('/trip-type')}
            >
              Start Planning
            </button>
            <button
              className="navbar__mobile-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <div className="navbar__mobile-inner">
          {navLinks.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              className={`navbar__mobile-link ${location.pathname === path ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => handleNav(path)}
            >
              <Icon />
              {label}
            </button>
          ))}
          <button className="btn-primary w-full mt-4" onClick={() => handleNav('/trip-type')}>
            🚀 Start Planning
          </button>
        </div>
      </div>
      {menuOpen && <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
}

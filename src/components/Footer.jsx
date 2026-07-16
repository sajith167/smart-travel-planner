import { FaPlane, FaGlobe, FaHeart, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaMapMarkerAlt, FaPhone, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const footerLinks = {
  Product: ['AI Trip Planner', 'Budget Optimizer', 'Expense Tracker', 'Tourist Guide', 'Smart Insights'],
  Company: ['About Us', 'Team', 'Careers', 'Press Kit', 'Blog'],
  Support: ['Help Center', 'Documentation', 'API Docs', 'Community', 'Contact Us'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Licenses'],
};

export default function Footer() {
  const navigate = useNavigate();

  const handleLinkClick = (e, link) => {
    if (link === 'Contact Us') {
      e.preventDefault();
      navigate('/contact');
    } else if (link === 'About Us') {
      e.preventDefault();
      navigate('/about');
    } else if (link === 'AI Trip Planner') {
      e.preventDefault();
      navigate('/trip-type');
    } else if (link === 'Budget Optimizer') {
      e.preventDefault();
      navigate('/optimization');
    } else if (link === 'Expense Tracker') {
      e.preventDefault();
      navigate('/expense');
    } else if (link === 'Tourist Guide') {
      e.preventDefault();
      navigate('/tourist');
    }
  };

  return (
    <footer className="footer">
      {/* Glow line */}
      <div className="footer__glow-line" />

      <div className="container">
        {/* Top Section */}
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo" onClick={() => navigate('/')}>
              <div className="footer__logo-icon">
                <FaPlane />
              </div>
              <div>
                <div className="footer__logo-main">SmartTravel</div>
                <div className="footer__logo-sub">AI Planner</div>
              </div>
            </div>
            <p className="footer__desc">
              Plan smarter journeys with the power of AI. Budget-optimized travel planning for students and families.
            </p>

            {/* Newsletter */}
            <div className="footer__newsletter">
              <p className="footer__newsletter-label">✨ Get travel insights</p>
              <div className="footer__newsletter-form">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="footer__newsletter-input"
                  aria-label="Email for newsletter"
                />
                <button className="footer__newsletter-btn" aria-label="Subscribe">
                  <FaArrowRight />
                </button>
              </div>
            </div>

            {/* Social */}
            <div className="footer__social">
              {[
                { icon: FaTwitter, label: 'Twitter' },
                { icon: FaInstagram, label: 'Instagram' },
                { icon: FaLinkedin, label: 'LinkedIn' },
                { icon: FaGithub, label: 'GitHub' },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" className="footer__social-btn" aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="footer__links-grid">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="footer__link-group">
                <h4 className="footer__link-title">{category}</h4>
                <ul className="footer__link-list">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="footer__link" onClick={(e) => handleLinkClick(e, link)}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="footer__contact-strip">
          <div className="footer__contact-item">
            <FaEnvelope />
            <span>hello@smarttravel.ai</span>
          </div>
          <div className="footer__contact-item">
            <FaMapMarkerAlt />
            <span>Bengaluru, India 🇮🇳</span>
          </div>
          <div className="footer__contact-item">
            <FaPhone />
            <span>+91 98765 43210</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2024 SmartTravel AI. Made with <FaHeart className="footer__heart" /> in India
          </p>
          <div className="footer__bottom-badges">
            <span className="footer__badge">🏆 Hackathon MVP</span>
            <span className="footer__badge">🤖 AI-Powered</span>
            <span className="footer__badge">🎓 Student Friendly</span>
          </div>
          <p className="footer__built">
            Built with <FaGlobe className="footer__globe" /> React + Vite
          </p>
        </div>
      </div>
    </footer>
  );
}

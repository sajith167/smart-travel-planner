import { useNavigate } from 'react-router-dom';
import {
  FaRocket, FaHeart, FaTrophy, FaGlobe,
  FaUsers, FaArrowRight, FaLinkedin, FaTwitter
} from 'react-icons/fa';
import './AboutPage.css';

const team = [
  { name: 'Arjun Mehta', role: 'AI/ML Engineer', emoji: '👨‍💻', skill: 'Budget Prediction Models' },
  { name: 'Priya Nair', role: 'Full Stack Dev', emoji: '👩‍💻', skill: 'React & Node.js' },
  { name: 'Rohan Das', role: 'UX Designer', emoji: '🎨', skill: 'Premium UI/UX Design' },
  { name: 'Kavya Reddy', role: 'Data Analyst', emoji: '📊', skill: 'Travel Data Insights' },
];

const awards = [
  { title: 'Best AI Innovation', event: 'IIT Bombay TechFest 2024', emoji: '🥇' },
  { title: 'Top Travel Startup', event: 'Startup India Hackathon', emoji: '🏆' },
  { title: 'People\'s Choice', event: 'NASSCOM Innovation Summit', emoji: '💎' },
  { title: 'Best Student Project', event: 'Smart India Hackathon', emoji: '🎓' },
];

const milestones = [
  { year: '2023', event: 'Project inception at college hackathon' },
  { year: 'Jan 2024', event: 'Won IIT Bombay TechFest AI Innovation Award' },
  { year: 'Mar 2024', event: 'Launched beta with 1,000 users' },
  { year: 'Jun 2024', event: '10,000 trips planned, ₹50L saved' },
  { year: 'Sep 2024', event: 'Featured in Economic Times Startup Edition' },
  { year: 'Dec 2024', event: '50,000+ travelers, Series A funding' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-page page-enter">
      <div className="about-page__bg" />

      <div className="container">
        {/* Hero */}
        <div className="about-hero text-center">
          <div className="section-badge"><FaRocket /> Our Story</div>
          <h1 className="about-hero__title">
            Built by Students,
            <br />
            <span className="gradient-text">For Every Traveler</span>
          </h1>
          <p className="about-hero__desc">
            SmartTravel AI was born in a college dorm room at 2 AM before a group trip to Goa.
            We kept running over budget. We knew there had to be a smarter way. So we built one.
          </p>
        </div>

        {/* Mission */}
        <div className="about-mission glass-card">
          <div className="about-mission__icon">🎯</div>
          <h2 className="about-mission__title">Our Mission</h2>
          <p className="about-mission__text">
            To democratize travel by making AI-powered budget optimization accessible to every Indian traveler —
            from college students exploring on ₹500/day to families planning dream vacations.
            We believe every trip should be memorable, not stressful.
          </p>
        </div>

        {/* Awards */}
        <div className="section">
          <div className="text-center">
            <div className="section-badge"><FaTrophy /> Recognition</div>
            <h2 className="section-title">
              Awards & <span className="gradient-text">Achievements</span>
            </h2>
          </div>
          <div className="grid-4" style={{ marginTop: 40 }}>
            {awards.map(({ title, event, emoji }, i) => (
              <div key={i} className="award-card glass-card">
                <div className="award-card__emoji">{emoji}</div>
                <h3 className="award-card__title">{title}</h3>
                <p className="award-card__event">{event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="section">
          <div className="text-center">
            <div className="section-badge"><FaGlobe /> Journey</div>
            <h2 className="section-title">Our <span className="gradient-text">Milestones</span></h2>
          </div>
          <div className="timeline">
            {milestones.map(({ year, event }, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}>
                <div className="timeline-dot" />
                <div className="timeline-content glass-card">
                  <span className="timeline-year">{year}</span>
                  <p className="timeline-event">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="section">
          <div className="text-center">
            <div className="section-badge"><FaUsers /> Team</div>
            <h2 className="section-title">Meet the <span className="gradient-text">Builders</span></h2>
          </div>
          <div className="grid-4" style={{ marginTop: 40 }}>
            {team.map(({ name, role, emoji, skill }, i) => (
              <div key={i} className="team-card glass-card">
                <div className="team-card__avatar">{emoji}</div>
                <h3 className="team-card__name">{name}</h3>
                <p className="team-card__role">{role}</p>
                <p className="team-card__skill">{skill}</p>
                <div className="team-card__social">
                  <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                  <a href="#" aria-label="Twitter"><FaTwitter /></a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="about-values">
          {[
            { icon: '🎓', title: 'Student First', desc: 'Every feature is designed with budget-conscious students in mind.' },
            { icon: '🤖', title: 'AI at Core', desc: 'Machine learning powers every recommendation and optimization.' },
            { icon: FaHeart, title: 'Made with Love', desc: 'Built by passionate travelers who understand the joy of exploration.', isIcon: true },
          ].map(({ icon: Icon, title, desc, isIcon }, i) => (
            <div key={i} className="value-card glass-card">
              <div className="value-card__icon">
                {isIcon ? <Icon /> : Icon}
              </div>
              <h3 className="value-card__title">{title}</h3>
              <p className="value-card__desc">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="about-cta text-center">
          <h2 className="about-cta__title">Ready to Plan Your Next Adventure?</h2>
          <p className="about-cta__desc">Join 50,000+ travelers who plan smarter with SmartTravel AI</p>
          <button className="btn-primary btn-glow" onClick={() => navigate('/trip-type')} style={{ padding: '18px 48px' }}>
            <FaRocket /> Start Planning Now <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

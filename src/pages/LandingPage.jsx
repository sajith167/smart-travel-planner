import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlane, FaGlobe, FaChartPie, FaMapMarkerAlt,
  FaMagic, FaArrowRight, FaRocket, FaWallet
} from 'react-icons/fa';
import './LandingPage.css';


/* ── Particles Canvas ── */
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];
    const W = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    W();
    window.addEventListener('resize', W);

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '124,58,237' : Math.random() > 0.5 ? '79,70,229' : '6,182,212'
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', W); };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" />;
}

/* ── Floating 3D Elements ── */
function FloatingElements() {
  return (
    <div className="floating-elements">
      <div className="float-el float-el--plane">✈️</div>
      <div className="float-el float-el--globe">🌍</div>
      <div className="float-el float-el--bag">🧳</div>
      <div className="float-el float-el--compass">🧭</div>
      <div className="float-el float-el--map">🗺️</div>
      <div className="float-el float-el--star">⭐</div>
      <div className="float-el float-el--rocket">🚀</div>
    </div>
  );
}

/* ── Main Component ── */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <ParticleBackground />
      <FloatingElements />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80"
            alt="Cinematic travel background"
            className="hero__bg-img"
          />
          <div className="hero__bg-overlay" />
        </div>

        <div className="hero__content container">
          <div className="hero__badge">
            <span>🤖</span>
            <span>AI-Powered Travel Intelligence</span>
          </div>

          <h1 className="hero__title">
            <span className="hero__title-line1">AI-Powered</span>
            <span className="hero__title-line2 gradient-text">Smart Travel</span>
            <span className="hero__title-line3">Planner</span>
          </h1>

          <p className="hero__subtitle gradient-text-purple">
            Plan Smarter, Travel Better
          </p>

          <p className="hero__desc">
            India's first AI-powered travel planning platform that optimizes your budget,
            recommends perfect destinations, and tracks every expense in real-time.
            Built for students, families, and adventure seekers.
          </p>

          <div className="hero__cards-grid">
            {[
              { icon: FaWallet, title: 'Calculate Budget', desc: 'AI budget analysis & cost estimates.', path: '/budget' },
              { icon: FaPlane, title: 'Trip Planner', desc: 'Custom optimized itinerary mapper.', path: '/trip-type' },
              { icon: FaMagic, title: 'Budget Optimization', desc: 'AI expense optimization advisor.', path: '/optimization' },
              { icon: FaMapMarkerAlt, title: 'Tourist Places', desc: 'Curated local sights & attractions.', path: '/tourist' },
              { icon: FaChartPie, title: 'Expense Tracker', desc: 'Track daily expenses & budgets.', path: '/expense' },
            ].map(({ icon: Icon, title, desc, path }, i) => (
              <div 
                key={i} 
                className="hero-feature-card glass-card"
                onClick={() => navigate(path)}
              >
                <div className="hero-feature-card__icon">
                  <Icon />
                </div>
                <h3 className="hero-feature-card__title">{title}</h3>
                <p className="hero-feature-card__desc">{desc}</p>
              </div>
            ))}
          </div>

          <div className="hero__ctas">
            <button
              className="btn-primary btn-glow hero__cta-main"
              onClick={() => navigate('/trip-type')}
              id="start-planning-btn"
            >
              <FaRocket />
              Start Planning Free
              <FaArrowRight />
            </button>
            <button
              className="btn-secondary hero__cta-secondary"
              onClick={() => navigate('/about')}
            >
              <FaGlobe />
              Watch Demo
            </button>
          </div>

          <div className="hero__trust">
            <div className="hero__trust-item">
              <span className="hero__trust-icon">🛡️</span>
              <span>100% Free</span>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-icon">⚡</span>
              <span>AI-Powered</span>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-icon">🏆</span>
              <span>Award Winning</span>
            </div>
            <div className="hero__trust-item">
              <span className="hero__trust-icon">🇮🇳</span>
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

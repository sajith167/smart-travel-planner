import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="about-page page-enter" style={{ padding: '120px 20px', color: '#f1f5f9', textAlign: 'center' }}>
      <div className="container glass-card" style={{ maxWidth: 500, margin: '0 auto', padding: '50px 24px', borderRadius: 24 }}>
        <div style={{ fontSize: '5rem', marginBottom: 20 }}>🧭</div>
        <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 12 }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>Destination Lost</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.92rem', lineHeight: 1.6 }}>
          It looks like you've wandered off the trail map. The page you are looking for does not exist or has been relocated.
        </p>
        <button 
          className="btn-primary btn-glow" 
          onClick={() => navigate('/')}
          style={{ margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <FaHome /> Return to Base camp
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', msg: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="about-page page-enter" style={{ padding: '80px 20px', color: '#f1f5f9' }}>
      <div className="container text-center" style={{ maxWidth: 800 }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <span className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            ✉️ Contact
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginTop: 12 }}>
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>
            Have feedback, feature suggestions, or questions about the AI Travel Planner? Drop us a line below.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid-3" style={{ marginBottom: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <div className="glass-card" style={{ padding: '24px 16px', borderRadius: 16 }}>
            <FaEnvelope style={{ fontSize: '2rem', color: '#a78bfa', marginBottom: 12 }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>Email Us</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>hello@smarttravel.ai</p>
          </div>
          <div className="glass-card" style={{ padding: '24px 16px', borderRadius: 16 }}>
            <FaMapMarkerAlt style={{ fontSize: '2rem', color: '#06b6d4', marginBottom: 12 }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>Locate Us</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bengaluru, Karnataka, IN</p>
          </div>
          <div className="glass-card" style={{ padding: '24px 16px', borderRadius: 16 }}>
            <FaPhone style={{ fontSize: '2rem', color: '#10b981', marginBottom: 12 }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>Call Us</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>+91 98765 43210</p>
          </div>
        </div>

        {/* Form */}
        <div className="glass-card" style={{ maxWidth: 550, margin: '0 auto', padding: '40px 24px', borderRadius: 24, textAlign: 'left' }}>
          {sent && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: 12, padding: 16, marginBottom: 24, color: '#10b981', textAlign: 'center', fontWeight: 600 }}>
              🎉 Thank you! Your message has been sent successfully.
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="input-label" htmlFor="contact-name">Name</label>
              <div className="input-wrap">
                <input
                  id="contact-name"
                  type="text"
                  className="input-field"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="contact-email">Email</label>
              <div className="input-wrap">
                <input
                  id="contact-email"
                  type="email"
                  className="input-field"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="contact-message">Message</label>
              <div className="input-wrap">
                <textarea
                  id="contact-message"
                  className="input-field"
                  placeholder="Tell us what you need help with..."
                  style={{ minHeight: 120, resize: 'vertical' }}
                  value={form.msg}
                  onChange={e => setForm(f => ({ ...f, msg: e.target.value }))}
                  required
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-glow" style={{ justifyContent: 'center', gap: 8 }}>
              <FaPaperPlane /> Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught rendering failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="error-boundary page-enter" 
          style={{ 
            padding: '100px 20px', 
            textAlign: 'center', 
            color: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
          }}
        >
          <div 
            className="glass-card" 
            style={{ 
              maxWidth: 600, 
              margin: '0 auto', 
              padding: '40px 24px', 
              borderRadius: 24, 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              background: 'rgba(15, 10, 40, 0.5)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)'
            }}
          >
            <div style={{ fontSize: '4.5rem', marginBottom: 20 }}>⚠️</div>
            <h2 style={{ marginBottom: 16, fontSize: '1.75rem', fontWeight: 700 }}>Application Error Encountered</h2>
            <p style={{ color: '#94a3b8', marginBottom: 28, fontSize: '0.95rem', lineHeight: 1.6 }}>
              A rendering exception occurred within this page. We've captured the error diagnostics. You can retry the page or reset cached session data to resolve.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary" 
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                Retry Page
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  localStorage.clear();
                  this.setState({ hasError: false, error: null });
                  window.location.href = '#/';
                  window.location.reload();
                }}
              >
                Reset App & Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

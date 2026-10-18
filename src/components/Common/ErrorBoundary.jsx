import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#dash';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          margin: '24px auto',
          maxWidth: '640px',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: '16px',
          boxShadow: 'var(--sh-md)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'rgba(194, 65, 75, 0.12)',
            color: 'var(--error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <AlertTriangle size={28} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand)', margin: '0 0 8px' }}>
            عذراً، حدث خطأ غير متوقع في عرض هذه الشاشة
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--muted)', margin: '0 0 20px', maxWidth: '480px', lineHeight: 1.6 }}>
            تم تسجيل الخطأ الداخلي لمنع توقف باقي وظائف المنظومة. يمكنك تحديث الصفحة أو العودة إلى لوحة المؤشرات.
          </p>

          {this.state.error && (
            <div style={{
              background: 'var(--bg)',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              color: 'var(--error)',
              fontFamily: 'monospace',
              marginBottom: '20px',
              maxWidth: '100%',
              overflowX: 'auto',
              direction: 'ltr'
            }}>
              {this.state.error.toString()}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn"
              onClick={this.handleReset}
              style={{ fontWeight: 700, gap: '6px' }}
            >
              <RefreshCw size={15} />
              تحديث الشاشة وإعادة التحميل
            </button>
            <button
              className="btn sec"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onNavigateHome) {
                  this.props.onNavigateHome();
                } else {
                  window.location.reload();
                }
              }}
              style={{ fontWeight: 700, gap: '6px' }}
            >
              <Home size={15} />
              العودة للرئيسية
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

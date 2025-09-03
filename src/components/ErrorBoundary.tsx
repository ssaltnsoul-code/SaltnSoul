import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          border: '2px solid red', 
          borderRadius: '8px',
          backgroundColor: '#fee'
        }}>
          <h2 style={{ color: 'red', marginBottom: '10px' }}>🚨 Something went wrong</h2>
          <p style={{ marginBottom: '15px' }}>
            The application encountered an error. Please check the browser console for more details.
          </p>
          <details style={{ marginBottom: '15px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Error Details (Click to expand)
            </summary>
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#f5f5f5',
              fontFamily: 'monospace',
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              overflow: 'auto'
            }}>
              <strong>Error:</strong> {this.state.error?.toString()}
              <br /><br />
              <strong>Stack trace:</strong>
              <br />
              {this.state.error?.stack}
              <br /><br />
              <strong>Component stack:</strong>
              <br />
              {this.state.errorInfo?.componentStack}
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
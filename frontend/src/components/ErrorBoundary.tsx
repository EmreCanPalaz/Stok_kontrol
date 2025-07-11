// /Users/emrepalaz/Desktop/EmKaHan/Stok_kontrol/frontend/src/components/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Bir şeyler yanlış gitti.</h2>
          <p>Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
          <button onClick={() => window.location.reload()}>Sayfayı Yenile</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
'use client';

import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorInfo: string | null;
}

export class HydrationErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorInfo: error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check if this is a hydration-related error
    const isHydrationError = 
      error.message.includes('hydration') || 
      error.message.includes('server HTML') ||
      error.message.includes('server rendered HTML') ||
      error.message.includes('client properties');
    
    if (isHydrationError) {
      console.warn('🚨 [Hydration Boundary] Hydration error caught and handled:', {
        error: error.message,
        componentStack: errorInfo.componentStack?.split('\n').slice(0, 5).join('\n')
      });
      
      // In development, provide more detailed logging
      if (process.env.NODE_ENV === 'development') {
        console.group('🔍 [Hydration Boundary] Detailed Error Info');
        console.log('Error:', error);
        console.log('Error Info:', errorInfo);
        console.log('Likely cause: Browser extension modifying DOM before React hydration');
        console.groupEnd();
      }
    } else {
      // For non-hydration errors, log normally
      console.error('💥 [Hydration Boundary] Non-hydration error caught:', error, errorInfo);
    }
  }

  handleRetry = () => {
    // Reset the error state to retry rendering
    this.setState({ 
      hasError: false,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const isHydrationError = 
        this.state.errorInfo?.includes('hydration') ||
        this.state.errorInfo?.includes('server HTML') ||
        this.state.errorInfo?.includes('server rendered HTML');

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-center text-white max-w-md mx-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              {isHydrationError ? (
                <RefreshCw className="w-8 h-8 text-white/40" />
              ) : (
                <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
              )}
            </div>
            
            <h2 className="text-xl font-semibold mb-2">
              {isHydrationError ? 'Loading Application' : 'Something went wrong'}
            </h2>
            
            <p className="text-white/60 mb-4 text-sm">
              {isHydrationError 
                ? 'Please wait while we sync with your browser...'
                : 'An error occurred while loading the application.'
              }
            </p>

            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors"
            >
              Try Again
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">
                  Developer Info
                </summary>
                <pre className="text-xs text-white/60 bg-black/20 p-2 rounded mt-2 overflow-auto max-h-32">
                  {this.state.errorInfo}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
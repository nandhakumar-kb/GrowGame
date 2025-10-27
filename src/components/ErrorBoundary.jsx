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
    console.error('Game Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full border-4 border-red-500 shadow-2xl shadow-red-500/50">
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Oops! Something went wrong</h2>
              <p className="text-sm sm:text-base text-gray-400 mb-4">
                The game encountered an error and couldn't continue.
              </p>
              {this.state.error && (
                <details className="text-left bg-gray-900/50 rounded-lg p-3 mb-4">
                  <summary className="text-red-400 cursor-pointer text-xs sm:text-sm">Error Details</summary>
                  <pre className="text-xs text-gray-300 mt-2 overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                🔄 Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                🏠 Home
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

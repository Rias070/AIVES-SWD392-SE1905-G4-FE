import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Generic Error Boundary for the AIVES frontend.
 * Catches any render-time exception thrown by a child component tree and
 * renders a friendly fallback instead of taking the whole SPA down.
 *
 * Usage:
 *   <ErrorBoundary><App /></ErrorBoundary>
 *   <ErrorBoundary fallback={<MyCustomUI/>}>...</ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Capture for diagnostics. In production, this is where you would
    // forward the report to Sentry / Datadog / an internal log API.
    // We intentionally do not import the api client here so the boundary
    // remains usable even when the network is down.
    // eslint-disable-next-line no-console
    console.error('[AIVES ErrorBoundary] Uncaught render error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    } else {
      // Best-effort soft reset: re-mount from the top.
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const { error, errorInfo } = this.state;
    const showDetails = import.meta.env.DEV || (typeof process !== 'undefined' && process.env.NODE_ENV === 'development');

    return (
      <div role="alert" className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-xl w-full p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-rose-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Đã xảy ra sự cố khi hiển thị trang này
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Hệ thống đã ghi nhận lỗi và ngăn không cho toàn bộ ứng dụng bị gián đoạn.
            Bạn có thể thử tải lại giao diện hoặc quay lại trang trước đó.
          </p>

          {showDetails && error && (
            <details className="text-left bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
              <summary className="cursor-pointer font-semibold text-slate-800">Chi tiết kỹ thuật (chế độ Dev)</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">
{String(error?.toString?.() || error)}
{errorInfo?.componentStack ? '\n\n' + errorInfo.componentStack : ''}
              </pre>
            </details>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Tải lại trang
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = '/')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }
}

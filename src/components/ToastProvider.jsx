import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, X, Info } from 'lucide-react';

/**
 * Lightweight toast notification system.
 * - Auto-dismisses after `duration` ms (default 4000).
 * - Supports types: 'success' | 'error' | 'warning' | 'info'.
 * - Use `useToast()` to get the `showToast` function in any component.
 * - Wrap the app with <ToastProvider> once near the root.
 */

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
};

const ICON_COLOR = {
  success: 'text-emerald-600',
  error: 'text-rose-600',
  warning: 'text-amber-600',
  info: 'text-sky-600',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((text, type = 'info', duration = 4000) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, text, type, duration }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Stable function reference for consumers
  const value = { showToast, dismiss };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || Info;
  useEffect(() => {
    if (!toast.duration) return;
    const timer = setTimeout(onDismiss, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  return (
    <div
      role="status"
      className={`relative overflow-hidden flex items-start gap-2 p-3 pr-9 rounded-xl border shadow-sm text-xs font-semibold ${STYLES[toast.type] || STYLES.info}`}
    >
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${ICON_COLOR[toast.type] || ICON_COLOR.info}`} />
      <span className="flex-1">{toast.text}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Đóng thông báo"
        className="absolute top-1.5 right-1.5 opacity-70 hover:opacity-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {toast.duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-0.5 toast-progress"
          style={{
            background: 'currentColor',
            opacity: 0.5,
            animation: `toast-progress ${toast.duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback: console.warn but do not crash if provider is missing
    // (keeps the API usable during incremental refactors)
    // eslint-disable-next-line no-console
    console.warn('useToast: ToastProvider not found. Falling back to no-op.');
    return {
      showToast: (text) => console.log('[Toast]', text),
      dismiss: () => {},
    };
  }
  return ctx;
}

export default ToastProvider;

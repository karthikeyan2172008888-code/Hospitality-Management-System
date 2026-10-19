import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let toastClass = 'toast-success';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          toastClass = 'toast-error';
        } else if (toast.type === 'info') {
          Icon = Info;
          toastClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast ${toastClass}`}>
            <Icon size={20} />
            <div style={{ flex: 1 }}>{toast.message}</div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                opacity: 0.7,
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

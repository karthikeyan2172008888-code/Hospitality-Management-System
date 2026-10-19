import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="modal-body" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: isDanger ? '#ffe4e6' : '#fef3c7',
          color: isDanger ? '#e11d48' : '#d97706',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={22} />
        </div>
        <div>
          <p style={{ color: 'var(--slate-700)', fontSize: '0.92rem', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </button>
        <button
          type="button"
          className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}

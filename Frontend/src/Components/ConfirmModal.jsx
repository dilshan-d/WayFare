import React from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const btnBg = type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-cyan-100 text-cyan-600'}`}>
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-slate-600 text-sm mt-1">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium text-white ${btnBg} rounded-xl transition shadow-sm`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

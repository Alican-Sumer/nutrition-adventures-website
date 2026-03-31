import { useState, useEffect } from 'react';
import { Button } from './Button';

export function AddClassCodeModal({ isOpen, onClose, onAdd }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onAdd(code.trim());
      setCode('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-white/10 shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Add class with code</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter class code"
            className="w-full px-4 py-3 rounded-[var(--radius-button)] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            autoFocus
          />
          <div className="flex gap-3 mt-5">
            <Button type="submit" className="flex-1">
              Add
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

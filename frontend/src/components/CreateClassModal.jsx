import { useState, useEffect } from 'react';
import { Button } from './Button';

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 3; i++) s += chars[Math.floor(Math.random() * chars.length)];
  s += '-';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function CreateClassModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [createdCode, setCreatedCode] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const code = randomCode();
      setCreatedCode(code);
      onCreate(name.trim(), code);
    }
  };

  const handleClose = () => {
    setName('');
    setCreatedCode(null);
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && handleClose();
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="w-full max-w-md rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-white/10 shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {createdCode ? (
          <>
            <h3 className="text-xl font-semibold text-white mb-2">Class created</h3>
            <p className="text-white/80 mb-2">Share this code with students:</p>
            <p className="text-2xl font-mono font-bold text-[var(--color-accent)] mb-5">
              {createdCode}
            </p>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-white mb-4">Create a class</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Class name"
                className="w-full px-4 py-3 rounded-[var(--radius-button)] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                autoFocus
              />
              <div className="flex gap-3 mt-5">
                <Button type="submit" className="flex-1">
                  Create
                </Button>
                <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

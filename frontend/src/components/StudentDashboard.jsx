import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Card } from './Card';
import { AddClassCodeModal } from './AddClassCodeModal';

const MOCK_CLASSES = [
  { id: '1', name: 'Nutrition 101', code: 'NTR-101' },
  { id: '2', name: 'Campus Dining Basics', code: 'CDB-202' },
];

export function StudentDashboard() {
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddClass = (code) => {
    setClasses((prev) => [...prev, { id: String(Date.now()), name: `Class ${code}`, code }]);
    setAddModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">My Classes</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAddModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-white text-xl flex items-center justify-center hover:bg-[var(--color-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Add class"
          >
            +
          </button>
          <Link to="/game">
            <Button>Launch Game</Button>
          </Link>
        </div>
      </div>

      <ul className="space-y-3">
        {classes.map((c) => (
          <li key={c.id}>
            <Card className="flex items-center justify-between">
              <span className="text-white font-medium">{c.name}</span>
              <span className="text-white/70 text-sm">{c.code}</span>
            </Card>
          </li>
        ))}
      </ul>

      <AddClassCodeModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddClass}
      />
    </>
  );
}

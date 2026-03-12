import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Card } from './Card';
import { CreateClassModal } from './CreateClassModal';

const MOCK_CLASSES = [
  { id: '1', name: 'Nutrition 101', code: 'NTR-101' },
  { id: '2', name: 'Campus Dining Basics', code: 'CDB-202' },
];

export function TeacherDashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateClass = (name, code) => {
    setClasses((prev) => [...prev, { id: String(Date.now()), name, code }]);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">My Classes</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-white text-xl flex items-center justify-center hover:bg-[var(--color-accent-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Create class"
        >
          +
        </button>
      </div>

      <ul className="space-y-3">
        {classes.map((c) => (
          <li key={c.id}>
            <Card
              className="flex items-center justify-between cursor-pointer hover:bg-white/10 transition"
              onClick={() => navigate(`/class/${c.id}`)}
            >
              <span className="text-white font-medium">{c.name}</span>
              <span className="text-white/70 text-sm">{c.code}</span>
            </Card>
          </li>
        ))}
      </ul>

      <CreateClassModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateClass}
      />
    </>
  );
}

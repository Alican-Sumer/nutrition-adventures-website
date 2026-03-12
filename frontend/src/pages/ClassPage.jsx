import { useParams, useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { Card } from '../components/Card';

const MOCK_STUDENTS = [
  { id: '1', name: 'Alex Johnson', progress: 70 },
  { id: '2', name: 'Sam Williams', progress: 45 },
  { id: '3', name: 'Jordan Lee', progress: 100 },
];

export function ClassPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleExport = () => {
    // Placeholder; wire to backend later
    console.log('Export grades for course', courseId);
  };

  return (
    <div className="min-h-screen bg-[var(--color-hero)]">
      <NavBar centerTitle="The Nutrition Adventures" showLogin={true} />
      <main className="pt-20 pb-12 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/80 hover:text-white text-sm"
          >
            ← Back to Dashboard
          </button>
          <Button onClick={handleExport} className="py-2 px-4 text-sm">
            Export Grades
          </Button>
        </div>

        <Card className="overflow-hidden p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-3 px-4 text-white font-semibold">Student</th>
                <th className="py-3 px-4 text-white font-semibold w-48">Progress</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STUDENTS.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-white">{s.name}</td>
                  <td className="py-3 px-4">
                    <ProgressBar value={s.progress} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}

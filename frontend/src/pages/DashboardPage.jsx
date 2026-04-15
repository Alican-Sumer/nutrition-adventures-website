import { useAuth } from '../context/AuthContext';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/Button';
import { StudentDashboard } from '../components/StudentDashboard';
import { TeacherDashboard } from '../components/TeacherDashboard';

export function DashboardPage() {
  const { user, loginAs } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-hero)]">
        <NavBar showLogin={false} />
        <main className="pt-20 pb-12 px-6 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Continue as</h2>
          <p className="text-white/80 mb-6 text-sm">Choose a role to view the dashboard (mock login)</p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => loginAs('student')} className="w-full py-3">
              Student
            </Button>
            <Button variant="secondary" onClick={() => loginAs('teacher')} className="w-full py-3">
              Teacher
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-hero)]">
      <NavBar showLogin={!!user} />
      <main className="pt-20 pb-12 px-6 max-w-4xl mx-auto">
        {user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
      </main>
    </div>
  );
}

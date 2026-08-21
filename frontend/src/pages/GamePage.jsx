import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveScenarioComplete, getProgress } from '../services/gameProgressService';

const GAME_URL = import.meta.env.VITE_GAME_URL ?? '/game/index.html';

export function GamePage() {
  const { user } = useAuth();
  const iframeRef = useRef(null);
  const iframeUrlRef = useRef(`${GAME_URL}?embed=1&t=${Date.now()}`);

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data?.type === 'SCENARIO_COMPLETE') {
        saveScenarioComplete(user?.id ?? 'guest', event.data.scenarioId);
      }

      if (event.data?.type === 'GAME_READY') {
        // Game scene is initialized and ready to receive progress
        const progress = await getProgress(user?.id ?? 'guest');
        const completedScenarios = Object.keys(progress).filter((k) => progress[k]);
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'LOAD_PROGRESS', completedScenarios },
          '*'
        );
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a0e08', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Link
        to="/dashboard"
        className="inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white bg-[var(--color-accent)] text-white px-4 py-2 hover:bg-[var(--color-accent-hover)] shadow-lg shadow-red-900/20"
        style={{ position: 'absolute', top: 12, left: 12, zIndex: 100, textDecoration: 'none', fontSize: 14 }}
      >
        ← Back
      </Link>
      <iframe
        ref={iframeRef}
        src={iframeUrlRef.current}
        title="Nutrition Adventures"
        style={{ width: '95vw', height: '100vmin', maxWidth: '1300px', maxHeight: '1024px', border: '3px solid #b38a4a', borderRadius: '8px', background: '#0f2a18' }}
        allow="fullscreen"
      />
    </div>
  );
}

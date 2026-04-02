import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveScenarioComplete, getProgress } from '../services/gameProgressService';

const GAME_URL = import.meta.env.VITE_GAME_URL ?? 'http://localhost:8080';

export function GamePage() {
  const { user } = useAuth();
  const iframeRef = useRef(null);

  // Receive progress events FROM the game
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'SCENARIO_COMPLETE') {
        saveScenarioComplete(user?.name ?? 'guest', event.data.scenarioId);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  // Send saved progress INTO the game once it loads
  const handleIframeLoad = () => {
    const progress = getProgress(user?.name ?? 'guest');
    const completedScenarios = Object.keys(progress).filter((k) => progress[k]);
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'LOAD_PROGRESS', completedScenarios },
      GAME_URL
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a0e08', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Link
        to="/dashboard"
        style={{
          position: 'absolute', top: 12, left: 12, zIndex: 100,
          color: '#f6deb0', background: 'rgba(43, 27, 16, 0.85)', padding: '6px 14px',
          borderRadius: 6, fontSize: 14, fontFamily: '"Press Start 2P", Georgia, serif',
          textDecoration: 'none', border: '1px solid #b38a4a',
        }}
      >
        ← Back
      </Link>
      <iframe
        ref={iframeRef}
        src={GAME_URL}
        title="Nutrition Adventures"
        onLoad={handleIframeLoad}
        style={{ width: '100%', height: '100%', maxWidth: '1200px', maxHeight: '900px', border: '3px solid #b38a4a', borderRadius: '8px', background: '#0f2a18' }}
        allow="fullscreen"
      />
    </div>
  );
}

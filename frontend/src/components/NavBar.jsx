import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function NavBar({ centerTitle = 'The Nutrition Adventures', showLogin = true }) {
  const { user, logout } = useAuth();
  const [logoError, setLogoError] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 min-w-[140px]">
          {!logoError ? (
            <img
              src="/ncstate-brick-2x1-red-max.png"
              alt="NC State University"
              className="h-10 w-auto object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-white font-bold text-sm tracking-tight">NC STATE UNIVERSITY</span>
          )}
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-white/80 text-sm">{user.name}</span>
              <button
                onClick={logout}
                className="py-2 px-5 text-sm text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition font-medium cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/dashboard">
              <button className="py-2 px-5 text-sm text-white bg-[var(--color-accent)] rounded-full hover:bg-[var(--color-accent-hover)] transition font-semibold cursor-pointer border border-white/10">
                Launch
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

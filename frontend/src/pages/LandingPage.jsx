import { Link } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

export function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/belltower_twilight.png)' }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      <NavBar showLogin={true} />

      <main className="relative z-10 pt-16 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white max-w-3xl leading-tight tracking-tight">
          The Nutrition Adventures
        </h2>
        <p className="mt-6 text-white/90 text-lg md:text-xl max-w-lg leading-relaxed">
          Your Interactive Guide to Smarter Dining on Campus
        </p>
        <Link to="/dashboard" className="mt-10">
          <button className="px-10 py-4 text-lg font-semibold text-white rounded-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-all shadow-lg shadow-orange-900/30 hover:shadow-orange-800/40 hover:scale-105 cursor-pointer flex items-center gap-2">
            Launch Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </Link>
        <p className="mt-4 text-white/60 text-sm flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          For NCSU Students &amp; Faculty
        </p>
      </main>
    </div>
  );
}

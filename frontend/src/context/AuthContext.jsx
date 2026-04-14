import { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create the Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUserSession = async () => {
      try {
        // Because Apache's LOGIN_PATH=/ already forced them to log in at the IdP,
        // we just hit Spring Boot so it can find/create the user in PostgreSQL.
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Save the database user profile to global state
        } else {
          console.error("Failed to sync user. Status:", response.status);
        }
      } catch (error) {
        console.error("Network error while syncing user:", error);
      } finally {
        // Always stop loading, whether it succeeded or failed
        setLoading(false); 
      }
    };

    syncUserSession();
  }, []);

  // Show a loading screen while we wait for Spring Boot
  // This prevents the Dashboard or Game from crashing if 'user' isn't ready yet.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
        <h2>Authenticating via Shibboleth...</h2>
      </div>
    );
  }

  // Once loaded, provide the user data to all the Routes inside App.jsx
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// A custom hook so your pages can easily access the user
export const useAuth = () => useContext(AuthContext);
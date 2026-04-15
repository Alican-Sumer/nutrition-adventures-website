import { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create the Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mock_user');
    return saved ? JSON.parse(saved) : null;
  });

  const loginAs = (role) => {
    const mockUser = { name: role === 'teacher' ? 'Professor Demo' : 'Student Demo', role };
    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// A custom hook so your pages can easily access the user
export const useAuth = () => useContext(AuthContext);
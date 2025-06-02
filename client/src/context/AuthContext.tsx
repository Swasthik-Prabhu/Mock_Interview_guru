// 📄 src/context/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type Role = 'student' | 'admin' | 'institution';

interface AuthContextType {
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  const login = (userRole: Role) => {
    setRole(userRole);
    navigate(`/${userRole}/dashboard`);
  };

  const logout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthState, User, UserRole } from './types';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AskDoubt from './pages/AskDoubt';
import DoubtDetail from './pages/DoubtDetail';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

// Auth Context
interface AuthContextType {
  auth: AuthState;
  login: (email: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('doubtflow_session');
    if (savedUser) {
      setAuth({
        user: JSON.parse(savedUser),
        token: 'mock_token',
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setAuth(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string) => {
    // Simulated login
    const user: User = {
      id: 'u-' + Math.random().toString(36).slice(2, 7),
      name: email.split('@')[0],
      email,
      role: UserRole.STUDENT,
      reputation: 0,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('doubtflow_session', JSON.stringify(user));
    setAuth({
      user,
      token: 'mock_token',
      isAuthenticated: true,
      loading: false,
    });
  };

  const register = async (name: string, email: string) => {
    const user: User = {
      id: 'u-' + Math.random().toString(36).slice(2, 7),
      name,
      email,
      role: UserRole.STUDENT,
      reputation: 0,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('doubtflow_session', JSON.stringify(user));
    setAuth({
      user,
      token: 'mock_token',
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('doubtflow_session');
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  if (auth.loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, register }}>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {auth.isAuthenticated && <Navbar />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={!auth.isAuthenticated ? <Landing /> : <Navigate to="/home" />} />
              <Route path="/home" element={auth.isAuthenticated ? <Home /> : <Navigate to="/login" />} />
              <Route path="/login" element={!auth.isAuthenticated ? <Login /> : <Navigate to="/home" />} />
              <Route path="/signup" element={!auth.isAuthenticated ? <Signup /> : <Navigate to="/home" />} />
              <Route path="/ask" element={auth.isAuthenticated ? <AskDoubt /> : <Navigate to="/login" />} />
              <Route path="/doubt/:id" element={auth.isAuthenticated ? <DoubtDetail /> : <Navigate to="/login" />} />
              <Route path="/profile" element={auth.isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

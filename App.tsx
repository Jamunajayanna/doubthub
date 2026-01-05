
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
import { authApi } from './services/api';

interface AuthContextType {
  auth: AuthState;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
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
    token: localStorage.getItem('doubtflow_token'),
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('doubtflow_token');
      if (token) {
        try {
          const res = await authApi.getMe();
          setAuth({
            user: res.data,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          localStorage.removeItem('doubtflow_token');
          setAuth({ user: null, token: null, isAuthenticated: false, loading: false });
        }
      } else {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await authApi.login(credentials);
    const { token, user } = res.data;
    localStorage.setItem('doubtflow_token', token);
    setAuth({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const register = async (userData: any) => {
    const res = await authApi.register(userData);
    const { token, user } = res.data;
    localStorage.setItem('doubtflow_token', token);
    setAuth({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('doubtflow_token');
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium">Connecting to DoubtFlow...</p>
        </div>
      </div>
    );
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


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { ICONS } from '../constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/home');
    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-3xl text-white shadow-xl mb-6">
            {ICONS.Doubts}
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            required type="email" placeholder="Email"
            className="block w-full px-5 py-4 rounded-2xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required type="password" placeholder="Password"
            className="block w-full px-5 py-4 rounded-2xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-10 text-center text-slate-500">New? <Link to="/signup" className="text-indigo-600 font-bold">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';
import { Loader2, Mail, Lock, ChevronLeft, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';
  const isExpired = searchParams.get('expired') === 'true';

  // Handle Google OAuth Callback
  React.useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userStr));
        toast.success(`Welcome back, ${userData.name.split(' ')[0]}!`);
        login(userData, token);
        
        // Clean up URL
        searchParams.delete('token');
        searchParams.delete('user');
        setSearchParams(searchParams);
        
        navigate(from, { replace: true });
      } catch (err) {
        console.error('Failed to parse Google user data', err);
        toast.error('Google authentication failed.');
      }
    }
  }, [searchParams, login, navigate, from, setSearchParams]);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(formData);
      if (res.success) {
        toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
        login(res.data.user, res.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24 animate-in fade-in duration-500">
      <Link to="/" className="flex items-center text-xs font-black uppercase tracking-widest text-muted hover:text-accent mb-12 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>

      <div className="mb-10 text-center space-y-2">
        <h1 className="text-4xl font-display font-black tracking-tight uppercase italic underline decoration-accent/40 decoration-4 underline-offset-8">
          Authenticate
        </h1>
        <p className="text-muted text-sm">Sign in to access your account and dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface border border-border p-8 rounded-card shadow-2xl">
        {isExpired && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl font-bold text-sm">
            Your session expired. Please sign in again.
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl font-bold text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 h-5 w-5 text-muted/50" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full bg-bg border border-border focus:border-accent rounded-input py-4 pl-12 pr-4 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-accent/5 placeholder:text-muted/40"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 h-5 w-5 text-muted/50" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-bg border border-border focus:border-accent rounded-input py-4 pl-12 pr-4 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-accent/5 placeholder:text-muted/40"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
            <span className="bg-surface px-4 text-muted/40">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.location.href = `${API_URL}/auth/google`}
          className="w-full bg-surface border border-border py-4 rounded-xl font-bold text-sm hover:bg-bg transition-all flex items-center justify-center space-x-3 shadow-md"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5" alt="Google" />
          <span>Sign in with Google</span>
        </button>

        <p className="text-center text-xs font-bold text-muted">
          Don't have an account?{' '}
          <Link to="/join" className="text-accent underline underline-offset-4">
            Join Here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

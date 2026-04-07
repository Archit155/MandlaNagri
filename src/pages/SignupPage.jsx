import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup as apiSignup } from '../services/api';
import { Loader2, Mail, Lock, User, Key, ChevronLeft, CheckCircle2, XCircle,ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SignupPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isEmployeeMode = searchParams.get('mode') === 'employee';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    inviteCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false
  });

  const validatePassword = (pass) => {
    setPasswordValidation({
      minLength: pass.length >= 8,
      hasUpper: /[A-Z]/.test(pass),
      hasLower: /[a-z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    });
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const getStrengthPercent = () => {
    const met = Object.values(passwordValidation).filter(Boolean).length;
    return (met / 5) * 100;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') validatePassword(value);
  };

  // Handle Google OAuth Callback
  React.useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userStr));
        toast.success(`Welcome to LocalNewz, ${userData.name.split(' ')[0]}!`);
        login(userData, token);
        
        // Clean up URL
        searchParams.delete('token');
        searchParams.delete('user');
        setSearchParams(searchParams);
        
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Failed to parse Google user data', err);
        toast.error('Google authentication failed.');
      }
    }
  }, [searchParams, login, navigate, setSearchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiSignup({
        ...formData,
        role: isEmployeeMode ? 'employee' : 'user'
      });
      if (res.success) {
        toast.success(`Account created successfully! Welcome to LocalNewz, ${res.data.user.name.split(' ')[0]}.`);
        login(res.data.user, res.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24 animate-in fade-in duration-500">
      <Link to="/" className="flex items-center text-xs font-black uppercase tracking-widest text-muted hover:text-accent mb-12 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Landing
      </Link>

      <div className="mb-10 text-center space-y-2">
        <h1 className="text-4xl font-display font-black tracking-tight uppercase italic underline decoration-accent/40 decoration-4 underline-offset-8">
          Join the {isEmployeeMode ? 'Authors' : 'Readers'}
        </h1>
        <p className="text-muted text-sm px-8 leading-relaxed">
          {isEmployeeMode 
            ? 'Publish stories and contribute to the local narrative. Invite code required.' 
            : 'Access exclusive stories, follow favorite topics, and stay informed.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface border border-border p-8 rounded-card shadow-2xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl font-bold text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 h-5 w-5 text-muted/50" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-bg border border-border focus:border-accent rounded-input py-4 pl-12 pr-4 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-accent/5 placeholder:text-muted/40"
            />
          </div>

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

          <div className="space-y-3">
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-muted/50" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full bg-bg border border-border focus:border-accent rounded-input py-4 pl-12 pr-4 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-accent/5 placeholder:text-muted/40"
              />
            </div>

            {/* Strength Indicator Bar */}
            {formData.password && (
              <div className="px-1 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden flex gap-1">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      getStrengthPercent() <= 40 ? 'bg-red-500' : 
                      getStrengthPercent() <= 80 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${getStrengthPercent()}%` }}
                  />
                </div>
                
                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <RequirementItem met={passwordValidation.minLength} text="8+ Characters" />
                  <RequirementItem met={passwordValidation.hasUpper} text="Uppercase" />
                  <RequirementItem met={passwordValidation.hasLower} text="Lowercase" />
                  <RequirementItem met={passwordValidation.hasNumber} text="Number" />
                  <RequirementItem met={passwordValidation.hasSpecial} text="Special Char" />
                </div>
              </div>
            )}
          </div>

          {isEmployeeMode && (
            <div className="relative animate-in slide-in-from-top-4 duration-500">
              <Key className="absolute left-4 top-4 h-5 w-5 text-accent" />
              <input
                type="text"
                name="inviteCode"
                required
                value={formData.inviteCode}
                onChange={handleChange}
                placeholder="Employee Invite Code"
                className="w-full bg-accent/5 border-2 border-accent/20 focus:border-accent rounded-input py-4 pl-12 pr-4 text-sm font-black uppercase tracking-widest transition-all focus:outline-none placeholder:text-accent/30"
              />
              <p className="text-[10px] uppercase font-black tracking-widest text-accent mt-2 ml-1 opacity-60 italic">Requires valid credentials to verify.</p>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading || !isPasswordValid}
          className="w-full bg-accent text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center space-x-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>{isPasswordValid ? <ShieldCheck className="h-4 w-4" /> : null}<span>Create Account</span></>
          )}
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
          <span>Sign up with Google</span>
        </button>

        <p className="text-center text-xs font-bold text-muted mt-6">
          Already have an account? <Link to="/login" className="text-accent underline underline-offset-4">Authenticate Here</Link>
        </p>
      </form>
    </div>
  );
};

const RequirementItem = ({ met, text }) => (
  <div className={`flex items-center space-x-2 transition-all duration-300 ${met ? 'text-green-500' : 'text-muted/40'}`}>
    {met ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{text}</span>
  </div>
);

export default SignupPage;

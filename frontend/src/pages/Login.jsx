import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Activity } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      const role = result.role;
      navigate(`/${role}`);
    } catch (error) {
      // toast is handled in authService
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 sm:p-12 z-10">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30 transform rotate-3">
            <Activity className="w-10 h-10 text-white transform -rotate-3" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">ClinicPro</h1>
          <p className="text-slate-500 font-medium">Sign in to your professional account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                placeholder="receptionist@clinic.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 pb-2">
          <p className="text-sm text-slate-500 text-center leading-relaxed">
            <span className="font-semibold text-slate-700">Demo Accounts:</span><br />
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 mt-2 inline-block">receptionist@clinic.com</span>
            <span className="inline-block mx-2 text-slate-300">|</span>
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 inline-block">doctor@clinic.com</span><br />
            <span className="mt-1.5 inline-block">Password: <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-emerald-600">password</span></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


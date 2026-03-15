
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { UserService } from '../services/api';
import toast from 'react-hot-toast';

interface LoginProps {
  setUser: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const user = await UserService.login({ email, password });
        if (user && !user.isVerified) {
            setStep(2);
            toast.success("Verification code sent to your email.");
        } else {
            setUser(user);
            toast.success(`Welcome back, ${user.name}!`);
            navigate('/');
        }
    } catch (err: any) {
        toast.error(err.toString() || 'Login failed');
    } finally {
        setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await UserService.verifyOTP(otp);
      const user = await UserService.getProfile();
      setUser(user);
      toast.success("Email verified successfully!");
      navigate('/');
    } catch (err: any) {
      toast.error(err.toString() || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md">
        <h2 className="text-3xl font-serif text-slate-900 mb-2">{step === 1 ? 'Welcome Back' : 'Verify Email'}</h2>
        <p className="text-slate-500 mb-8">{step === 1 ? 'Login to your Online Store account' : 'Enter the code sent to your email'}</p>
        
        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none" 
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none" 
                placeholder="••••••••"
              />
            </div>
              <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-center">Verification Code</label>
              <input 
                required
                type="text" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 text-center text-3xl tracking-widest font-bold rounded-xl border border-slate-200 focus:border-indigo-600 outline-none" 
                placeholder="000000"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm font-medium"
            >
              Back to Login
            </button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm">
          <p className="text-slate-500">Don't have an account?</p>
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

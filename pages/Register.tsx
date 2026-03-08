
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { UserService } from '../services/api';
import toast from 'react-hot-toast';

interface RegisterProps {
  setUser: (u: User) => void;
}

const Register: React.FC<RegisterProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const userData = await UserService.register({ name, email, password });
      // Backend returns the user (logged in via cookie) but sending logic handled
      // We update local user state, though verified is false
      setUser({
         ...userData,
         id: userData._id,
         role: userData.isAdmin ? UserRole.ADMIN : UserRole.MEMBER,
         verified: false, // OTP pending
         orderCount: 0 
      });
      setStep(2);
      toast.success("Verification code sent to " + email);
    } catch (err: any) {
      setError(err.toString());
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await UserService.verifyOTP(otp);
      
      // Update user state to verified
      const updatedUser = await UserService.getProfile();
      setUser({
          ...updatedUser,
          id: updatedUser._id,
          role: updatedUser.isAdmin ? UserRole.ADMIN : UserRole.MEMBER,
          // verified should be true from backend now
          verified: true, 
          orderCount: 0
      });

      toast.success("Email verified successfully! Enjoy free shipping on your first order.");
      navigate('/');
    } catch (err: any) {
       setError(err.toString());
       toast.error(err.response?.data?.message || "Verification failed");
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md">
        <h2 className="text-3xl font-serif text-slate-900 mb-2">Join Our Community</h2>
        <p className="text-slate-500 mb-8">Experience premium shopping with member benefits.</p>
        
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 outline-none" placeholder="name@example.com" />
            </div>
             <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 outline-none" placeholder="••••••••" />
            </div>
            <button disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg disabled:opacity-50">
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <p className="text-sm bg-indigo-50 p-4 rounded-xl text-indigo-800">Please enter the 6-digit code sent to your email.</p>
            <div>
              <label className="block text-sm font-semibold mb-1">Verification Code</label>
              <input required type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 text-center tracking-widest text-2xl font-bold rounded-xl border border-slate-200 outline-none" placeholder="000000" />
            </div>
            <button disabled={isLoading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50">
              {isLoading ? 'Verifying...' : 'Verify & Register'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm">
          <p className="text-slate-500">Already a member?</p>
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In Instead</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

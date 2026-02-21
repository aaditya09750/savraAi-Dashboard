import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icon';
import { APP_CONFIG } from '../config/constants';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for a smoother UX feel
    setTimeout(() => {
      if (username === 'Admin' && password === 'Savra@321') {
        navigate('/');
      } else {
        setError('Invalid username or password');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F3F0FF] flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#9F85F3] tracking-wide mb-2">{APP_CONFIG.APP_NAME}</h1>
          <p className="text-gray-500 text-sm">Admin Companion Dashboard</p>
        </div>

        <Card className="border border-white/50 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-2">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
              <div className="relative group">
                <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-brand-primary transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
              <div className="relative group">
                <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-brand-primary transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100">
                <Icons.AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              disabled={isLoading}
              className="mt-2 shadow-sm shadow-purple-200/60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials Note */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="bg-pastel-blue/50 border border-blue-100 rounded-sm p-4 text-left">
              <p className="text-xs font-sm text-blue-600 tracking-wide mb-2">Note: These credentials are for demo purposes only.</p>
              <div className="flex justify-left gap-6 text-sm text-blue-900">
                <p><span className="text-blue-500/80 text-xs mr-1">Username:</span> <span className="text-sm font-medium">Admin</span></p>
                <p><span className="text-blue-500/80 text-xs mr-1">Password:</span> <span className="text-sm font-medium">Savra@321</span></p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

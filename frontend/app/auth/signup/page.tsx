'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { MOCK_TOKEN } from '@/lib/mock';

export default function SignupPage() {
  const router = useRouter();
  const { setToken } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enterApp = () => {
    setToken(MOCK_TOKEN);
    router.push('/dashboard');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // authAPI.signup now has a mock fallback built in — always resolves
      const signupRes = await authAPI.signup(formData.email, formData.password, formData.fullName);
      const token = signupRes.data.access_token;
      setToken(token);
      router.push('/dashboard');
    } catch {
      enterApp();
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(212,175,55,0.05)',
    border: '1px solid rgba(212,175,55,0.2)',
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid rgba(212,175,55,0.5)';
    e.currentTarget.style.boxShadow = '0 0 12px rgba(212,175,55,0.15)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid rgba(212,175,55,0.2)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <>
      <div className="particles-bg" />
      <div className="page-content min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div
            className="card-bottom-glow rounded-2xl p-8"
            style={{
              background: 'rgba(17, 13, 3, 0.85)',
              border: '1px solid rgba(212,175,55,0.18)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 60px rgba(212,175,55,0.1)',
            }}
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-black font-bold text-base"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #A67C00 100%)',
                    boxShadow: '0 0 20px rgba(212,175,55,0.4)',
                  }}
                >
                  P
                </div>
                <span className="text-2xl font-bold text-gold-100">PipelineIQ</span>
              </div>
              <h1 className="text-xl font-bold text-gold-100 tracking-tight">Create Account</h1>
              <p className="text-gold-300/60 mt-1">Join PipelineIQ today</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gold-300/70 mb-2 tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg text-gold-100 placeholder-gold-500/30 focus:outline-none transition"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold-300/70 mb-2 tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 rounded-lg text-gold-100 placeholder-gold-500/30 focus:outline-none transition"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gold-300/70 mb-2 tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg text-gold-100 placeholder-gold-500/30 focus:outline-none transition"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 font-semibold rounded-lg transition-all duration-300 text-black disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #A67C00 100%)',
                  boxShadow: '0 0 25px rgba(212,175,55,0.35)',
                }}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center text-sm text-gold-300/50 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-gold-500 hover:text-gold-400 transition">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

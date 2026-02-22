'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { MOCK_TOKEN } from '@/lib/mock';

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUserId } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const enterApp = () => {
    setToken(MOCK_TOKEN);
    setUserId('1');
    router.push('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      const { access_token } = response.data as any;
      setToken(access_token);
      setUserId('1');
      router.push('/dashboard');
    } catch {
      // Backend unreachable — accept any credentials and enter demo mode
      enterApp();
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // seedAPI already has mock fallback built in — always succeeds
      const { seedAPI } = await import('@/lib/api');
      await seedAPI.trigger();
    } catch {
      // ignore
    } finally {
      enterApp();
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
              <p className="text-gold-300/60">AI Revenue Attribution Platform</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gold-300/70 mb-2 tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid rgba(212,175,55,0.12)' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 text-gold-300/50" style={{ background: 'rgba(17,13,3,0.85)' }}>
                  Or
                </span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 font-semibold rounded-lg transition-all duration-300 text-gold-100 disabled:opacity-50"
              style={{
                background: 'rgba(212,175,55,0.06)',
                border: '1px solid rgba(212,175,55,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212,175,55,0.12)';
                e.currentTarget.style.border = '1px solid rgba(212,175,55,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(212,175,55,0.06)';
                e.currentTarget.style.border = '1px solid rgba(212,175,55,0.2)';
              }}
            >
              {loading ? 'Loading Demo...' : 'Try Demo'}
            </button>

            <p className="text-center text-sm text-gold-300/50 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-gold-500 hover:text-gold-400 transition">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

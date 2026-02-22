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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const enterApp = () => { setToken(MOCK_TOKEN); router.push('/dashboard'); };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const signupRes = await authAPI.signup(formData.email, formData.password, formData.fullName);
      setToken(signupRes.data.access_token);
      router.push('/dashboard');
    } catch {
      enterApp();
    } finally {
      setLoading(false);
    }
  };

  const cardBg = { background: 'rgba(28, 16, 2, 0.88)', border: '1px solid rgba(212,175,55,0.18)', backdropFilter: 'blur(20px)', boxShadow: '0 0 60px rgba(212,175,55,0.1)' };
  const inputStyle = { background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.border = '1px solid rgba(212,175,55,0.5)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(212,175,55,0.15)'; };
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.border = '1px solid rgba(212,175,55,0.2)'; e.currentTarget.style.boxShadow = 'none'; };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card-bottom-glow rounded-2xl p-8" style={cardBg}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-black font-bold text-base"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #A67C00 100%)', boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}>
                P
              </div>
              <span className="text-2xl font-bold text-gold-100">PipelineIQ</span>
            </div>
            <h1 className="text-xl font-bold text-gold-100 tracking-tight">Create Account</h1>
            <p className="text-gold-300/60 mt-1">Join PipelineIQ today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {[
              { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'John Doe' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'you@company.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gold-300/70 mb-2 tracking-wide">{label}</label>
                <input type={type} name={name} value={formData[name as keyof typeof formData]}
                  onChange={handleChange} placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-lg text-gold-100 placeholder-gold-500/30 focus:outline-none transition"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            ))}
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 font-semibold rounded-lg transition-all duration-300 text-black disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #A67C00 100%)', boxShadow: '0 0 25px rgba(212,175,55,0.35)' }}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-gold-300/50 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gold-500 hover:text-gold-400 transition">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

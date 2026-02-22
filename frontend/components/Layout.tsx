'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { LayoutDashboard, TrendingUp, Target, Brain, DollarSign, BarChart3 } from 'lucide-react';

export const Navbar = () => {
  const router = useRouter();
  const { token, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(10,8,2,0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,175,55,0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-bold text-sm shadow-goldGlow"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #A67C00 100%)' }}
            >
              P
            </div>
            <span className="text-xl font-bold text-gold-100">PipelineIQ</span>
          </Link>

          {/* Navigation Links */}
          {token && (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gold-300/60 hover:text-gold-300 transition text-sm">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-gold-300/60 hover:text-gold-300 transition text-sm">
                Analytics
              </Link>
              <Link href="/campaigns" className="text-gold-300/60 hover:text-gold-300 transition text-sm">
                Campaigns
              </Link>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gold-100 rounded-lg transition"
                style={{
                  background: 'rgba(212,175,55,0.06)',
                  border: '1px solid rgba(212,175,55,0.18)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="text-gold-300/60 hover:text-gold-300 transition text-sm">
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm border border-gold-500/50 hover:border-gold-400 text-gold-100 font-medium rounded-lg transition hover:bg-gold-500/10"
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Sidebar = () => {
  return (
    <aside
      className="hidden lg:block w-64 min-h-screen sticky top-16"
      style={{
        background: 'rgba(10,8,2,0.6)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(212,175,55,0.1)',
      }}
    >
      <div className="p-6 space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-gold-500/50 uppercase mb-4 tracking-wider">Main</h3>
          <div className="space-y-1">
            {[
              { href: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
              { href: '/analytics', icon: <BarChart3 size={16} />, label: 'Analytics' },
              { href: '/campaigns', icon: <Target size={16} />, label: 'Campaigns' },
            ].map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gold-300/50 hover:text-gold-300 rounded-lg transition border-l-2 border-transparent hover:border-gold-500 hover:bg-gold-500/5"
              >
                {icon} {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.25), transparent)', height: '1px', marginBottom: '1rem' }} />
          <h3 className="text-xs font-semibold text-gold-500/50 uppercase mb-4 tracking-wider">Insights</h3>
          <div className="space-y-1">
            {[
              { icon: <Brain size={16} />, label: 'AI Insights' },
              { icon: <DollarSign size={16} />, label: 'Budget Optimizer' },
              { icon: <TrendingUp size={16} />, label: 'Attribution' },
            ].map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-gold-300/50 hover:text-gold-300 rounded-lg transition border-l-2 border-transparent hover:border-gold-500 hover:bg-gold-500/5"
              >
                {icon} {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

interface Card {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
}

export const KPICard = ({ label, value, icon, trend }: Card) => {
  return (
    <div
      className="card-bottom-glow rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300"
      style={{
        background: 'rgba(17,13,3,0.75)',
        border: '1px solid rgba(212,175,55,0.15)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 25px rgba(212,175,55,0.07)',
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gold-300/55 mb-2 tracking-wide uppercase">{label}</p>
          <p
            className="text-2xl font-semibold text-gold-500 tracking-tight"
            style={{ textShadow: '0 0 12px rgba(212,175,55,0.4)' }}
          >
            {value}
          </p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        {icon && <div style={{ color: 'rgba(212,175,55,0.6)' }}>{icon}</div>}
      </div>
    </div>
  );
};

export const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div
      className="card-bottom-glow rounded-2xl p-6"
      style={{
        background: 'rgba(17,13,3,0.75)',
        border: '1px solid rgba(212,175,55,0.15)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 25px rgba(212,175,55,0.07)',
      }}
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gold-100 tracking-tight">{title}</h3>
        <div style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.3), transparent)', height: '1px', marginTop: '0.5rem' }} />
      </div>
      {children}
    </div>
  );
};

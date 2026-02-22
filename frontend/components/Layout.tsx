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
    <nav className="bg-black/70 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-700 rounded-lg shadow-goldGlow" />
            <span className="text-xl font-bold text-gold-100">PipelineIQ</span>
          </Link>

          {/* Navigation Links */}
          {token && (
            <div className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-gold-300 transition">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-gray-400 hover:text-gold-300 transition">
                Analytics
              </Link>
              <Link href="/campaigns" className="text-gray-400 hover:text-gold-300 transition">
                Campaigns
              </Link>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gold-100 bg-card hover:bg-gold-500/10 border border-border rounded-lg transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-400 hover:text-gold-300 transition">
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-black font-medium rounded-lg transition shadow-goldGlow"
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
    <aside className="hidden lg:block w-64 bg-black/70 backdrop-blur-xl border-r border-border min-h-screen sticky top-16">
      <div className="p-6 space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 tracking-wider">Main</h3>
          <div className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition border-l-2 border-transparent hover:border-gold-500">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link href="/analytics" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition border-l-2 border-transparent hover:border-gold-500">
              <BarChart3 size={18} /> Analytics
            </Link>
            <Link href="/campaigns" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition border-l-2 border-transparent hover:border-gold-500">
              <Target size={18} /> Campaigns
            </Link>
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-r from-gold-500/20 to-transparent h-[2px] w-full mb-4"></div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 tracking-wider">Insights</h3>
          <div className="space-y-2">
            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition border-l-2 border-transparent hover:border-gold-500">
              <Brain size={18} /> AI Insights
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition border-l-2 border-transparent hover:border-gold-500">
              <DollarSign size={18} /> Budget Optimizer
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition border-l-2 border-transparent hover:border-gold-500">
              <TrendingUp size={18} /> Attribution
            </a>
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
    <div className="bg-card border border-border rounded-2xl p-6 shadow-goldGlow hover:shadow-goldGlowHover hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-2 tracking-wide">{label}</p>
          <p className="text-3xl font-semibold text-gold-500 tracking-tight drop-shadow-goldText">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        {icon && <div className="text-gold-500/80">{icon}</div>}
      </div>
    </div>
  );
};

export const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-goldGlow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gold-100 tracking-tight">{title}</h3>
        <div className="bg-gradient-to-r from-gold-500/20 to-transparent h-[2px] w-full mt-2"></div>
      </div>
      {children}
    </div>
  );
};

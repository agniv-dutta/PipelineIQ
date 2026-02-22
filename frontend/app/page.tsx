'use client';

import Link from 'next/link';
import { BarChart3, Brain, DollarSign } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gold-100">
              Revenue Attribution <span className="bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 bg-clip-text text-transparent drop-shadow-goldText">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              AI-powered attribution and GTM intelligence for B2B SaaS companies. Understand your revenue, optimize your spend, and close more deals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-500 hover:to-gold-600 text-black font-semibold rounded-lg transition-all duration-300 shadow-goldGlow hover:shadow-goldGlowHover"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 border border-border hover:bg-gold-500/10 hover:border-gold-500 text-gold-100 font-semibold rounded-lg transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            {[
              { icon: <BarChart3 size={40} className="text-gold-500" />, title: 'Multi-Touch Attribution', desc: 'Track every campaign touchpoint in your customer journey' },
              { icon: <Brain size={40} className="text-gold-400" />, title: 'AI Deal Scoring', desc: 'Predict which leads will close with ML-powered probability' },
              { icon: <DollarSign size={40} className="text-gold-500" />, title: 'Budget Optimization', desc: 'Get data-driven budget allocation recommendations' },
            ].map((feature, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-goldGlow hover:-translate-y-1 transition-all duration-300">
                <div className="mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gold-100 mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { BarChart3, Brain, DollarSign } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Particle / nebula background */}
      <div className="particles-bg" />

      <div className="page-content min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">

            {/* Hero heading — all golden like the target */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight drop-shadow-goldText"
                style={{ color: '#D4AF37', textShadow: '0 0 40px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.2)' }}>
                Revenue Attribution Made Simple
              </h1>
              <p className="text-lg text-gold-300/70 max-w-2xl mx-auto leading-relaxed">
                AI-powered attribution and GTM intelligence for B2B SaaS companies.<br />
                Understand your revenue, optimize your spend, and close more deals.
              </p>
            </div>

            {/* CTA buttons — matching target exactly */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-3 font-semibold rounded-lg transition-all duration-300 text-black"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #A67C00 100%)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.4)',
                }}
              >
                Get Started
              </Link>
              <Link
                href="/auth/signup"
                className="px-8 py-3 font-semibold rounded-lg transition-all duration-300 text-gold-100 border border-gold-500/50 hover:border-gold-400 hover:bg-gold-500/10"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                Sign Up
              </Link>
            </div>

            {/* Feature cards — matching target with bottom-edge glow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
              {[
                {
                  icon: <BarChart3 size={36} />,
                  title: 'Multi-Touch Attribution',
                  desc: 'Track every campaign touchpoint in your customer journey',
                },
                {
                  icon: <Brain size={36} />,
                  title: 'AI Deal Scoring',
                  desc: 'Predict which leads will close with ML-powered probability',
                },
                {
                  icon: <DollarSign size={36} />,
                  title: 'Budget Optimization',
                  desc: 'Get data-driven budget allocation recommendations',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="card-bottom-glow rounded-2xl p-8 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
                  style={{
                    background: 'rgba(20, 16, 5, 0.7)',
                    border: '1px solid rgba(212,175,55,0.18)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 0 30px rgba(212,175,55,0.08)',
                  }}
                >
                  <div className="mb-4" style={{ color: '#D4AF37', filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6))' }}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: '#D4AF37' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'rgba(245,215,142,0.6)' }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

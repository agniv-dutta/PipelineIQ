'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Layout';
import { AttributionAnalytics, AIInsights } from '@/components/Analytics';
import { useAuthStore } from '@/lib/store';
import { BarChart3, Brain } from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [tab, setTab] = useState<'attribution' | 'insights'>('attribution');
  const [companyId] = useState(1);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gold-100">Analytics</h1>
            <p className="text-gray-400 mt-2">Deep dive into attribution and AI insights</p>
          </div>

          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setTab('attribution')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
                tab === 'attribution'
                  ? 'text-gold-500 border-gold-500'
                  : 'text-gray-400 border-transparent hover:text-gold-300'
              }`}
            >
              <BarChart3 size={20} /> Attribution Models
            </button>
            <button
              onClick={() => setTab('insights')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${
                tab === 'insights'
                  ? 'text-gold-500 border-gold-500'
                  : 'text-gray-400 border-transparent hover:text-gold-300'
              }`}
            >
              <Brain size={20} /> AI Insights
            </button>
          </div>

          {tab === 'attribution' ? (
            <AttributionAnalytics companyId={companyId} />
          ) : (
            <AIInsights companyId={companyId} />
          )}
        </div>
      </main>
    </div>
  );
}

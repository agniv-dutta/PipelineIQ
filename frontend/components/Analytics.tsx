'use client';

import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { ChartCard } from './Layout';
import { Lightbulb, Target } from 'lucide-react';

export const AttributionAnalytics = ({ companyId }: { companyId: number }) => {
  const [model, setModel] = useState('linear');
  const [data, setData] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [revenueRes, overviewRes] = await Promise.all([
          analyticsAPI.getRevenueByChannel(companyId, model),
          analyticsAPI.getOverview(companyId, model),
        ]);
        setData(revenueRes.data);
        setSummary(overviewRes.data);
      } catch (error) {
        console.error('Failed to fetch attribution data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId, model]);

  if (loading) {
    return <div className="text-gold-300/50 animate-pulse">Loading attribution data...</div>;
  }

  const models = ['linear', 'first_touch', 'last_touch', 'time_decay'];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gold-300/60 mb-3 tracking-wide">Attribution Model</label>
        <div className="flex gap-2 flex-wrap">
          {models.map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                model === m
                  ? 'text-black shadow-goldGlow'
                  : 'text-gold-300/60 hover:text-gold-300'
              }`}
              style={
                model === m
                  ? { background: 'linear-gradient(135deg, #D4AF37 0%, #A67C00 100%)' }
                  : {
                      background: 'rgba(212,175,55,0.05)',
                      border: '1px solid rgba(212,175,55,0.15)',
                    }
              }
            >
              {m === 'first_touch' && 'First Touch'}
              {m === 'last_touch' && 'Last Touch'}
              {m === 'time_decay' && 'Time Decay'}
              {m === 'linear' && 'Linear'}
            </button>
          ))}
        </div>
      </div>

      <ChartCard title={`Revenue Attribution (${model})`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Attributed Revenue', value: formatCurrency(summary?.revenue_attributed || 0) },
            { label: 'Total Ad Spend', value: formatCurrency(summary?.total_ad_spend || 0) },
            { label: 'ROAS', value: `${(summary?.roas || 0).toFixed(2)}x` },
          ].map((stat, i) => (
            <div
              key={i}
              className="card-bottom-glow rounded-lg p-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'rgba(212,175,55,0.04)',
                border: '1px solid rgba(212,175,55,0.12)',
              }}
            >
              <p className="text-sm text-gold-300/60">{stat.label}</p>
              <p className="text-2xl font-bold text-gold-500 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Revenue by Channel">
        <div className="space-y-3">
          {data?.channels?.map((channel: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gold-500/5 transition-all duration-300"
              style={{ border: '1px solid rgba(212,175,55,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gold-500 shadow-goldGlow" />
                <span className="text-sm font-medium text-gold-100">{channel.platform}</span>
              </div>
              <span className="text-sm font-semibold text-gold-500">{formatCurrency(channel.attributed_revenue)}</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export const AIInsights = ({ companyId }: { companyId: number }) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsAPI.getBudgetRecommendations(companyId);
        setInsights(response.data);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  if (loading) {
    return <div className="text-gold-300/50 animate-pulse">Loading AI insights...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-gold-100 mb-4">
          <Lightbulb size={24} className="text-gold-500" /> Budget Optimization
        </h2>
        <div className="space-y-3">
          {insights?.recommendations?.slice(0, 6).map((rec: any, idx: number) => (
            <div
              key={idx}
              className="card-bottom-glow rounded-2xl p-4 hover:-translate-y-1 transition-all duration-300"
              style={{
                background: 'rgba(17,13,3,0.7)',
                border: '1px solid rgba(212,175,55,0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gold-100">{rec.recommendation}</p>
                  <p className="text-sm text-gold-300/50 mt-1">{rec.campaign_name}</p>
                  <p className="text-sm text-gold-300/70 mt-2">{rec.action}</p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      rec.priority === 'high'
                        ? 'bg-red-900/30 text-red-300 border border-red-700/30'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30'
                        : 'bg-blue-900/30 text-blue-300 border border-blue-700/30'
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <p className="text-sm font-semibold text-gold-500 mt-2">{(rec.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-gold-100 mb-4">
          <Target size={24} className="text-gold-500" /> High-Intent Leads
        </h2>
        <p className="text-sm text-gold-300/50 mb-3">Leads with highest close probability</p>
        <div className="space-y-2">
          {insights?.recommendations?.slice(0, 3).map((rec: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gold-500/5 transition-all duration-300"
              style={{ border: '1px solid rgba(212,175,55,0.1)', background: 'rgba(212,175,55,0.03)' }}
            >
              <span className="text-sm text-gold-300/70">{rec.campaign_name}</span>
              <span className="text-sm font-semibold text-gold-500">{(rec.confidence * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

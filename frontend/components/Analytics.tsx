'use client';

import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { ChartCard } from './Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    return <div className="text-gray-400">Loading attribution data...</div>;
  }

  const models = ['linear', 'first_touch', 'last_touch', 'time_decay'];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-3 tracking-wide">Attribution Model</label>
        <div className="flex gap-2 flex-wrap">
          {models.map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                model === m
                  ? 'bg-gradient-to-r from-gold-600 to-gold-700 text-black shadow-goldGlow'
                  : 'bg-card text-gray-400 border border-border hover:bg-gold-500/10 hover:text-gold-400'
              }`}
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
          <div className="bg-card border border-border rounded-lg p-4 hover:shadow-goldGlow transition-all duration-300">
            <p className="text-sm text-gray-400">Total Attributed Revenue</p>
            <p className="text-2xl font-bold text-gold-500 mt-2">{formatCurrency(summary?.revenue_attributed || 0)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 hover:shadow-goldGlow transition-all duration-300">
            <p className="text-sm text-gray-400">Total Ad Spend</p>
            <p className="text-2xl font-bold text-gold-500 mt-2">{formatCurrency(summary?.total_ad_spend || 0)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 hover:shadow-goldGlow transition-all duration-300">
            <p className="text-sm text-gray-400">ROAS</p>
            <p className="text-2xl font-bold text-gold-500 mt-2">{(summary?.roas || 0).toFixed(2)}x</p>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Revenue by Campaign">
        <div className="space-y-3">
          {data?.channels?.map((channel: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-gold-500/5 transition-all duration-300">
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
    return <div className="text-gray-400">Loading AI insights...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-gold-100 mb-4">
          <Lightbulb size={24} className="text-gold-500" /> Budget Optimization
        </h2>
        <div className="space-y-3">
          {insights?.recommendations?.slice(0, 6).map((rec: any, idx: number) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-4 hover:shadow-goldGlow hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gold-100">{rec.recommendation}</p>
                  <p className="text-sm text-gray-400 mt-1">{rec.campaign_name}</p>
                  <p className="text-sm text-gray-300 mt-2">{rec.action}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    rec.priority === 'high' ? 'bg-red-900/30 text-red-300 border border-red-700/30' : 
                    rec.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30' : 
                    'bg-blue-900/30 text-blue-300 border border-blue-700/30'
                  }`}>
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
        <div className="space-y-2">
          <p className="text-sm text-gray-400 mb-3">Leads with highest close probability</p>
          <div className="space-y-2">
            {insights?.recommendations?.slice(0, 3).map((rec: any, idx: number) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between hover:bg-gold-500/5 transition-all duration-300">
                <span className="text-sm text-gray-300">{rec.campaign_name}</span>
                <span className="text-sm font-semibold text-gold-500">{(rec.confidence * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

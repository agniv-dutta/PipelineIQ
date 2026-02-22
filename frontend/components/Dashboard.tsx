'use client';

import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { KPICard, ChartCard } from './Layout';
import { DollarSign, TrendingUp, Wallet, Target, Users } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
} from 'recharts';

const COLORS = ['#D4AF37', '#F5D78E', '#C9A227', '#A67C00', '#FFF4D6'];

export const DashboardOverview = ({ companyId }: { companyId: number }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsAPI.getOverview(companyId);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) {
    return <div className="text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="Total Ad Spend" value={formatCurrency(data?.total_ad_spend || 0)} icon={<DollarSign size={32} />} />
        <KPICard label="Pipeline Value" value={formatCurrency(data?.pipeline_value || 0)} icon={<TrendingUp size={32} />} />
        <KPICard label="Revenue Attributed" value={formatCurrency(data?.revenue_attributed || 0)} icon={<Wallet size={32} />} />
        <KPICard label="ROAS" value={`${(data?.roas || 0).toFixed(2)}x`} icon={<Target size={32} />} />
        <KPICard label="CAC" value={formatCurrency(data?.cac || 0)} icon={<Users size={32} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelChartComponent companyId={companyId} />
        <RevenueByChannelChart companyId={companyId} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TopCampaignsChart companyId={companyId} />
      </div>
    </div>
  );
};

const FunnelChartComponent = ({ companyId }: { companyId: number }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsAPI.getFunnel(companyId);
        setData(response.data.funnel || []);
      } catch (error) {
        console.error('Failed to fetch funnel:', error);
      }
    };

    fetchData();
  }, [companyId]);

  const chartData = data.map((d, idx) => ({
    name: d.stage,
    value: d.count,
    fill: COLORS[idx % COLORS.length],
  }));

  return (
    <ChartCard title="Sales Funnel">
      <ResponsiveContainer width="100%" height={300}>
        <FunnelChart>
          <Funnel dataKey="value" data={chartData}>
            {chartData.map((item, index) => (
              <Cell key={`cell-${index}`} fill={item.fill} />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const RevenueByChannelChart = ({ companyId }: { companyId: number }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsAPI.getRevenueByChannel(companyId);
        setData(response.data.channels || []);
      } catch (error) {
        console.error('Failed to fetch revenue by channel:', error);
      }
    };

    fetchData();
  }, [companyId]);

  return (
    <ChartCard title="Revenue by Channel">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5D78E" />
              <stop offset="100%" stopColor="#A67C00" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
          <XAxis dataKey="platform" stroke="#64748b" tick={{ fill: '#64748b' }} />
          <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
          <Tooltip 
            contentStyle={{ 
              background: '#111111', 
              border: '1px solid rgba(212,175,55,0.15)',
              borderRadius: '8px',
              color: '#FFF4D6'
            }} 
          />
          <Bar dataKey="attributed_revenue" fill="url(#goldGradient)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

const TopCampaignsChart = ({ companyId }: { companyId: number }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsAPI.getTopCampaigns(companyId, 10);
        setData(response.data.campaigns || []);
      } catch (error) {
        console.error('Failed to fetch top campaigns:', error);
      }
    };

    fetchData();
  }, [companyId]);

  return (
    <ChartCard title="Top 5 Campaigns by ROAS">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 text-gray-400 font-semibold tracking-wide">Campaign</th>
              <th className="text-left py-3 px-4 text-gray-400 font-semibold tracking-wide">Platform</th>
              <th className="text-right py-3 px-4 text-gray-400 font-semibold tracking-wide">Spend</th>
              <th className="text-right py-3 px-4 text-gray-400 font-semibold tracking-wide">Revenue</th>
              <th className="text-right py-3 px-4 text-gray-400 font-semibold tracking-wide">ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((campaign) => (
              <tr key={campaign.campaign_id} className="hover:bg-gold-500/5 transition">
                <td className="py-3 px-4 text-gold-100">{campaign.campaign_name}</td>
                <td className="py-3 px-4 text-gray-400">{campaign.platform}</td>
                <td className="py-3 px-4 text-right text-gray-400">{formatCurrency(campaign.spend)}</td>
                <td className="py-3 px-4 text-right text-gray-400">{formatCurrency(campaign.attributed_revenue)}</td>
                <td className="py-3 px-4 text-right text-gold-500 font-semibold">{campaign.roas.toFixed(2)}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
};

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Layout';
import { campaignsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function CampaignsPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId] = useState(1);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    } else {
      fetchCampaigns();
    }
  }, [token, router]);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignsAPI.getByCompany(companyId);
      setCampaigns(response.data as any[]);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!token || loading) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gold-100 tracking-tight">Campaigns</h1>
            <p className="text-gold-300/60 mt-2">Manage and monitor your marketing campaigns</p>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(30, 18, 3, 0.75)',
              border: '1px solid rgba(212,175,55,0.18)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 0 30px rgba(212,175,55,0.08)',
            }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gold-500">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gold-500">Platform</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gold-500">Budget</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gold-500">Spend</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gold-500">Impressions</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gold-500">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="transition"
                    style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-6 py-4 text-gold-100 font-medium">{campaign.name}</td>
                    <td className="px-6 py-4 text-gold-300">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}
                      >
                        {campaign.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gold-300">{formatCurrency(campaign.budget)}</td>
                    <td className="px-6 py-4 text-right text-gold-300">{formatCurrency(campaign.cost)}</td>
                    <td className="px-6 py-4 text-right text-gold-300">{campaign.impressions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-gold-300">{campaign.clicks.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-12 text-gold-300/50">
              No campaigns found. Create your first campaign to get started.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

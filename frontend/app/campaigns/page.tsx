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
      setCampaigns(response.data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!token || loading) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Campaigns</h1>
            <p className="text-slate-400 mt-2">Manage and monitor your marketing campaigns</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Platform</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Budget</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Spend</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Impressions</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-800 transition">
                    <td className="px-6 py-4 text-white font-medium">{campaign.name}</td>
                    <td className="px-6 py-4 text-slate-300">
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold">
                        {campaign.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-300">{formatCurrency(campaign.budget)}</td>
                    <td className="px-6 py-4 text-right text-slate-300">{formatCurrency(campaign.cost)}</td>
                    <td className="px-6 py-4 text-right text-slate-300">{campaign.impressions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-slate-300">{campaign.clicks.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No campaigns found. Create your first campaign to get started.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

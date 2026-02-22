'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Layout';
import { DashboardOverview } from '@/components/Dashboard';
import { useAuthStore } from '@/lib/store';

export default function DashboardPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [companyId] = useState(1);

  useEffect(() => {
    if (!token) router.push('/auth/login');
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gold-100 tracking-tight">Dashboard</h1>
            <p className="text-gold-300/60 mt-2">Real-time revenue attribution and campaign performance</p>
          </div>
          <DashboardOverview companyId={companyId} />
        </div>
      </main>
    </div>
  );
}

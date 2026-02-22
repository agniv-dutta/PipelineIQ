import type { Metadata } from 'next';
import { Navbar } from '@/components/Layout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'PipelineIQ - AI Revenue Attribution Platform',
  description: 'AI-powered revenue attribution and GTM intelligence for B2B SaaS',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gold-100" style={{ background: '#0A0A0A' }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

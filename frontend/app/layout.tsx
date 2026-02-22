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
      <body style={{ background: '#110900', color: '#FFF4D6' }}>
        {/* Rocky golden nebula background — fixed, below everything */}
        <div className="particles-bg" />
        {/* Sparkle particle field — second fixed layer */}
        <div className="particles-fg" />
        {/* All page content sits above both background layers */}
        <div className="page-content" style={{ minHeight: '100vh' }}>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}

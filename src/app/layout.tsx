import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoAIdealership | Autonomous AI Dealership Operating System',
  description: 'The Autonomous AI Dealership Platform. Sourcing, inventory management, instant VIN decoding, automated listing studio, and multi-channel sales pipeline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}

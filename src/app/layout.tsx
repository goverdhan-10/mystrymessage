import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/sonner';
import ClientComponent from './ClientComponent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShhBox | Anonymous Feedback',
  description: 'Your secure platform for anonymous feedback and messages.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`bg-slate-50 text-slate-800`}>
      <AuthProvider>
        <body className={inter.className}>
          <ClientComponent/>
          {children}
          <Toaster richColors/>
        </body>
      </AuthProvider>
    </html>
  );
}
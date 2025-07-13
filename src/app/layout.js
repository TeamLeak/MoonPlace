'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#0f051d] text-white`}>
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow pt-24">
              {children}
            </main>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
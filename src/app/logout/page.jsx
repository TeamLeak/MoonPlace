'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    // Perform logout when component mounts
    const performLogout = async () => {
      try {
        await logout();
        // Redirect to home after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/');
      }
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 bg-gradient-to-b from-[#0f051d] to-[#1a0b2e] text-white">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <FaSignOutAlt className="text-red-500 text-2xl" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">{t('auth.loggingOut')}</h1>
        <p className="text-gray-400 mb-8">{t('auth.pleaseWait')}</p>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div className="bg-red-500 h-2.5 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

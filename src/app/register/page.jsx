'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration form submitted:', formData);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-white bg-gradient-to-b from-[#0f051d] to-[#1a0b2e] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-[#1a1a1a] rounded-xl border border-gray-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('auth.createAccount')}</h1>
            <p className="text-gray-400">{t('auth.registerSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                {t('auth.username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={t('auth.usernamePlaceholder')}
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={t('auth.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength="8"
                  className="block w-full pl-10 pr-3 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">{t('auth.passwordRequirements')}</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  minLength="8"
                  className="block w-full pl-10 pr-3 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-700 rounded bg-[#2a2a2a]"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeTerms" className="text-gray-300">
                  {t('auth.agreeTo')}{' '}
                  <a href="/terms" className="text-red-500 hover:underline">
                    {t('auth.termsOfService')}
                  </a>{' '}
                  {t('common.and')}{' '}
                  <a href="/privacy" className="text-red-500 hover:underline">
                    {t('auth.privacyPolicy')}
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              {t('auth.signUp')}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1a1a] text-gray-400">
                  {t('auth.orContinueWith')}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm bg-[#2a2a2a] text-sm font-medium text-white hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-700 rounded-lg shadow-sm bg-[#2a2a2a] text-sm font-medium text-white hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaGithub className="h-5 w-5 text-white" />
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-red-500 hover:underline">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useUser } from '@/hooks/useUser';

export default function Navbar() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links with translations
  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'shop', path: '/shop' },
    { key: 'contact', path: '/contact' },
  ];

  // Get user session
  const { data: user, isLoading } = useUser();

  // Auth links
  const authLinks = [
    { key: user ? 'profile' : 'login', path: user ? '/profile' : '/login' },
  ];

  // Mobile menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
      className={`fixed top-0 z-40 w-full backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? 'bg-[#1a0b2e]/90 py-4' : 'bg-[#1a0b2e]/30 py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-transparent bg-clip-text">
            MoonPlace
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-lg transition-colors ${
                    pathname === link.path ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {t(`common.${link.key}`)}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link
                href={user ? "/profile" : "/login"}
                className="px-6 py-2 bg-[#a855f7] rounded-lg hover:bg-[#9333ea] transition-colors text-white whitespace-nowrap"
              >
                {t(user ? 'common.profile' : 'common.login')}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white/70 hover:text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <div className="flex flex-col space-y-3">
              {[...navLinks, ...authLinks].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pathname === link.path 
                      ? 'bg-[#a855f7] text-white' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(`common.${link.key}`)}
                </Link>
              ))}
            </div>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

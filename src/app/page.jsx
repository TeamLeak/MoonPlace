"use client";
import React, {useEffect, useState} from "react";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/context/LanguageContext";
import { 
  FaGamepad, 
  FaDownload, 
  FaWindows, 
  FaApple, 
  FaPlug, 
  FaCopy, 
  FaBook,
  FaShieldAlt,
  FaUsers,
  FaTasks,
  FaCoins,
  FaUserPlus
} from "react-icons/fa";
import { BsFillCircleFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

function MainComponent() {
  const { data: user } = useUser();
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showLauncherModal, setShowLauncherModal] = useState(false);
  const [features, setFeatures] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add icons and colors to features
  const enhancedFeatures = (Array.isArray(features) ? features : []).map((feature, index) => {
    const icons = [
      <FaShieldAlt key="shield" className="text-white text-xl" />,
      <FaUsers key="users" className="text-white text-xl" />,
      <FaTasks key="tasks" className="text-white text-xl" />,
      <FaCoins key="coins" className="text-white text-xl" />
    ];
    return {
      ...feature,
      icon: icons[index] || <FaGamepad className="text-white text-xl" />,
      color: ["bg-red-500", "bg-orange-500", "bg-green-500", "bg-blue-500"][index] || ""
    };
  });

  // Add image URLs to screenshots
  const enhancedScreenshots = (Array.isArray(screenshots) ? screenshots : []).map((screenshot, index) => ({
    ...screenshot,
    id: screenshot?.id || index + 1,
    image_url: screenshot?.image_url || ["/minecraft-spawn.jpg", "/minecraft-city.jpg", "/minecraft-pvp.jpg"][index] || "",
    title: screenshot?.title || `Screenshot ${index + 1}`,
    description: screenshot?.description || ''
  }));

  // Load translations for features and screenshots when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const lang = language || localStorage.getItem('language') || 'ru';
        const response = await import(`@/locales/${lang}.json`);
        const translations = response.default || response;
        
        // Ensure we have the correct structure
        const featuresData = translations.features || [];
        const screenshotsData = translations.screenshots || [];
        
        setFeatures(featuresData);
        setScreenshots(screenshotsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to Russian if there's an error
        if (language !== 'ru') {
          try {
            const fallback = await import('@/locales/ru.json');
            setFeatures(fallback.features || []);
            setScreenshots(fallback.screenshots || []);
          } catch (e) {
            console.error('Failed to load fallback translations:', e);
          }
        }
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // Handle scroll effect for progress bar and section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "screenshots"];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= window.innerHeight / 2 && bottom >= window.innerHeight / 2) {
            setActiveSection(section);
          }
        }
      });

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  // Show loading state only if we're still loading and have no features/screenshots
  if (isLoading && features.length === 0 && screenshots.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f051d]">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f051d] to-[#1a0b2e] text-white">
      {/* Scroll progress indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#a855f7] z-40 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Section navigation dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
        {[
          { id: "home", label: t('common.home') },
          { id: "features", label: t('common.features') },
          { id: "screenshots", label: t('common.screenshots') },
        ].map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            title={section.label}
            className={`block w-3 h-3 my-4 rounded-full transition-all duration-300 ${
              activeSection === section.id
                ? "bg-[#a855f7] scale-150"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center pt-24 px-4"
        style={{
          background: 'radial-gradient(600px at 50% 50%, rgba(168, 85, 247, 0.15), transparent 80%)',
        }}
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <h1 className="text-7xl font-bold leading-tight">
                <span className="block text-2xl text-[#a855f7] mb-4">
                  {t('common.welcome')}
                </span>
                <div className="relative inline-block">
                  Moon
                  <div className="absolute -inset-1 bg-[#a855f7] opacity-20 blur-lg"></div>
                </div>{" "}
                <div className="relative inline-block">
                  Place
                  <div className="absolute -inset-1 bg-[#ff69b4] opacity-20 blur-lg"></div>
                </div>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Лучший Minecraft сервер с уникальными возможностями, дружным
                сообществом и захватывающими приключениями. Присоединяйся к нам
                прямо сейчас!
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => setShowLauncherModal(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-lg text-center"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-[#a855f7] ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0" />
                  <span className="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-[#ff69b4] ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0" />
                  <span className="relative">Начать играть</span>
                </button>
                <a
                  href="/shop"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg border border-white/20 hover:bg-white/10 transition-colors rounded-lg text-center"
                >
                  Купить монеты
                </a>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>
                  Онлайн: <span className="text-green-400 font-bold">247</span>
                </span>
                <span>•</span>
                <span>
                  Версия: <span className="text-[#a855f7]">1.20.1</span>
                </span>
              </div>
            </div>
            <div className="relative">
              <img
                src="/hero.png"
                alt="Moon Place Minecraft сервер"
                className="relative rounded-lg transform hover:scale-105 transition-transform duration-500 cursor-pointer ml-36"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#features" className="text-white/50 hover:text-white">
            <i className="fas fa-chevron-down text-2xl" />
          </a>
        </div>
      </section>

      {/* Особенности */}
      <section id="features" className="relative py-32 px-4">
        {/* Кривой переход сверху */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-20"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#000"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="mb-16 text-center">
            <div className="text-red-500 text-sm font-bold tracking-wider mb-4 uppercase">
              Особенности
            </div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Уникальные <br />
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
                возможности
              </span>{" "}
              для <br />
              игроков
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {enhancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-[#1a1a1a] border border-gray-800 p-6 rounded-xl hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#1a1a1a] to-[#2a1a1a] border border-gray-800 rounded-xl p-6 md:p-8">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Готов начать свое приключение?
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                Присоединяйся к тысячам игроков. Вступай в кланы, участвуй в
                войнах и стань легендой.
              </p>
            </div>
            <a
              href="/register"
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 whitespace-nowrap flex items-center gap-2"
            >
              <FaUserPlus className="text-lg" />
              Создать аккаунт
            </a>
          </div>
        </div>

        {/* Кривой переход снизу */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
          <svg
            className="relative block w-full h-20"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#2d1b4b"
            ></path>
          </svg>
        </div>
      </section>

      {/* Скриншоты */}
      <section id="screenshots" className="relative py-32 px-4 bg-[#2d1b4b]">
        <div className="container mx-auto relative">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="relative">
              {t('common.screenshots')}
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#a855f7] to-[#ff69b4]" />
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.map((screenshot, index) => (
              <div
                key={screenshot.id}
                className="group relative overflow-hidden rounded-xl cursor-pointer h-[300px]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a0b2e] opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
                <img
                  src={screenshot.image_url}
                  alt={screenshot.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-end p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{screenshot.title}</h3>
                    <p className="text-gray-300 text-sm">{screenshot.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Launcher Modal */}
      {showLauncherModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowLauncherModal(false)}
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0b2e] via-[#0f051d] to-[#1a0b2e] border border-[#a855f7]/20 shadow-2xl shadow-[#a855f7]/10">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_500px_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)] animate-spin-slow"></div>
              <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setShowLauncherModal(false)}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5"
            >
              <IoMdClose className="w-6 h-6" />
            </button>

            <div className="relative z-10">
              {/* Header */}
              {/* Header with gradient */}
              <div className="p-8 text-center bg-gradient-to-r from-[#a855f7]/20 to-[#ff69b4]/20 border-b border-white/5">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#a855f7] to-[#ff69b4] shadow-lg mb-4">
                  <FaGamepad className="text-3xl text-white" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#a855f7] via-[#d946ef] to-[#ff69b4] text-transparent bg-clip-text mb-2">
                  {t('common.joinServer')}
                </h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  {t('common.joinServerDescription')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Download Section */}
                <div className="group relative bg-[#1a0b2e]/50 backdrop-blur-lg rounded-xl p-6 border border-[#a855f7]/20 hover:border-[#a855f7]/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#8b5cf6] flex items-center justify-center text-2xl text-white mb-4">
                      <FaDownload />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      {t('launcher.step1')}
                    </h4>
                    <p className="text-gray-400 text-sm mb-6">
                      {t('launcher.downloadDescription')}
                    </p>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-green-500/20">
                        <FaWindows />
                        {t('launcher.downloadForWindows')}
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-300 font-medium py-3 px-6 rounded-lg transition-all duration-300 border border-white/5">
                        <FaApple />
                        {t('launcher.downloadForMac')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Connect Section */}
                <div className="group relative bg-[#1a0b2e]/50 backdrop-blur-lg rounded-xl p-6 border border-[#ff69b4]/20 hover:border-[#ff69b4]/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff69b4]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#ff69b4] to-[#ec4899] flex items-center justify-center text-2xl text-white mb-4">
                      <FaPlug />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">
                      {t('launcher.step2')}
                    </h4>
                    <p className="text-gray-400 text-sm mb-6">
                      {t('launcher.connectDescription')}
                    </p>
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#ff69b4] rounded-lg blur opacity-30"></div>
                        <button
                          onClick={() => {
                            copyToClipboard("play.moonplace.world");
                            // Add visual feedback
                            const button = document.getElementById('server-ip-button');
                            if (button) {
                              const originalContent = button.innerHTML;
                            button.innerHTML = '<FaCheck className="mr-2" /> ' + t('launcher.copied');
                            setTimeout(() => {
                              button.innerHTML = '<FaCopy className="mr-2" /> play.moonplace.world';
                            }, 2000);
                            }
                          }}
                          id="server-ip-button"
                          className="relative w-full flex items-center justify-center gap-2 bg-[#2d1b4b] hover:bg-[#3d2b5b] text-[#ff69b4] font-medium py-3 px-6 rounded-lg transition-all duration-300 border border-[#ff69b4]/30 hover:border-[#ff69b4]/50"
                        >
                          <FaCopy className="mr-2" />
                          play.moonplace.world
                        </button>
                      </div>
                      <button className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-300 font-medium py-3 px-6 rounded-lg transition-all duration-300 border border-white/5">
                        <FaBook className="mr-2" />
                        {t('launcher.howToConnect')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Server Status */}
              <div className="px-8 pb-8">
                <div className="bg-[#1a0b2e]/50 backdrop-blur-lg rounded-xl p-6 border border-white/5">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BsFillCircleFill className="text-green-500 text-xs animate-pulse" />
                    {t('launcher.serverStatus')}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">247</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">{t('launcher.playersOnline')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">1.20.1</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">{t('launcher.version')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">99.9%</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">{t('launcher.uptime')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">24/7</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">{t('launcher.support')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MainComponent;
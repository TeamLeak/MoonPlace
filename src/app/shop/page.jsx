"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function ShopPageComponent() {
  const { data: user } = useUser();
  const { t } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Coin packages with benefits
  const coinPackages = [
    {
      id: 1,
      coins: 100,
      price: 50,
      bonus: 0,
      popular: false,
      icon: "fas fa-coins",
      features: ["Базовый пакет", "Мгновенное зачисление"],
    },
    {
      id: 2,
      coins: 250,
      price: 120,
      bonus: 25,
      popular: false,
      icon: "fas fa-gem",
      features: ["+25 бонусных монет", "Быстрая доставка"],
    },
    {
      id: 3,
      coins: 500,
      price: 230,
      bonus: 100,
      popular: true,
      icon: "fas fa-crown",
      features: ["+100 бонусных монет", "VIP-поддержка 24/7", "Эксклюзивный значок в чате"],
    },
    {
      id: 4,
      coins: 1000,
      price: 450,
      bonus: 250,
      popular: false,
      icon: "fas fa-trophy",
      features: ["+250 бонусных монет", "Приоритетная поддержка", "Доступ к бета-тестам"],
    },
    {
      id: 5,
      coins: 2500,
      price: 1000,
      bonus: 750,
      popular: false,
      icon: "fas fa-star",
      features: ["+750 бонусных монет", "Персональный менеджер", "Ранний доступ к обновлениям"],
    },
    {
      id: 6,
      coins: 5000,
      price: 1800,
      bonus: 2000,
      popular: false,
      icon: "fas fa-diamond",
      features: ["+2000 бонусных монет", "Все предыдущие привилегии", "Эксклюзивный скин"],
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const validateUsername = (name) => {
    if (!name.trim()) {
      setUsernameError('Введите имя пользователя');
      return false;
    }
    if (name.length < 3 || name.length > 16) {
      setUsernameError('Имя пользователя должно быть от 3 до 16 символов');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setUsernameError('Можно использовать только латинские буквы, цифры и подчеркивание');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handlePurchase = (pkg) => {
    setSelectedPackage(pkg);
    setUsername('');
    setUsernameError('');
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!validateUsername(username)) return;
    
    // Here you would typically process the payment
    console.log(`Processing purchase for ${username}:`, selectedPackage);
    
    // Show success message and close modal after a delay
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  const totalCoins = (pkg) => pkg.coins + pkg.bonus;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f051d] to-[#1a0b2e] text-white overflow-x-hidden">
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.1), transparent 60%)`,
          zIndex: -1,
        }}
      />
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:pt-32 lg:pb-24 lg:px-8">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              Магазин монет
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
            Приобретайте монеты для получения эксклюзивных возможностей и предметов на сервере
          </p>
          
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              { icon: '⚡', text: 'Мгновенное зачисление' },
              { icon: '🛡️', text: 'Безопасные платежи' },
              { icon: '🎁', text: 'Бонусы за покупки' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div className="relative py-12 px-4 sm:px-6 lg:py-16 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Выберите свой пакет</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              и получите бонусы
            </span>
          </h2>
        </div>

        {/* Coin Packages Grid */}
        <div className="grid gap-8 mt-12 max-w-7xl mx-auto sm:grid-cols-2 lg:grid-cols-3">
          {coinPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 ${
                pkg.popular 
                  ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-pink-500/50 shadow-lg shadow-pink-500/20' 
                  : 'bg-white/5 border border-white/10 hover:border-pink-500/30'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Популярный выбор
                </div>
              )}
              
              <div className="text-center">
                <div className="text-4xl mb-4 text-pink-400">
                  <i className={pkg.icon}></i>
                </div>
                <h3 className="text-2xl font-bold mb-2">{pkg.coins} монет</h3>
                {pkg.bonus > 0 && (
                  <p className="text-green-400 text-sm mb-4">+{pkg.bonus} бонусных монет</p>
                )}
                
                <div className="my-6">
                  <span className="text-4xl font-bold">{pkg.price} ₽</span>
                  {pkg.bonus > 0 && (
                    <span className="ml-2 text-sm text-gray-400 line-through">
                      {Math.ceil((pkg.coins + pkg.bonus) / 2)} ₽
                    </span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePurchase(pkg)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg shadow-pink-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-pink-500/30'
                  }`}
                >
                  Купить сейчас
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Часто задаваемые вопросы
            </span>
          </h2>
          
          <div className="space-y-4">
            {[
              {
                question: "Как быстро зачисляются монеты?",
                answer: "Монеты зачисляются мгновенно после успешной оплаты. В редких случаях это может занять до 5 минут."
              },
              {
                question: "Какие способы оплаты доступны?",
                answer: "Мы принимаем все основные банковские карты, а также популярные электронные кошельки."
              },
              {
                question: "Можно ли вернуть монеты?",
                answer: "Виртуальные валюты не подлежат возврату согласно нашим условиям использования."
              },
              {
                question: "Как использовать монеты в игре?",
                answer: "После покупки монеты автоматически появятся на вашем игровом аккаунте. Используйте их в игровом магазине."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-2">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 max-w-4xl mx-auto my-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам игроков, которые уже улучшили свой игровой опыт с нашими монетами
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#" 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Выбрать пакет
            </Link>
            <Link 
              href="/faq" 
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-lg border border-white/10 hover:border-pink-500/30 transition-all duration-200"
            >
              Узнать больше
            </Link>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0b2e] rounded-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Обработка оплаты...</p>
              </div>
            ) : isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Успешно!</h3>
                <p className="text-gray-300">Монеты зачислены на аккаунт {username}</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-center">Подтверждение покупки</h2>
                <div className="space-y-6">
                  <div className="bg-[#2d1b4b]/50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Пакет:</span>
                      <span className="font-medium">{selectedPackage?.coins} монет</span>
                    </div>
                    {selectedPackage?.bonus > 0 && (
                      <div className="flex justify-between items-center text-green-400 text-sm">
                        <span>Бонус:</span>
                        <span>+{selectedPackage?.bonus} монет</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                      <span className="font-medium">Итого:</span>
                      <span className="text-xl font-bold text-pink-400">{selectedPackage?.price} ₽</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Имя пользователя на сервере
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          if (usernameError) validateUsername(e.target.value);
                        }}
                        placeholder="Введите ваш ник"
                        className={`w-full bg-[#2d1b4b]/50 border ${
                          usernameError ? 'border-red-500' : 'border-white/10'
                        } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500`}
                        autoComplete="off"
                        spellCheck="false"
                      />
                      {usernameError && (
                        <p className="mt-1 text-sm text-red-500">{usernameError}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        Укажите ник, на который будут зачислены монеты
                      </p>
                    </div>

                    <button
                      onClick={handleConfirmPurchase}
                      disabled={!username.trim() || !!usernameError}
                      className={`w-full ${
                        !username.trim() || usernameError
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                      } text-white font-medium py-3 px-6 rounded-lg transition-all duration-200`}
                    >
                      Оплатить {selectedPackage?.price} ₽
                    </button>
                    
                    <p className="text-xs text-center text-gray-400 mt-3">
                      Нажимая кнопку, вы соглашаетесь с нашими условиями использования
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/context/LanguageContext";
import { 
  FaEnvelope, 
  FaDiscord, 
  FaTelegram, 
  FaGamepad, 
  FaUsers, 
  FaFileAlt, 
  FaQuestionCircle, 
  FaComments,
  FaCheck,
  FaCopy,
  FaExternalLinkAlt,
  FaChevronDown,
  FaChevronUp,
  FaPaperPlane,
  FaUser,
  FaTag,
  FaCommentAlt,
  FaExclamationCircle,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronRight,
} from "react-icons/fa";

function MainComponent() {
  const { data: user } = useUser();
  const { t } = useLanguage();
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ 
    success: null, 
    message: '' 
  });
  
  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Пожалуйста, введите ваше имя';
    }
    
    if (!formData.email) {
      errors.email = 'Пожалуйста, введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Пожалуйста, введите корректный email';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Пожалуйста, введите тему сообщения';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Пожалуйста, введите ваше сообщение';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Сообщение должно содержать минимум 10 символов';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        // 10% chance of error for demo purposes
        const shouldFail = Math.random() < 0.1;
        setTimeout(() => {
          if (shouldFail) {
            reject(new Error('Connection timeout'));
          } else {
            resolve();
          }
        }, 1500);
      });
      
      setSubmitStatus({
        success: true,
        message: 'Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setFormErrors({});
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ success: null, message: '' });
      }, 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        success: false,
        message: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз позже.'
      });
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ success: null, message: '' });
      }, 5000);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("contact");
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `Тема: ${formData.subject}\nИмя: ${formData.name}\nEmail: ${formData.email}\nСообщение: ${formData.message}`,
        }),
      });

      if (!response.ok) {
        throw new Error(t('contact.sendError') || "Error sending message");
      }

      setSubmitStatus({
        success: true,
        message: 'Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: 'general',
        message: ''
      });
      setFormErrors({});
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ success: null, message: '' });
      }, 5000);
      
    } catch (err) {
      console.error(err);
      setSubmitStatus({
        success: false,
        message: err.message || t('contact.sendError') || 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз позже.'
      });
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ success: null, message: '' });
      }, 5000);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      id: 'discord',
      name: "Discord",
      icon: <FaDiscord className="text-2xl" />,
      value: "discord.gg/moonplace",
      link: "https://discord.gg/moonplace",
      color: "from-indigo-500 to-indigo-700",
      copyable: true
    },
    {
      id: 'telegram',
      name: "Telegram",
      icon: <FaTelegram className="text-2xl" />,
      value: "@moonplace_support",
      link: "https://t.me/moonplace_support",
      color: "from-blue-400 to-blue-600",
      copyable: true
    },
    {
      id: 'email',
      name: "Email",
      icon: <FaEnvelope className="text-2xl" />,
      value: "support@moonplace.ru",
      link: "mailto:support@moonplace.ru",
      color: "from-red-500 to-red-700",
      copyable: true
    },
    {
      id: 'server',
      name: "Игровой сервер",
      icon: <FaGamepad className="text-2xl" />,
      value: "play.moonplace.ru",
      copyValue: "play.moonplace.ru",
      color: "from-green-500 to-green-700",
      copyable: true
    },
  ];

  const handleCopy = async (e, method) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(method.copyValue || method.value);
      setCopied(method.id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const admins = [
    {
      name: "MoonAdmin",
      role: "Главный администратор",
      avatar: "/admin1.jpg",
      description: "Основатель сервера, отвечает за общее развитие",
      discord: "MoonAdmin#0001",
      online: true,
    },
    {
      name: "StarModerator",
      role: "Старший модератор",
      avatar: "/admin2.jpg",
      description: "Контроль порядка и помощь игрокам",
      discord: "StarMod#0002",
      online: true,
    },
    {
      name: "TechSupport",
      role: "Техническая поддержка",
      avatar: "/admin3.jpg",
      description: "Решение технических проблем",
      discord: "TechSupp#0003",
      online: false,
    },
  ];

  const faqItems = [
    {
      question: "Как начать играть на сервере?",
      answer:
        "Скачайте Minecraft версии 1.20.1, добавьте наш IP адрес play.moonplace.world в список серверов и подключайтесь!",
    },
    {
      question: "Можно ли играть с модами?",
      answer:
        "Да! Мы поддерживаем Optifine и Sodium для улучшения производительности. Другие моды обсуждаются индивидуально.",
    },
    {
      question: "Как получить монеты?",
      answer:
        "Монеты можно купить в нашем магазине, получить за выполнение квестов или участие в событиях сервера.",
    },
    {
      question: "Что делать если меня забанили?",
      answer:
        "Обратитесь к администрации через Discord или Telegram с подробным описанием ситуации. Мы рассмотрим каждый случай.",
    },
    {
      question: "Как создать свой клан?",
      answer:
        "Используйте команду /clan create [название] в игре. Для создания клана нужно иметь минимум 100 монет.",
    },
    {
      question: "Есть ли мобильная версия?",
      answer:
        "Сервер работает только с Java Edition. Pocket Edition (мобильная версия) не поддерживается.",
    },
  ];

  const documents = [
    {
      id: 'rules',
      title: 'Правила сервера',
      icon: <FaFileAlt className="w-6 h-6" />,
      content: [
        'Уважайте других игроков и администрацию.',
        'Запрещены читы и использование багов.',
        'Гриферство и воровство караются баном.',
        'Не злоупотребляйте чатом и не спамьте.',
        'Следуйте указаниям администрации.'
      ]
    },
    {
      id: 'privacy',
      title: 'Политика конфиденциальности',
      icon: <FaFileAlt className="w-6 h-6" />,
      content: [
        'Мы собираем только необходимые данные для работы сервера.',
        'Ваши личные данные не передаются третьим лицам.',
        'IP-адреса используются только для защиты от нарушителей.',
        'Принимая правила, вы соглашаетесь с нашей политикой.'
      ]
    },
    {
      id: 'refund',
      title: 'Условия возврата',
      icon: <FaFileAlt className="w-6 h-6" />,
      content: [
        'Возврат средств возможен в течение 14 дней с момента покупки.',
        'Для запроса на возврат обратитесь в поддержку.',
        'При нарушении правил сервера возврат не производится.',
        'Возврат осуществляется на ту же карту, с которой была произведена оплата.'
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f051d] to-[#1a0b2e] text-white">
      <div
        className="relative"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.15), transparent 80%)`,
        }}
      >

        {/* Заголовок */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold">
              <span className="bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-transparent bg-clip-text">
                Связаться с нами
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Есть вопросы? Нужна помощь? Хотите предложить идею? Мы всегда
              готовы помочь!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: "contact", label: "Связь", icon: <FaComments className="w-5 h-5" /> },
              { id: "team", label: "Команда", icon: <FaUsers className="w-5 h-5" /> },
              { id: "docs", label: "Документы", icon: <FaFileAlt className="w-5 h-5" /> },
              { id: "faq", label: "FAQ", icon: <FaQuestionCircle className="w-5 h-5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-white shadow-lg shadow-[#a855f7]/50"
                    : "bg-[#2d1b4b]/50 hover:bg-[#2d1b4b] text-gray-300 backdrop-blur-xl"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Контент вкладок */}
        <div className="container mx-auto px-4 pb-16">
          {activeTab === "contact" && (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Форма обратной связи */}
              <div className="bg-[#2d1b4b]/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-transparent bg-clip-text">
                  Напишите нам
                </h3>

                {submitStatus.message && (
                  <div 
                    className={`mb-6 p-4 rounded-lg border-l-4 ${
                      submitStatus.success 
                        ? 'bg-green-900/20 border-green-500' 
                        : 'bg-red-900/20 border-red-500'
                    } flex items-start gap-3 animate-fadeIn`}
                  >
                    {submitStatus.success ? (
                      <FaCheckCircle className="text-green-400 text-xl mt-0.5 flex-shrink-0" />
                    ) : (
                      <FaExclamationTriangle className="text-red-400 text-xl mt-0.5 flex-shrink-0" />
                    )}
                    <p className={submitStatus.success ? 'text-green-300' : 'text-red-300'}>
                      {submitStatus.message}
                    </p>
                    <button 
                      onClick={() => setSubmitStatus({ success: null, message: '' })}
                      className="ml-auto text-gray-400 hover:text-white transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                        Ваше имя <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <FaUser className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({...formData, name: e.target.value});
                            if (formErrors.name) {
                              setFormErrors({...formErrors, name: ''});
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 bg-[#0f051d] border ${
                            formErrors.name ? 'border-red-500/50' : 'border-white/10'
                          } rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all`}
                          placeholder="Иван Иванов"
                        />
                        {formErrors.name && (
                          <div className="mt-1 text-red-400 text-sm flex items-center gap-1">
                            <FaExclamationCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{formErrors.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                          <FaEnvelope className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({...formData, email: e.target.value});
                            if (formErrors.email) {
                              setFormErrors({...formErrors, email: ''});
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-2.5 bg-[#0f051d] border ${
                            formErrors.email ? 'border-red-500/50' : 'border-white/10'
                          } rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all`}
                          placeholder="example@mail.com"
                        />
                        {formErrors.email && (
                          <div className="mt-1 text-red-400 text-sm flex items-center gap-1">
                            <FaExclamationCircle className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{formErrors.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
                      Тема <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <FaTag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => {
                          setFormData({...formData, subject: e.target.value});
                          if (formErrors.subject) {
                            setFormErrors({...formErrors, subject: ''});
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#0f051d] border ${
                          formErrors.subject ? 'border-red-500/50' : 'border-white/10'
                        } rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all`}
                        placeholder="Тема сообщения"
                      />
                      {formErrors.subject && (
                        <div className="mt-1 text-red-400 text-sm flex items-center gap-1">
                          <FaExclamationCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formErrors.subject}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                      Сообщение <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-gray-500">
                        <FaCommentAlt className="w-4 h-4" />
                      </div>
                      <textarea
                        id="message"
                        rows="5"
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({...formData, message: e.target.value});
                          if (formErrors.message) {
                            setFormErrors({...formErrors, message: ''});
                          }
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#0f051d] border ${
                          formErrors.message ? 'border-red-500/50' : 'border-white/10'
                        } rounded-lg focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all resize-none`}
                        placeholder="Опишите ваш вопрос или проблему..."
                      ></textarea>
                      {formErrors.message && (
                        <div className="mt-1 text-red-400 text-sm flex items-center gap-1">
                          <FaExclamationCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{formErrors.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all overflow-hidden relative ${
                        isSubmitting 
                          ? 'bg-[#6d28d9] cursor-not-allowed' 
                          : 'bg-gradient-to-r from-[#a855f7] to-[#ff69b4] hover:shadow-xl hover:shadow-[#a855f7]/40 hover:scale-[1.02] active:scale-[0.99] transform transition-all duration-200'
                      }`}
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Отправка...</span>
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="w-5 h-5 group-hover:animate-bounce" />
                            <span>Отправить сообщение</span>
                          </>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#a855f7] to-[#ff69b4] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                    <p className="mt-3 text-center text-sm text-gray-400">
                      Ответим в течение 24 часов
                    </p>
                  </div> {/* End of form */}
                </form>
              </div> {/* End of form container */}

              {/* Contact Methods Section */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-transparent bg-clip-text">
                  Другие способы связи
                </h3>

                <div className="grid gap-4">
                  {contactMethods.map((method) => (
                    <div
                      key={method.id}
                      className="group bg-[#2d1b4b]/50 backdrop-blur-xl rounded-xl p-5 hover:transform hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-white/5 hover:border-white/10 relative overflow-hidden"
                      onClick={() => method.link && window.open(method.link, "_blank")}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}
                        >
                          {method.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg text-white">{method.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-gray-300 text-sm truncate">{method.value}</p>
                            {method.copyable && (
                              <button 
                                onClick={(e) => handleCopy(e, method)}
                                className="text-gray-500 hover:text-white transition-colors p-1 -mr-2"
                                title="Скопировать"
                              >
                                {copied === method.id ? (
                                  <FaCheck className="w-3.5 h-3.5 text-green-400" />
                                ) : (
                                  <FaCopy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-500 group-hover:text-white transition-colors flex items-center">
                          {method.link ? (
                            <FaExternalLinkAlt className="w-4 h-4" />
                          ) : (
                            <FaChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Время работы */}
                <div className="bg-[#2d1b4b]/50 backdrop-blur-xl rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-3">
                    <i className="fas fa-clock text-[#a855f7]"></i>
                    Время работы поддержки
                  </h4>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Понедельник - Пятница</span>
                      <span className="text-green-400">10:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Суббота - Воскресенье</span>
                      <span className="text-yellow-400">12:00 - 20:00</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-3">
                      * Время указано по МСК. В Discord поддержка доступна 24/7
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-transparent bg-clip-text">
                  Наша команда
                </h3>
                <p className="text-gray-300">
                  Познакомьтесь с администрацией сервера
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {admins.map((admin, index) => (
                  <div
                    key={index}
                    className="bg-[#2d1b4b]/50 backdrop-blur-xl rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <img
                          src={admin.avatar}
                          alt={admin.name}
                          className="w-24 h-24 rounded-full mx-auto border-4 border-[#a855f7]/50"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#2d1b4b] ${
                            admin.online ? "bg-green-400" : "bg-gray-400"
                          }`}
                        ></div>
                      </div>

                      <h4 className="text-xl font-bold mb-1">{admin.name}</h4>
                      <p className="text-[#a855f7] text-sm mb-3">
                        {admin.role}
                      </p>
                      <p className="text-gray-300 text-sm mb-4">
                        {admin.description}
                      </p>

                      <div className="flex items-center justify-center gap-2 text-sm">
                        <i className="fab fa-discord text-[#5865F2]"></i>
                        <span className="font-mono">{admin.discord}</span>
                        <button
                          onClick={() => copyToClipboard(admin.discord)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>

                      <div
                        className={`mt-3 text-xs px-3 py-1 rounded-full inline-block ${
                          admin.online
                            ? "bg-green-400/20 text-green-400"
                            : "bg-gray-400/20 text-gray-400"
                        }`}
                      >
                        {admin.online ? "В сети" : "Не в сети"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "docs" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-transparent bg-clip-text">
                  Документы проекта
                </h3>
                <p className="text-gray-300">
                  Правовая информация и условия использования
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Публичная оферта",
                    icon: "fas fa-handshake",
                    color: "from-blue-500 to-blue-600",
                    description:
                      "Условия предоставления услуг и покупки игровых ценностей",
                    content: `
                      <h4 class="text-lg font-bold mb-3 text-blue-400">1. Общие положения</h4>
                      <p class="text-gray-300 mb-4">Настоящая публичная оферта определяет условия предоставления услуг игрового сервера Moon Place.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-blue-400">2. Предмет договора</h4>
                      <p class="text-gray-300 mb-4">Администрация предоставляет пользователям доступ к игровому серверу и возможность приобретения внутриигровых ценностей.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-blue-400">3. Стоимость услуг</h4>
                      <p class="text-gray-300 mb-4">Стоимость внутриигровых ценностей указана на сайте. Оплата производится в российских рублях.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-blue-400">4. Возврат средств</h4>
                      <p class="text-gray-300 mb-4">Возврат средств за приобретенные внутриигровые ценности не производится, за исключением случаев, предусмотренных законодательством РФ.</p>
                    `,
                  },
                  {
                    title: "Пользовательское соглашение",
                    icon: "fas fa-user-check",
                    color: "from-green-500 to-green-600",
                    description:
                      "Правила использования сервера и ответственность пользователей",
                    content: `
                      <h4 class="text-lg font-bold mb-3 text-green-400">1. Принятие условий</h4>
                      <p class="text-gray-300 mb-4">Используя наш сервер, вы соглашаетесь с условиями данного соглашения.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-green-400">2. Правила поведения</h4>
                      <p class="text-gray-300 mb-4">Запрещается использование читов, оскорбления других игроков, спам и другие нарушения.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-green-400">3. Ответственность</h4>
                      <p class="text-gray-300 mb-4">Пользователи несут полную ответственность за свои действия на сервере.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-green-400">4. Санкции</h4>
                      <p class="text-gray-300 mb-4">За нарушение правил могут применяться санкции: предупреждение, временный или постоянный бан.</p>
                    `,
                  },
                  {
                    title: "Политика конфиденциальности",
                    icon: "fas fa-shield-alt",
                    color: "from-purple-500 to-purple-600",
                    description:
                      "Обработка и защита персональных данных пользователей",
                    content: `
                      <h4 class="text-lg font-bold mb-3 text-purple-400">1. Сбор данных</h4>
                      <p class="text-gray-300 mb-4">Мы собираем только необходимые данные: email, игровой никнейм и статистику игры.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-purple-400">2. Использование данных</h4>
                      <p class="text-gray-300 mb-4">Данные используются для обеспечения работы сервера и связи с пользователями.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-purple-400">3. Защита данных</h4>
                      <p class="text-gray-300 mb-4">Мы применяем современные методы защиты для обеспечения безопасности ваших данных.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-purple-400">4. Права пользователей</h4>
                      <p class="text-gray-300 mb-4">Вы имеете право на доступ, изменение и удаление своих персональных данных.</p>
                    `,
                  },
                  {
                    title: "Правила проекта",
                    icon: "fas fa-gavel",
                    color: "from-red-500 to-red-600",
                    description:
                      "Основные правила игры и поведения на сервере Moon Place",
                    content: `
                      <h4 class="text-lg font-bold mb-3 text-red-400">1. Общие правила</h4>
                      <p class="text-gray-300 mb-4">Уважайте других игроков, не используйте нецензурную лексику, играйте честно.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-red-400">2. Запрещенные действия</h4>
                      <p class="text-gray-300 mb-4">Читы, дюпы, гриферство, реклама других серверов, продажа игровых ценностей за реальные деньги.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-red-400">3. PvP правила</h4>
                      <p class="text-gray-300 mb-4">PvP разрешено только в специальных зонах. Убийство в мирных зонах карается баном.</p>
                      
                      <h4 class="text-lg font-bold mb-3 text-red-400">4. Строительство</h4>
                      <p class="text-gray-300 mb-4">Запрещено строить неэстетичные постройки, лаг-машины и блокировать проходы.</p>
                    `,
                  },
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="bg-[#2d1b4b]/50 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 hover:border-[#a855f7]/50 transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${doc.color} rounded-lg flex items-center justify-center`}
                        >
                          <i className={`${doc.icon} text-white text-xl`}></i>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">{doc.title}</h4>
                          <p className="text-gray-400 text-sm">
                            {doc.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setOpenFaq(
                            openFaq === `doc-${index}` ? null : `doc-${index}`
                          )
                        }
                        className="w-full bg-[#1a0b2e] hover:bg-[#2a1b3e] px-4 py-3 rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium">Читать документ</span>
                        <i
                          className={`fas fa-chevron-down transition-transform duration-300 ${
                            openFaq === `doc-${index}` ? "rotate-180" : ""
                          }`}
                        ></i>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openFaq === `doc-${index}`
                            ? "max-h-[500px] opacity-100 mt-4"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="bg-[#1a0b2e] rounded-lg p-4 text-sm leading-relaxed max-h-96 overflow-y-auto">
                          <div
                            dangerouslySetInnerHTML={{ __html: doc.content }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <div className="bg-[#2d1b4b]/50 backdrop-blur-xl rounded-xl p-8">
                  <h4 className="text-xl font-bold mb-4">
                    Вопросы по документам?
                  </h4>
                  <p className="text-gray-300 mb-6">
                    Если у вас есть вопросы по правовым документам, свяжитесь с
                    нашей администрацией
                  </p>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="bg-gradient-to-r from-[#a855f7] to-[#ff69b4] hover:from-[#9333ea] hover:to-[#e11d48] px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    Связаться с нами
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-transparent bg-clip-text">
                  Часто задаваемые вопросы
                </h3>
                <p className="text-gray-300">
                  Ответы на самые популярные вопросы
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-transparent bg-clip-text">
                  Частые вопросы
                </h3>
                <div className="space-y-3">
                  {faqItems.map((item, index) => (
                    <div
                      key={index}
                      className={`bg-[#1a0b2e]/80 border ${
                        openFaq === index
                          ? 'border-[#a855f7]/50 shadow-lg shadow-[#a855f7]/10'
                          : 'border-white/5 hover:border-white/10'
                      } rounded-xl overflow-hidden transition-all duration-300`}
                    >
                      <button
                        onClick={() =>
                          setOpenFaq(openFaq === index ? null : index)
                        }
                        className="w-full text-left p-5 flex justify-between items-center group"
                      >
                        <span className="font-medium text-left pr-4">{item.question}</span>
                        <div className={`transform transition-transform duration-300 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}>
                          <svg className="w-5 h-5 text-[#a855f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          openFaq === index ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="p-5 pt-0 text-gray-300">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 text-center">
                <div className="bg-[#2d1b4b]/50 backdrop-blur-xl rounded-xl p-8">
                  <h4 className="text-xl font-bold mb-4">Не нашли ответ?</h4>
                  <p className="text-gray-300 mb-6">
                    Задайте свой вопрос нашей команде поддержки
                  </p>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="bg-gradient-to-r from-[#a855f7] to-[#ff69b4] hover:from-[#9333ea] hover:to-[#e11d48] px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
                  >
                    Связаться с нами
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Document Modal */}
      {selectedDoc && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedDoc(null)}
        >
          <div className="bg-[#1a0b2e] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-white/10 shadow-2xl">
            <div className="sticky top-0 bg-[#1a0b2e] p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-white">
                  {selectedDoc.icon}
                </div>
                <h3 className="text-xl font-bold">{selectedDoc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <FaCheck className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">{selectedDoc.title}</h3>
                <ul className="space-y-3 list-disc pl-5">
                  {selectedDoc.content.map((item, i) => (
                    <li key={i} className="text-gray-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gradient-to-t from-[#1a0b2e] to-transparent p-4 flex justify-end border-t border-white/5">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2.5 bg-gradient-to-r from-[#a855f7] to-[#ff69b4] hover:opacity-90 rounded-lg font-medium transition-all"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default MainComponent;
'use client';
import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaGamepad, 
  FaCalendarAlt, 
  FaCrown, 
  FaCoins, 
  FaEdit, 
  FaSignOutAlt, 
  FaTrophy, 
  FaCog, 
  FaChevronRight,
  FaDiscord,
  FaTwitter,
  FaYoutube,
  FaUsers  
} from 'react-icons/fa';
import Link from 'next/link';

// StatCard component for displaying statistics in a consistent way
const StatCard = ({ title, value, icon }) => (
  <div className="bg-[#1a1a1a] p-4 rounded-lg">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
      {icon && <div className="text-red-500 text-2xl">{icon}</div>}
    </div>
  </div>
);

export default function ProfilePage() {
  const { user, logout } = useUser();
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  


  // Mock user data - replace with actual data from your backend
  const mockUser = {
    id: 'user_12345',
    username: 'DragonSlayer42',
    email: 'dragonslayer42@example.com',
    avatar: null,
    isPremium: true,
    isAdmin: false,
    lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    joinDate: new Date(2023, 0, 15), // January 15, 2023
    status: 'online',
    bio: 'Professional minecrafter and builder. Love creating amazing structures!',
    socialLinks: {
      twitter: 'dragon_slayer42',
      youtube: 'dragon_slayer42',
      discord: 'DragonSlayer42#1234'
    }
  };

  // Mock stats data - replace with actual stats from your backend
  const userStats = {
    rank: 'Dragon Slayer',
    level: 42,
    xp: 12500,
    xpToNextLevel: 1500,
    balance: 1250,
    playTime: 156, // in hours
    lastPlayed: '2 часа назад',
    achievements: {
      unlocked: 18,
      total: 50,
      recent: [
        { id: 'builder', name: 'Мастер строительства', date: '2 дня назад' },
        { id: 'explorer', name: 'Исследователь', date: '5 дней назад' }
      ]
    },
    friends: {
      total: 24,
      online: 8,
      pending: 2
    },
    stats: {
      blocksPlaced: 125000,
      mobsKilled: 8421,
      deaths: 156,
      distanceWalked: 125.7, // km
      itemsCrafted: 5241,
      diamondsMined: 421,
      bedsEntered: 156,
      timePlayed: 156, // hours
      lastSeen: '2 часа назад'
    },
    serverStats: {
      firstJoined: '15 января 2023',
      lastSeen: '2 часа назад',
      timesJoined: 156,
      timePlayed: '6 дней 12 часов',
      currentStreak: 7 // days
    },
    inventory: {
      coins: 1250,
      gems: 42,
      keys: 3,
      crates: 5
    },
    clan: {
      name: 'Dragon Slayers',
      tag: '[DS]',
      rank: 'Офицер',
      joined: '3 месяца назад'
    },
    recentActivity: [
      { type: 'achievement', text: 'Получено достижение: Мастер строительства', time: '2 часа назад' },
      { type: 'friend', text: 'DiamondMiner принял ваш запрос в друзья', time: '5 часов назад' },
      { type: 'purchase', text: 'Куплен набор "Строительные блоки" за 250 монет', time: '1 день назад' },
      { type: 'level', text: 'Достигнут 42 уровень!', time: '2 дня назад' }
    ]
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const { language } = useLanguage();

  // Format join date
  const formatDate = (date) => {
    return date.toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate level progress percentage
  const levelProgress = Math.round((userStats.xp / (userStats.xp + userStats.xpToNextLevel)) * 100);

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <div className="overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-5"></div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Picture */}
            <div className="relative group mx-auto md:mx-0">
              <div className="relative w-40 h-40 rounded-full p-0.5 bg-gradient-to-br from-red-500 via-amber-500 to-purple-600 shadow-lg">
                <div className="w-full h-full rounded-full bg-gray-900 p-1">
                  {mockUser.avatar ? (
                    <img 
                      src={mockUser.avatar} 
                      alt={mockUser.username} 
                      className="w-full h-full rounded-full object-cover border-2 border-gray-900"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full rounded-full ${mockUser.avatar ? 'hidden' : 'flex'} items-center justify-center bg-gray-800`}>
                    <FaUser className="text-5xl text-gray-400" />
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center ${mockUser.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}>
                {mockUser.status === 'online' && <div className="w-2 h-2 rounded-full bg-white animate-ping absolute"></div>}
              </div>
              
              {/* Edit Button */}
              <button className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center shadow-lg transition-all opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0">
                <FaEdit className="mr-1.5 text-sm" /> 
                <span className="font-sans">Редактировать</span>
              </button>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left mt-6 md:mt-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {mockUser.username}
                    </h1>
                    {mockUser.isPremium && (
                      <div className="inline-flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg transform transition-transform hover:scale-105">
                        <FaCrown className="mr-1.5" />
                        <span>PREMIUM</span>
                      </div>
                    )}
                    {userStats.rank && (
                      <span className="inline-flex items-center bg-red-500/20 text-red-400 text-xs font-medium px-3 py-1 rounded-full border border-red-500/30">
                        <FaCrown className="mr-1.5" /> {userStats.rank}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-red-400" />
                      <span>{t('profile.memberSince')} <span className="text-gray-200">{formatDate(mockUser.joinDate)}</span></span>
                    </div>
                    <div className="hidden md:block w-px h-4 bg-gray-700"></div>
                    <div className="flex items-center">
                      <FaGamepad className="mr-2 text-amber-400" />
                      <span>Уровень <span className="text-white font-medium">{userStats.level}</span></span>
                    </div>
                    <div className="hidden md:block w-px h-4 bg-gray-700"></div>
                    <div className="flex items-center">
                      <FaTrophy className="mr-2 text-yellow-400" />
                      <span>{userStats.achievements.unlocked} <span className="text-gray-400">из {userStats.achievements.total} достижений</span></span>
                    </div>
                  </div>
                  

                </div>
                
                <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end space-y-3">
                  <div className="flex items-center space-x-2 bg-gray-900/60 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-gray-800">
                      <FaCoins className="text-yellow-400" />
                        <span className="font-medium">{userStats.balance.toLocaleString()}</span>
                  </div>
                  
                </div>
              </div>
              
              {/* Level Progress */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg mr-3">
                      <span className="text-black font-bold text-lg">{userStats.level}</span>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center border-2 border-[#0a0a0a]">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">Уровень {userStats.level}</h4>
                      <p className="text-xs text-gray-500">Опыт до {userStats.level + 1} уровня</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-white">
                      {userStats.xp.toLocaleString()}<span className="text-gray-500"> / {(userStats.xp + userStats.xpToNextLevel).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {levelProgress}% выполнено
                    </div>
                  </div>
                </div>
                
                <div className="relative w-full h-3 bg-gray-800/80 rounded-full overflow-hidden border border-gray-700/50">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-amber-500 to-yellow-500 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${levelProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>0 XP</span>
                  <span>{(userStats.xp + userStats.xpToNextLevel).toLocaleString()} XP</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
{/* Sidebar */}
<div className="w-full md:w-64 mb-8 md:mb-0 md:mr-8 z-50">
  <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
    <nav className="space-y-2">
      <button
        onClick={() => setActiveTab('overview')}
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors cursor-pointer ${
          activeTab === 'overview' 
            ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <FaUser className="mr-3" />
        {t('profile.overview')}
      </button>
      
      <button
        onClick={() => setActiveTab('stats')}
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors cursor-pointer ${
          activeTab === 'stats' 
            ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <FaGamepad className="mr-3" />
        {t('profile.stats')}
      </button>
      
      <button
        onClick={() => setActiveTab('settings')}
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors cursor-pointer ${
          activeTab === 'settings' 
            ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <FaCog className="mr-3" />
        {t('profile.settings')}
      </button>
    </nav>

    <div className="mt-8 pt-6 border-t border-gray-800">
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-3 rounded-lg flex items-center text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
      >
        <FaSignOutAlt className="mr-3" />
        {t('auth.signOut')}
      </button>
    </div>
  </div>
</div>

          {/* Main Content */}
          <div className="flex-1 bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Account Information */}
                <div className="bg-[#2a2a2a] p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">{t('profile.accountInfo')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400">{t('auth.username')}</p>
                        <p className="font-medium">{mockUser.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{t('auth.email')}</p>
                        <p className="font-medium">{mockUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{t('profile.lastLogin')}</p>
                        <p className="font-medium">{formatDate(mockUser.lastLogin)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400">Статус</p>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${mockUser.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                          <span>{mockUser.status === 'online' ? 'В сети' : 'Не в сети'}</span>
                        </div>
                      </div>
                      {mockUser.socialLinks && (
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Социальные сети</p>
                          <div className="flex space-x-3">
                            {mockUser.socialLinks.discord && (
                              <a href={`https://discord.com/users/${mockUser.socialLinks.discord}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                <FaDiscord className="text-xl" />
                              </a>
                            )}
                            {mockUser.socialLinks.twitter && (
                              <a href={`https://twitter.com/${mockUser.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                                <FaTwitter className="text-xl" />
                              </a>
                            )}
                            {mockUser.socialLinks.youtube && (
                              <a href={`https://youtube.com/${mockUser.socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500">
                                <FaYoutube className="text-xl" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#2a2a2a] p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Игровая статистика</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Уровень</span>
                        <span className="font-medium">{userStats.level}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Опыт</span>
                        <span className="font-medium">{userStats.xp.toLocaleString()} / {(userStats.xp + userStats.xpToNextLevel).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Время в игре</span>
                        <span className="font-medium">{userStats.playTime} ч</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Последний вход</span>
                        <span className="font-medium">{userStats.lastPlayed}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#2a2a2a] p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Достижения</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Открыто достижений</span>
                        <span className="font-medium">{userStats.achievements.unlocked} / {userStats.achievements.total}</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Последние достижения:</p>
                        <div className="space-y-2">
                          {userStats.achievements.recent.map((achievement, index) => (
                            <div key={index} className="bg-[#1a1a1a] p-3 rounded-lg">
                              <p className="font-medium">{achievement.name}</p>
                              <p className="text-xs text-gray-400">{achievement.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#2a2a2a] p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Последние действия</h3>
                  <div className="space-y-3">
                    {userStats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start pb-3 border-b border-gray-700 last:border-0 last:pb-0">
                        <div className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 bg-red-500"></div>
                        <div>
                          <p className="text-gray-300">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">{t('profile.playerStats')}</h2>
                
                {/* General Stats */}
                <div className="bg-[#2a2a2a] p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Основная статистика</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard title="Блоков установлено" value={userStats.stats.blocksPlaced.toLocaleString()} />
                    <StatCard title="Мобов убито" value={userStats.stats.mobsKilled.toLocaleString()} />
                    <StatCard title="Смертей" value={userStats.stats.deaths.toLocaleString()} />
                    <StatCard title="Пройдено км" value={userStats.stats.distanceWalked.toLocaleString()} />
                    <StatCard title="Создано предметов" value={userStats.stats.itemsCrafted.toLocaleString()} />
                    <StatCard title="Добыто алмазов" value={userStats.stats.diamondsMined.toLocaleString()} />
                  </div>
                </div>

                {/* Server Stats */}
                <div className="bg-[#2a2a2a] p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Статистика сервера</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <StatCard title="Первый вход" value={userStats.serverStats.firstJoined} />
                      <StatCard title="Последний вход" value={userStats.serverStats.lastSeen} />
                      <StatCard title="Всего входов" value={userStats.serverStats.timesJoined.toLocaleString()} />
                    </div>
                    <div className="space-y-2">
                      <StatCard title="Общее время игры" value={userStats.serverStats.timePlayed} />
                      <StatCard title="Текущая серия" value={`${userStats.serverStats.currentStreak} дней`} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('profile.accountSettings')}</h2>
                <div className="bg-[#2a2a2a] p-6 rounded-lg">
                  <p className="text-gray-400">{t('profile.settingsComingSoon')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

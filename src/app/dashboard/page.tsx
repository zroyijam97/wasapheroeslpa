'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';

type Language = 'ms' | 'en';

interface DashboardContent {
  ms: {
    title: string;
    welcome: string;
    features: {
      title: string;
      items: {
        title: string;
        description: string;
        icon: string;
      }[];
    };
    stats: {
      title: string;
      items: {
        label: string;
        value: string;
        icon: string;
      }[];
    };
    logout: string;
  };
  en: {
    title: string;
    welcome: string;
    features: {
      title: string;
      items: {
        title: string;
        description: string;
        icon: string;
      }[];
    };
    stats: {
      title: string;
      items: {
        label: string;
        value: string;
        icon: string;
      }[];
    };
    logout: string;
  };
}

const dashboardContent: DashboardContent = {
  ms: {
    title: 'Dashboard Wasap Heroes',
    welcome: 'Selamat datang ke Dashboard Wasap Heroes!',
    features: {
      title: 'Ciri-ciri Utama',
      items: [
        {
          title: 'ChatBot AI',
          description: 'Uruskan chatbot AI untuk perniagaan anda',
          icon: '🤖'
        },
        {
          title: 'Analisis',
          description: 'Lihat prestasi dan statistik perniagaan',
          icon: '📊'
        },
        {
          title: 'Pengurusan Akaun',
          description: 'Urus semua akaun media sosial anda',
          icon: '👥'
        },
        {
          title: 'Laporan',
          description: 'Jana laporan terperinci untuk analisis',
          icon: '📈'
        },
        {
          title: 'Pembayaran',
          description: 'Urus langganan dan pembayaran',
          icon: '💳'
        }
      ]
    },
    stats: {
      title: 'Statistik Anda',
      items: [
        {
          label: 'Akaun Aktif',
          value: '5',
          icon: '✅'
        },
        {
          label: 'Mesej Hari Ini',
          value: '127',
          icon: '💬'
        },
        {
          label: 'Respons Rate',
          value: '98%',
          icon: '⚡'
        },
        {
          label: 'Pelanggan Puas',
          value: '156',
          icon: '😊'
        }
      ]
    },
    logout: 'Log Keluar'
  },
  en: {
    title: 'Wasap Heroes Dashboard',
    welcome: 'Welcome to Wasap Heroes Dashboard!',
    features: {
      title: 'Main Features',
      items: [
        {
          title: 'AI ChatBot',
          description: 'Manage AI chatbot for your business',
          icon: '🤖'
        },
        {
          title: 'Analytics',
          description: 'View performance and business statistics',
          icon: '📊'
        },
        {
          title: 'Account Management',
          description: 'Manage all your social media accounts',
          icon: '👥'
        },
        {
          title: 'Reports',
          description: 'Generate detailed reports for analysis',
          icon: '📈'
        },
        {
          title: 'Payments',
          description: 'Manage subscriptions and payments',
          icon: '💳'
        }
      ]
    },
    stats: {
      title: 'Your Statistics',
      items: [
        {
          label: 'Active Accounts',
          value: '5',
          icon: '✅'
        },
        {
          label: 'Messages Today',
          value: '127',
          icon: '💬'
        },
        {
          label: 'Response Rate',
          value: '98%',
          icon: '⚡'
        },
        {
          label: 'Happy Customers',
          value: '156',
          icon: '😊'
        }
      ]
    },
    logout: 'Logout'
  }
};

export default function Dashboard() {
  const [language, setLanguage] = useState<Language>('ms');
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const t = dashboardContent[language];

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [user, isLoaded, router]);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'azrulnizamazmi.usm@gmail.com';

  const toggleLanguage = () => {
    setLanguage(language === 'ms' ? 'en' : 'ms');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-white">
                Wasap Heroes
              </div>
              <div className="text-sm text-white/70">
                {user?.primaryEmailAddress?.emailAddress}
              </div>
              {isAdmin && (
                <Link href="/admin" className="text-sm text-yellow-300 hover:text-yellow-200">
                  Admin Dashboard
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                {language === 'ms' ? 'EN' : 'MS'}
              </button>
              <SignOutButton>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  {t.logout}
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-xl text-white/80">{t.welcome}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {t.stats.items.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">{t.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {t.features.items.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => {
                  if (feature.title === 'Payments' || feature.title === 'Pembayaran') {
                    router.push('/payments');
                  }
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">
            {language === 'ms' ? 'Tindakan Pantas' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
              {language === 'ms' ? 'Cipta ChatBot Baharu' : 'Create New ChatBot'}
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">
              {language === 'ms' ? 'Lihat Laporan' : 'View Reports'}
            </button>
            <button 
              onClick={() => router.push('/payments')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {language === 'ms' ? 'Pembayaran' : 'Payments'}
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors">
              {language === 'ms' ? 'Tetapan Akaun' : 'Account Settings'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
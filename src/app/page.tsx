'use client';

import { useState } from 'react';

import StripePayment from '../components/StripePayment';

type Language = 'ms' | 'en';

interface Content {
  ms: {
    nav: {
      features: string;
      pricing: string;
      about: string;
      contact: string;
      login: string;
      signup: string;
    };
    hero: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
      demo: string;
      trial: string;
    };
    features: {
      title: string;
      subtitle: string;
      items: {
        title: string;
        description: string;
        icon: string;
      }[];
    };
    coreFeatures: {
      title: string;
      subtitle: string;
      items: {
        title: string;
        description: string;
      }[];
    };
    testimonials: {
      title: string;
      subtitle: string;
      items: {
        quote: string;
        name: string;
        role: string;
      }[];
    };
    pricing: {
      title: string;
      subtitle: string;
      monthly: string;
      annually: string;
      plans: {
         name: string;
         description: string;
         price: string;
         period: string;
         annualPrice: string;
         annualPeriod: string;
         accounts: string;
         storage: string;
         fileSize: string;
         popular?: boolean;
       }[];
      addOns: {
        title: string;
        items: {
          name: string;
          description: string;
          price: string;
          period: string;
          features?: string[];
          popular?: boolean;
        }[];
      };
    };
    faq: {
      title: string;
      subtitle: string;
    };
    footer: {
      company: string;
      product: string;
      support: string;
      legal: string;
      copyright: string;
    };
  };
  en: {
    nav: {
      features: string;
      pricing: string;
      about: string;
      contact: string;
      login: string;
      signup: string;
    };
    hero: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
      demo: string;
      trial: string;
    };
    features: {
      title: string;
      subtitle: string;
      items: {
        title: string;
        description: string;
        icon: string;
      }[];
    };
    coreFeatures: {
      title: string;
      subtitle: string;
      items: {
        title: string;
        description: string;
      }[];
    };
    testimonials: {
      title: string;
      subtitle: string;
      items: {
        quote: string;
        name: string;
        role: string;
      }[];
    };
    pricing: {
      title: string;
      subtitle: string;
      monthly: string;
      annually: string;
      plans: {
         name: string;
         description: string;
         price: string;
         period: string;
         annualPrice: string;
         annualPeriod: string;
         accounts: string;
         storage: string;
         fileSize: string;
         popular?: boolean;
       }[];
      addOns: {
        title: string;
        items: {
          name: string;
          description: string;
          price: string;
          period: string;
          features?: string[];
          popular?: boolean;
        }[];
      };
    };
    faq: {
      title: string;
      subtitle: string;
    };
    footer: {
      company: string;
      product: string;
      support: string;
      legal: string;
      copyright: string;
    };
  };
}

const content: Content = {
  ms: {
    nav: {
      features: 'Ciri-ciri',
      pricing: 'Harga',
      about: 'Tentang',
      contact: 'Hubungi',
      login: 'Log Masuk',
      signup: 'Daftar'
    },
    hero: {
      title: 'Wasap Heroes - ChatBot AI Paling Murah di Malaysia',
      subtitle: 'Platform pemasaran #1 untuk rangkaian sosial dengan teknologi AI terdepan',
      description: 'Uruskan jenama atau perniagaan viral anda di rangkaian sosial seperti Facebook, Instagram, Twitter, dan banyak lagi dengan ChatBot AI yang paling affordable di Malaysia',
      cta: 'Mula Sekarang',
      demo: 'Lihat Demo',
      trial: 'Manfaatkan tawaran percubaan percuma kami hari ini, tanpa komitmen atau kad kredit diperlukan.'
    },
    features: {
      title: 'Ciri-ciri Terbaik',
      subtitle: 'Alat penjadualan dan penerbitan media sosial semua-dalam-satu',
      items: [
        {
          title: 'Jadualkan Siaran',
          description: 'Pilih tarikh, masa atau bila-bila masa anda mahu menerbitkan di setiap akaun sosial anda. Beberapa klik untuk selesai dan nikmati',
          icon: '📅'
        },
        {
          title: 'Analisis Prestasi',
          description: 'Anda boleh melihat semua siaran anda bagaimana ia berfungsi dan meningkat. Ia akan membantu anda mengawal audiens anda dan mendapat lebih banyak sasaran',
          icon: '📊'
        },
        {
          title: 'Siaran Pukal',
          description: 'Penjadualan siaran pukal menjadikan penerbitan harian mudah, anda akan tahu dengan tepat berapa banyak dan bila siaran akan diterbitkan di media sosial anda',
          icon: '📦'
        },
        {
          title: 'Tiada Muat Turun',
          description: 'Anda boleh menggunakan perkhidmatan kami terus dari web di semua pelayar. Anda tidak perlu memuat turun atau memasang apa-apa untuk menikmati perkhidmatan kami',
          icon: '🌐'
        }
      ]
    },
    coreFeatures: {
      title: 'Ciri-ciri Teras Tambahan',
      subtitle: 'Media Sosial pasti mempunyai kuasa untuk mencapai berjuta-juta orang di seluruh dunia. Kami semua mencari cara untuk mempunyai kesan yang lebih besar di media sosial dan terutamanya dalam masa yang lebih singkat.',
      items: [
        {
          title: 'Watermark',
          description: 'Mudah menambah watermark pada imej anda dengan antara muka yang intuitif'
        },
        {
          title: 'Pengurus Fail',
          description: 'Sepenuhnya disepadukan dengan muat naik dan penyuntingan imej yang tersedia pada masa ini'
        },
        {
          title: 'Pengurus Kumpulan',
          description: 'Menguruskan semua akaun anda dalam kumpulan menjimatkan masa anda'
        }
      ]
    },
    testimonials: {
      title: 'Apa yang Pelanggan Kami Katakan',
      subtitle: 'Pelanggan kami memuji kami untuk hasil yang hebat, perkhidmatan yang peribadi dan pengetahuan pakar. Berikut adalah apa yang beberapa daripada mereka katakan.',
      items: [
        {
          quote: 'ChatBot AI terbaik untuk perniagaan saya',
          name: 'Ahmad Faizal',
          role: 'Pemilik Kedai Online - Kuala Lumpur'
        },
        {
          quote: 'Sangat mudah digunakan dan berkesan',
          name: 'Siti Nurhaliza',
          role: 'Pengurus Media Sosial - Johor Bahru'
        },
        {
          quote: 'Harga paling berpatutan di Malaysia',
          name: 'Raj Kumar',
          role: 'Usahawan Digital - Penang'
        }
      ]
    },
    pricing: {
       title: 'Harga',
       subtitle: 'Kami menawarkan kadar dan pelan harga yang kompetitif untuk membantu anda mencari yang sesuai dengan keperluan dan bajet perniagaan anda.',
       monthly: 'Bulanan',
       annually: 'Tahunan',
       plans: [
         {
           name: 'Pakej Budget',
           description: 'Untuk 1 akaun sahaja.',
           price: 'RM39',
           period: '/bulan',
           annualPrice: 'RM390',
           annualPeriod: '/tahun',
           accounts: '1 akaun pada setiap platform',
           storage: '1000MB',
           fileSize: '256MB'
         },
         {
           name: 'Pakej Unlimited',
           description: 'Unlimited akaun dan fungsi',
           price: 'RM59',
           period: '/bulan',
           annualPrice: 'RM590',
           annualPeriod: '/tahun',
           accounts: '1000 akaun pada setiap platform',
           storage: '819200MB',
           fileSize: '256MB',
           popular: true
         }
       ],
      addOns: {
         title: 'Add-Ons Tersedia',
         items: [
           {
             name: 'Auto Heroes Tools',
             description: 'Miliki semua tools Auto Heroes + Auto jadi affiliate untuk Wasap Heroes & Auto Heroes',
             price: 'RM20',
             period: '/bulan',
             features: [
                'Akses penuh ke <a href="https://autoheroes.vercel.app" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">autoheroes.vercel.app</a>',
                'Semua tools automation tersedia',
                'Auto affiliate untuk Wasap Heroes',
                'Auto affiliate untuk Auto Heroes',
                'Komisi automatik',
                'Dashboard analytics'
              ],
             popular: true
           }
         ]
       }
    },
    faq: {
      title: 'Soalan Lazim',
      subtitle: 'Mendapat lebih banyak maklumat tentang platform kami yang akan membantu anda mendapat semua faedah daripada kami. Semua soalan ini ditanya untuk kali pertama'
    },
    footer: {
      company: 'Syarikat',
      product: 'Produk',
      support: 'Sokongan',
      legal: 'Undang-undang',
      copyright: '© 2024 Wasap Heroes. Semua hak terpelihara.'
    }
  },
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      signup: 'Sign Up'
    },
    hero: {
      title: 'Wasap Heroes - Malaysia\'s Most Affordable AI ChatBot',
      subtitle: '#1 marketing platform for social networks with cutting-edge AI technology',
      description: 'Manage your brands or viral business on social networks such as Facebook, Instagram, Twitter, and more with Malaysia\'s most affordable AI ChatBot',
      cta: 'Get Started',
      demo: 'View Demo',
      trial: 'Take advantage of our free trial offer today, with no commitments or credit card required.'
    },
    features: {
      title: 'Best Features',
      subtitle: 'All-in-one social media posting and scheduling tool',
      items: [
        {
          title: 'Schedule Posts',
          description: 'Select your date, time or whenever you want to publish on each your social accounts. A few clicks to complete and enjoy',
          icon: '📅'
        },
        {
          title: 'Analytics Performance',
          description: 'You can see all your posts how it work and increase does. It will help you control your audiences and getting more target',
          icon: '📊'
        },
        {
          title: 'Bulk Post',
          description: 'Bulk post scheduling makes daily posting effortless, you will know exactly how many and when posts will publish on your social media',
          icon: '📦'
        },
        {
          title: 'No Downloads',
          description: 'You can use our service straight from the web on all browsers. You don\'t need to download or install anything to enjoy our service',
          icon: '🌐'
        }
      ]
    },
    coreFeatures: {
      title: 'Extra Core Features',
      subtitle: 'Social Media definitely has the power to reach millions of people all around the globe. We all looking for a way to have a bigger impact on social media and specially in less time.',
      items: [
        {
          title: 'Watermark',
          description: 'Easily add watermark to your images with intuitive interface'
        },
        {
          title: 'File Manager',
          description: 'Fully integrated with image uploading and editing currently available'
        },
        {
          title: 'Group Manager',
          description: 'Managing all of your accounts in groups saves you time'
        }
      ]
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: 'Our clients praise us for our great results, personable service and expert knowledge. Here are what just a few of them had to say.',
      items: [
        {
          quote: 'Best AI ChatBot for my business',
          name: 'Ahmad Faizal',
          role: 'Online Store Owner - Kuala Lumpur'
        },
        {
          quote: 'Very easy to use and effective',
          name: 'Siti Nurhaliza',
          role: 'Social Media Manager - Johor Bahru'
        },
        {
          quote: 'Most affordable price in Malaysia',
          name: 'Raj Kumar',
          role: 'Digital Entrepreneur - Penang'
        }
      ]
    },
    pricing: {
       title: 'Pricing',
       subtitle: 'We offer competitive rates and pricing plans to help you find one that fits the needs and budget of your business.',
       monthly: 'Monthly',
       annually: 'Annually',
       plans: [
         {
           name: 'Budget Package',
           description: 'For 1 account only.',
           price: 'RM39',
           period: '/month',
           annualPrice: 'RM390',
           annualPeriod: '/year',
           accounts: '1 account on each platform',
           storage: '1000MB',
           fileSize: '256MB'
         },
         {
           name: 'Unlimited Package',
           description: 'Unlimited accounts and features',
           price: 'RM59',
           period: '/month',
           annualPrice: 'RM590',
           annualPeriod: '/year',
           accounts: '1000 accounts on each platform',
           storage: '819200MB',
           fileSize: '256MB',
           popular: true
         }
       ],
      addOns: {
         title: 'Available Add-Ons',
         items: [
           {
             name: 'Auto Heroes Tools',
             description: 'Get all Auto Heroes tools + Auto affiliate for Wasap Heroes & Auto Heroes',
             price: 'RM20',
             period: '/month',
             features: [
                'Full access to <a href="https://autoheroes.vercel.app" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">autoheroes.vercel.app</a>',
                'All automation tools available',
                'Auto affiliate for Wasap Heroes',
                'Auto affiliate for Auto Heroes',
                'Automatic commissions',
                'Analytics dashboard'
              ],
             popular: true
           }
         ]
       }
     },
     faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Getting more information about our platform that will help you get all benefits from us. These all questions are asked for the first time'
    },
    footer: {
      company: 'Company',
      product: 'Product',
      support: 'Support',
      legal: 'Legal',
      copyright: '© 2024 Wasap Heroes. All rights reserved.'
    }
  }
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('ms');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [selectedAddOns, setSelectedAddOns] = useState<{[key: string]: boolean}>({});

  const t = content[language];

  // API calls now handled through Next.js API routes

  const toggleAddOn = (planName: string) => {
    setSelectedAddOns(prev => ({
      ...prev,
      [planName]: !prev[planName]
    }));
  };

  const calculateTotalPrice = (plan: { name: string; price: string; annualPrice: string }) => {
    const basePrice = billingCycle === 'monthly' ? 
      parseInt(plan.price.replace('RM', '')) : 
      parseInt(plan.annualPrice.replace('RM', ''));
    
    const addOnPrice = selectedAddOns[plan.name] ? 
      (billingCycle === 'monthly' ? 20 : 240) : 0;
    
    return basePrice + addOnPrice;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ms' ? 'en' : 'ms');
  };



  const features = [
    'AI ChatBot Response', 'Auto Reply Messages', 'Smart Conversation', 'AI Content Generator',
    'Spintax', 'Integrate Scheduling', 'URL Shortener', 'Save & Get Captions',
    'Image & Video Library', 'Multiple Accounts', 'Preview Post', 'OpenAI Integration'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                Wasap Heroes
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                {t.nav.features}
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                {t.nav.pricing}
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
                {t.nav.about}
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                {t.nav.contact}
              </a>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {language === 'ms' ? 'EN' : 'MS'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Colorful gradient overlay for better visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/75 to-cyan-900/80"></div>
        {/* Additional dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Additional animated color overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-pink-500/5 to-transparent animate-pulse"></div>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Robot Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25">
                  <span className="text-4xl animate-pulse">🤖</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">

              <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 backdrop-blur-sm">
                {t.hero.demo}
              </button>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {t.hero.trial}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 text-center group hover:scale-105">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center group-hover:animate-pulse">
                  <span className="text-white text-xs">⚡</span>
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-300">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.items.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bright Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
        {/* Circuit Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0,10 L 10,10 L 10,0 M 10,10 L 20,10 M 10,10 L 10,20" stroke="#00bcd4" strokeWidth="0.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-4 h-4 border-2 border-cyan-400 rotate-45 animate-spin" style={{animationDuration: '8s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full mb-6 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9,2A1,1 0 0,1 10,3V5.5A1.5,1.5 0 0,0 11.5,7H12.5A1.5,1.5 0 0,0 14,5.5V3A1,1 0 0,1 15,2A1,1 0 0,1 16,3V5.5A3.5,3.5 0 0,1 12.5,9H11.5A3.5,3.5 0 0,1 8,5.5V3A1,1 0 0,1 9,2M12,10A6,6 0 0,1 18,16V22H6V16A6,6 0 0,1 12,10Z"/>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {language === 'ms' ? 'Ciri-ciri Cemerlang' : 'Bright Features'}
            </h2>
            <p className="text-xl text-gray-300">
              {language === 'ms' ? 'Tingkatkan Perniagaan Online Anda Dengan Platform Kami' : 'Increase Your Online Business With Our Platform'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-xl shadow-2xl border border-cyan-500/20 group hover:border-cyan-400/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                {language === 'ms' ? 'Rancang dan Terbitkan Secara Visual' : 'Visually Plan and Publish'}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {language === 'ms' 
                  ? 'Uruskan profil media sosial anda seperti seorang profesional dengan alat penjadualan canggih kami. Manfaatkan kuasa ciri platform yang tersendiri dan strategi yang akan mendorong hasil yang nyata. Kini dikuasakan oleh OpenAI untuk pengalaman yang dipertingkatkan!'
                  : 'Manage your social media profiles like a professional with our advanced scheduling tools. Harness the power of distinctive platform features and strategies that will drive tangible outcomes. Now fueled by OpenAI for an enhanced experience!'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-xl shadow-2xl border border-purple-500/20 group hover:border-purple-400/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                  </svg>
                </div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                {language === 'ms' ? 'Ukur dan Laporkan' : 'Measure and Report'}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {language === 'ms'
                  ? 'Buka kunci potensi kandungan anda dengan alat analitik dan pelaporan canggih kami. Selami wawasan komprehensif yang didorong data yang mendedahkan kesan sebenar kempen anda.'
                  : 'Unlock the potential of your content with our advanced analytics and reporting tools. Delve into comprehensive data-driven insights that reveal the true impact of your campaigns.'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-xl shadow-2xl border border-blue-500/20 group hover:border-blue-400/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                </div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                {language === 'ms' ? 'Kalendar Kandungan' : 'Content Calendar'}
              </h3>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {language === 'ms'
                  ? 'Visualisasikan dengan mudah semua siaran berjadual anda, membolehkan anda menyemak dan memperhalusi mereka sebelum mereka disiarkan.'
                  : 'Easily visualize all your scheduled posts, allowing you to review and fine-tune them before they go live.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Hexagon Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 60 60" preserveAspectRatio="none">
            <defs>
              <pattern id="hexagon" x="0" y="0" width="30" height="26" patternUnits="userSpaceOnUse">
                <polygon points="15,2 25,8 25,20 15,26 5,20 5,8" fill="none" stroke="#8b5cf6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagon)"/>
          </svg>
        </div>
        
        {/* Animated Tech Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-16 right-16 w-6 h-6 border border-purple-400 transform rotate-45 animate-spin" style={{animationDuration: '12s'}}></div>
          <div className="absolute bottom-20 left-20 w-4 h-4 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-purple-300 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-6 relative">
              <svg className="w-12 h-12 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
              </svg>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t.coreFeatures.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              {t.coreFeatures.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.coreFeatures.items.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-800 to-purple-800 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30 group-hover:border-indigo-400/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/25">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg group-hover:scale-110 transition-transform duration-300"></div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-indigo-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 relative overflow-hidden">
        {/* Digital Rain Effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-green-400 to-transparent animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Floating Tech Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-8 h-8 border border-green-400 rounded-full animate-spin" style={{animationDuration: '15s'}}></div>
          <div className="absolute bottom-20 right-10 w-6 h-6 bg-cyan-400 transform rotate-45 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-cyan-600 rounded-full mb-6 relative">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1L13.5 2.5L16.17 5.17L10.58 10.76C10.22 10.54 9.8 10.4 9.35 10.4C8.62 10.4 7.96 10.69 7.47 11.18C7 11.67 6.7 12.33 6.7 13.06C6.7 13.8 7 14.46 7.47 14.95C7.96 15.44 8.62 15.73 9.35 15.73C10.08 15.73 10.74 15.44 11.23 14.95C11.72 14.46 12 13.8 12 13.06C12 12.61 11.86 12.19 11.64 11.83L17.24 6.24L19.76 8.76L21 9M7.47 21.76C6.68 22.55 5.41 22.55 4.62 21.76C3.83 20.97 3.83 19.7 4.62 18.91L10.59 12.94L11.65 14L7.47 21.76Z"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-gray-300">
              {t.testimonials.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { quote: 'Exactly what I\'m looking for', desc: 'Innovative tool to enhance our content planning and creation processes for both our agency and clients.', name: 'David Nicolas', role: 'Agency owner' },
              { quote: 'High quality design', desc: 'I\'m Very well organized tool with stunning high quality design. Amazing platform! Thank you so much!', name: 'Ara A.', role: 'Product Designer' },
              { quote: 'Managing accounts easily', desc: 'This tool has made sharing our story and building our brand on social media so much easier.', name: 'Nev W.D95.', role: 'SEO leader' },
              { quote: 'Good Services', desc: 'This platform is a wonderful tool as well as the service team is serious, professional and quickly.', name: 'Scarlett D.', role: 'Marketing Manager' },
              { quote: 'Visual calendar excellent', desc: 'Scheduling posts is an absolute breeze, effortlessly construct a post from a draft and schedule within seconds.', name: 'Anete Lusina', role: 'Influencer' },
              { quote: 'Effortless Content Generation', desc: 'For anyone involved in creating and scheduling content on social media, this is a tool should not be missed.', name: 'Tudor Serea', role: 'Social Media Marketer' }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-xl shadow-2xl border border-green-500/20 group hover:border-green-400/40 transition-all duration-300 relative overflow-hidden">
                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="text-green-400 text-4xl mr-2">&quot;</div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                    {testimonial.quote}
                  </h4>
                  <p className="text-gray-300 mb-6 group-hover:text-gray-200 transition-colors duration-300">
                    {testimonial.desc}
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
       <section id="pricing" className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
               {t.pricing.title}
             </h2>
             <p className="text-xl text-gray-600 mb-8">
               {t.pricing.subtitle}
             </p>
             
             {/* Billing Toggle */}
             <div className="flex items-center justify-center mb-12">
               <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                 {t.pricing.monthly}
               </span>
               <button
                 onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
                 className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
               >
                 <span
                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                     billingCycle === 'annually' ? 'translate-x-6' : 'translate-x-1'
                   }`}
                 />
               </button>
               <span className={`ml-3 ${billingCycle === 'annually' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                 {t.pricing.annually}
               </span>
             </div>
           </div>

           {/* Features Comparison Table - New Layout */}
           <div className="mb-12">
             <div className="text-center mb-8">
               <h3 className="text-3xl font-bold text-gray-900 mb-4">
                 {language === 'ms' ? 'Perbandingan Ciri-ciri Terperinci' : 'Detailed Features Comparison'}
               </h3>
               <p className="text-gray-600">
                 {language === 'ms' ? 'Lihat semua ciri yang tersedia untuk setiap pakej' : 'See all available features for each package'}
               </p>
             </div>

             {/* Pricing Cards Header */}
             <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
               {/* Budget Card */}
               <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 relative">
                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                   <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                     ⭐ POPULAR
                   </span>
                 </div>
                 <div className="text-center pt-4">
                   <h4 className="text-2xl font-bold text-blue-600 mb-2">Pakej Budget</h4>
                   <p className="text-gray-600 text-sm mb-4">{language === 'ms' ? 'Untuk 1 akaun sahaja' : 'For 1 account only'}</p>
                   <div className="mb-4">
                     <span className="text-4xl font-bold text-gray-900">
                       {billingCycle === 'monthly' ? 'RM39' : 'RM390'}
                     </span>
                     <span className="text-gray-600">
                       {billingCycle === 'monthly' ? '/bulan' : '/tahun'}
                     </span>
                   </div>
                   <div className="bg-white rounded-lg p-3 text-sm">
                     <div className="text-gray-600">✅ 1 akaun WhatsApp</div>
                     <div className="text-gray-600">💾 1000MB storan</div>
                     <div className="text-gray-600">📄 256MB saiz fail maksimum</div>
                   </div>
                 </div>
               </div>

               {/* Unlimited Card */}
               <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 relative">
                 <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                   <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                     ⭐ POPULAR
                   </span>
                 </div>
                 <div className="text-center pt-4">
                   <h4 className="text-2xl font-bold text-purple-600 mb-2">Pakej Unlimited</h4>
                   <p className="text-gray-600 text-sm mb-4">{language === 'ms' ? 'Unlimited akaun dan fungsi' : 'Unlimited accounts and features'}</p>
                   <div className="mb-4">
                     <span className="text-4xl font-bold text-gray-900">
                       {billingCycle === 'monthly' ? 'RM59' : 'RM590'}
                     </span>
                     <span className="text-gray-600">
                       {billingCycle === 'monthly' ? '/bulan' : '/tahun'}
                     </span>
                   </div>
                   <div className="bg-white rounded-lg p-3 text-sm">
                     <div className="text-gray-600">✅ 1000 akaun WhatsApp</div>
                     <div className="text-gray-600">💾 819200MB storan</div>
                     <div className="text-gray-600">📄 256MB saiz fail maksimum</div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Features Categories */}
             <div className="space-y-8">
               {/* WhatsApp Tools */}
               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                 <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                   <h4 className="text-white text-xl font-bold flex items-center">
                     <span className="mr-3">📱</span>
                     {language === 'ms' ? 'ALAT WHATSAPP' : 'WHATSAPP TOOLS'}
                   </h4>
                 </div>
                 <div className="p-6">
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {[
                       { icon: '💬', name: language === 'ms' ? 'Mesej pukal' : 'Bulk messaging', budget: true, unlimited: true },
                       { icon: '🤖', name: 'Chatbot', budget: true, unlimited: true },
                       { icon: '↩️', name: 'Autoresponder', budget: true, unlimited: true },
                       { icon: '📧', name: language === 'ms' ? 'Hantar mesej butang' : 'Send button message', budget: true, unlimited: true },
                       { icon: '📋', name: language === 'ms' ? 'Hantar mesej senarai' : 'Send list messages', budget: true, unlimited: true },
                       { icon: '⚠️', name: 'on Fail Decode', budget: true, unlimited: true },
                       { icon: '🔗', name: 'REST API', budget: true, unlimited: true },
                       { icon: '🔗', name: 'Link Generator', budget: true, unlimited: true },
                       { icon: '💬', name: 'Whatsapp LiveChat', budget: true, unlimited: true },
                       { icon: '👤', name: 'Profile', budget: true, unlimited: true },
                       { icon: '📱', name: 'Whatsapp', budget: true, unlimited: true }
                     ].map((feature, index) => (
                       <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                         <div className="flex items-center">
                           <span className="text-lg mr-3">{feature.icon}</span>
                           <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                         </div>
                         <div className="flex space-x-4">
                           <span className={`text-lg ${feature.budget ? 'text-green-500' : 'text-gray-400'}`}>
                             {feature.budget ? '✓' : '✗'}
                           </span>
                           <span className={`text-lg ${feature.unlimited ? 'text-green-500' : 'text-gray-400'}`}>
                             {feature.unlimited ? '✓' : '✗'}
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

               {/* Web Push Notifications */}
               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                 <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
                   <h4 className="text-white text-xl font-bold flex items-center">
                     <span className="mr-3">🔔</span>
                     WEB PUSH NOTIFICATION
                   </h4>
                 </div>
                 <div className="p-6">
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {[
                       { icon: '📝', name: 'Composer', budget: false, unlimited: true },
                       { icon: '🔔', name: 'Welcome Notification', budget: false, unlimited: true },
                       { icon: '💧', name: 'Welcome Drip', budget: false, unlimited: true },
                       { icon: '🧪', name: 'A/B Testing', budget: false, unlimited: true },
                       { icon: '📊', name: 'Campaign management', budget: false, unlimited: true },
                       { icon: '🎯', name: 'Auto segmentation', budget: false, unlimited: true },
                       { icon: '✋', name: 'Manual segmentation', budget: false, unlimited: true },
                       { icon: '📈', name: 'Sent notification analytics', budget: false, unlimited: true },
                       { icon: '👥', name: 'Subscribers analytics', budget: false, unlimited: true },
                       { icon: 'ℹ️', name: 'Subscriber information analytics', budget: false, unlimited: true },
                       { icon: '🌍', name: 'Geo location analytics', budget: false, unlimited: true },
                       { icon: '💻', name: 'Browser/Devices analytics', budget: false, unlimited: true }
                     ].map((feature, index) => (
                       <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                         <div className="flex items-center">
                           <span className="text-lg mr-3">{feature.icon}</span>
                           <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                         </div>
                         <div className="flex space-x-4">
                           <span className={`text-lg ${feature.budget ? 'text-green-500' : 'text-gray-400'}`}>
                             {feature.budget ? '✓' : '✗'}
                           </span>
                           <span className={`text-lg ${feature.unlimited ? 'text-green-500' : 'text-gray-400'}`}>
                             {feature.unlimited ? '✓' : '✗'}
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

               {/* Advanced Features */}
               <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                 <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
                   <h4 className="text-white text-xl font-bold flex items-center">
                     <span className="mr-3">⚡</span>
                     {language === 'ms' ? 'CIRI-CIRI LANJUTAN' : 'ADVANCED FEATURES'}
                   </h4>
                 </div>
                 <div className="p-6">
                   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {[
                       { icon: '🤖', name: 'AI Composer', budget: true, unlimited: true },
                       { icon: '📦', name: 'Bulk post', budget: true, unlimited: true },
                       { icon: '📝', name: 'Draft posts', budget: true, unlimited: true },
                       { icon: '🏷️', name: 'Watermark', budget: true, unlimited: true },
                       { icon: '🔗', name: 'URL Shortener', budget: true, unlimited: true },
                       { icon: '🔒', name: 'Proxies', budget: true, unlimited: true, special: true },
                       { icon: '👥', name: 'Team manager', budget: true, unlimited: true },
                       { icon: '🤖', name: 'OpenAI Generate Content', budget: false, unlimited: true },
                       { icon: '🖼️', name: 'OpenAI Generate Image', budget: false, unlimited: true },
                       { icon: '🎨', name: 'Image editor', budget: false, unlimited: true },
                       { icon: '☁️', name: 'Cloud import', budget: false, unlimited: true }
                     ].map((feature, index) => (
                       <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                         <div className="flex items-center">
                           <span className="text-lg mr-3">{feature.icon}</span>
                           <span className="text-sm font-medium text-gray-700">{feature.name}</span>
                         </div>
                         <div className="flex space-x-4">
                           <span className={`text-lg ${feature.budget ? (feature.special ? 'text-red-500' : 'text-green-500') : 'text-gray-400'}`}>
                             {feature.budget ? '✓' : '✗'}
                           </span>
                           <span className={`text-lg ${feature.unlimited ? 'text-green-500' : 'text-gray-400'}`}>
                             {feature.unlimited ? '✓' : '✗'}
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>

             {/* Legend */}
             <div className="mt-8 bg-gray-50 rounded-xl p-6">
               <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
                 <div className="flex items-center">
                   <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                     <span className="text-blue-600 font-bold">B</span>
                   </span>
                   <span className="text-gray-700">Pakej Budget</span>
                 </div>
                 <div className="flex items-center">
                   <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                     <span className="text-purple-600 font-bold">U</span>
                   </span>
                   <span className="text-gray-700">Pakej Unlimited</span>
                 </div>
                 <div className="flex items-center">
                   <span className="text-green-500 text-lg mr-2">✓</span>
                   <span className="text-gray-700">{language === 'ms' ? 'Tersedia' : 'Available'}</span>
                 </div>
                 <div className="flex items-center">
                   <span className="text-gray-400 text-lg mr-2">✗</span>
                   <span className="text-gray-700">{language === 'ms' ? 'Tidak tersedia' : 'Not available'}</span>
                 </div>
                 <div className="flex items-center">
                   <span className="text-red-500 text-lg mr-2">✓</span>
                   <span className="text-gray-700">{language === 'ms' ? 'Ciri istimewa' : 'Special feature'}</span>
                 </div>
               </div>
             </div>
           </div>

           {/* Simple Pricing Cards */}
           <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             {t.pricing.plans.map((plan, index) => (
               <div key={index} className={`bg-white rounded-xl shadow-lg border-2 p-8 relative ${
                 plan.popular ? 'border-blue-500' : 'border-gray-200'
               }`}>
                 {plan.popular && (
                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                     <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                       Popular
                     </span>
                   </div>
                 )}
                 <div className="text-center">
                   <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                   <p className="text-gray-600 mb-6">{plan.description}</p>
                   <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        RM{calculateTotalPrice(plan)}
                      </span>
                      <span className="text-gray-600">
                        {billingCycle === 'monthly' ? plan.period : plan.annualPeriod}
                      </span>
                      {selectedAddOns[plan.name] && (
                        <div className="text-sm text-gray-500 mt-1">
                          {language === 'ms' ? 'Termasuk Auto Heroes' : 'Including Auto Heroes'}
                        </div>
                      )}
                    </div>
                   <div className="space-y-3">
                     <StripePayment 
                       amount={calculateTotalPrice(plan)} 
                       currency="myr"
                       isSubscription={billingCycle === 'annually'}
                       onSuccess={(result) => {
                         console.log('Payment successful:', result);
                         alert(language === 'ms' ? 'Pembayaran berjaya!' : 'Payment successful!');
                       }}
                       onError={(error) => {
                         console.error('Payment error:', error);
                         alert(language === 'ms' ? 'Pembayaran gagal. Sila cuba lagi.' : 'Payment failed. Please try again.');
                       }}
                     />
                     <button 
                        onClick={() => toggleAddOn(plan.name)}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors border ${
                          selectedAddOns[plan.name] 
                            ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200'
                        }`}
                      >
                        {selectedAddOns[plan.name] 
                          ? (language === 'ms' ? '✓ Auto Heroes Ditambah' : '✓ Auto Heroes Added')
                          : (language === 'ms' ? '+ Auto Heroes (RM20/bulan)' : '+ Auto Heroes (RM20/month)')
                        }
                      </button>
                   </div>
                 </div>
               </div>
             ))}
           </div>

           {/* Add-Ons Section */}
           <div className="mt-16">
             <div className="text-center mb-12">
               <h3 className="text-3xl font-bold text-gray-900 mb-4">
                 {t.pricing.addOns.title}
               </h3>
               <p className="text-gray-600">
                 {language === 'ms' ? 'Tingkatkan pengalaman anda dengan add-ons premium' : 'Enhance your experience with premium add-ons'}
               </p>
             </div>

             <div className="flex justify-center max-w-6xl mx-auto">
               {t.pricing.addOns.items.map((addon, index) => (
                 <div key={index} className={`bg-white rounded-xl shadow-lg border-2 p-6 relative ${
                   addon.popular ? 'border-yellow-500' : 'border-gray-200'
                 }`}>
                   {addon.popular && (
                     <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                       <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                         ⭐ POPULAR
                       </span>
                     </div>
                   )}
                   <div className="text-center">
                     <h4 className="text-xl font-bold text-gray-900 mb-2">{addon.name}</h4>
                     <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                     <div className="mb-4">
                       <span className="text-2xl font-bold text-gray-900">{addon.price}</span>
                       <span className="text-gray-600">{addon.period}</span>
                     </div>
                     {addon.features && (
                       <div className="mb-6">
                         <ul className="text-left text-sm space-y-2">
                           {addon.features.map((feature, featureIndex) => (
                             <li key={featureIndex} className="flex items-start">
                               <span className="text-green-500 mr-2 mt-0.5">✓</span>
                               <span className="text-gray-600" dangerouslySetInnerHTML={{__html: feature}}></span>
                             </li>
                           ))}
                         </ul>
                       </div>
                     )}
                     <StripePayment 
                       amount={parseInt(addon.price.replace('RM', ''))}
                       currency="myr"
                       isSubscription={false}
                       onSuccess={(result) => {
                         console.log('Add-on payment successful:', result);
                         alert(language === 'ms' ? 'Pembayaran add-on berjaya!' : 'Add-on payment successful!');
                       }}
                       onError={(error) => {
                         console.error('Add-on payment error:', error);
                         alert(language === 'ms' ? 'Pembayaran add-on gagal. Sila cuba lagi.' : 'Add-on payment failed. Please try again.');
                       }}
                     />
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 border border-cyan-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-green-500/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-500/10 to-green-500/10 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border-2 border-yellow-500/20 rotate-45 animate-spin"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            {/* Futuristic Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full animate-pulse opacity-50"></div>
              <svg className="w-10 h-10 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              {t.faq.title}
            </h2>
            <p className="text-xl text-gray-300">
              {t.faq.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-20 relative overflow-hidden">
        {/* Digital Rain Effect */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-green-500/30 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-500/30 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Floating Tech Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-4 h-4 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-20 w-6 h-6 border-2 border-green-400 rotate-45 animate-spin"></div>
          <div className="absolute bottom-20 left-20 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-5 h-5 bg-purple-400 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-white to-green-400 bg-clip-text text-transparent mb-6">
            {language === 'ms' ? 'Sedia untuk bermula?' : 'Ready to get started?'}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {language === 'ms' 
              ? 'Sertai ribuan perniagaan yang telah meningkatkan kehadiran media sosial mereka dengan platform kami.'
              : 'Join thousands of businesses that have enhanced their social media presence with our platform.'}
          </p>
          <button className="bg-gradient-to-r from-cyan-500 to-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-cyan-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            <span className="relative z-10">{t.hero.cta}</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white py-12 relative overflow-hidden">
        {/* Futuristic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="absolute top-10 left-10 w-20 h-20 border border-green-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 border border-cyan-500/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full mr-2 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                </div>
                Wasap Heroes
              </div>
              <p className="text-gray-300">
                {language === 'ms' 
                  ? 'Platform pengurusan media sosial terdepan untuk perniagaan moden.'
                  : 'Leading social media management platform for modern businesses.'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-cyan-400">{t.footer.company}</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {t.nav.about}
                </a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {language === 'ms' ? 'Kerjaya' : 'Careers'}
                </a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {language === 'ms' ? 'Berita' : 'News'}
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-green-400">{t.footer.product}</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {t.nav.features}
                </a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {t.nav.pricing}
                </a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {language === 'ms' ? 'API' : 'API'}
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-yellow-400">{t.footer.support}</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {t.nav.contact}
                </a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {language === 'ms' ? 'Bantuan' : 'Help'}
                </a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {language === 'ms' ? 'Dokumentasi' : 'Documentation'}
                </a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>


    </div>
  );
}

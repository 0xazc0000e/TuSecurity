import { useState } from 'react';
import { Terminal, Shield, BookOpen, ChevronLeft } from 'lucide-react';
import BashSimulator from './sections/BashSimulator';
import AttackSimulator from './sections/AttackSimulator';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'bash' | 'attack'>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'bash':
        return <BashSimulator onBack={() => setCurrentPage('home')} />;
      case 'attack':
        return <AttackSimulator onBack={() => setCurrentPage('home')} />;
      default:
        return (
          <div className="min-h-screen cyber-grid">
            {/* Header */}
            <header className="glass-strong sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src="/TuSecurity logo-08.png" 
                      alt="TuSecurity Club" 
                      className="h-12 w-auto"
                    />
                    <div className="hidden md:block">
                      <h1 className="text-xl font-bold text-white">نادي الأمن السيبراني</h1>
                      <p className="text-xs text-gray-400">TuSecurity Club</p>
                    </div>
                  </div>
                  <nav className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
                      الرئيسية
                    </button>
                    <button className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
                      الدروس
                    </button>
                    <button className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
                      الأخبار
                    </button>
                    <button className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
                      المقالات
                    </button>
                  </nav>
                </div>
              </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#24099320] via-transparent to-transparent" />
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm text-gray-300">منصة تعليمية تفاعلية</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 glow-text">
                    تعلم الأمن السيبراني
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#430D9E] to-[#7112AF]">
                      بطريقة تفاعلية وآمنة
                    </span>
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                    منصة متكاملة لمحاكاة الأدوات والهجمات السيبرانية،
                    تعلم بدون مخاطر على جهازك الشخصي
                  </p>
                </div>
              </div>
            </section>

            {/* Simulators Grid */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-center mb-12">المحاكيات التفاعلية</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {/* Bash Simulator Card */}
                  <div 
                    onClick={() => setCurrentPage('bash')}
                    className="gradient-border p-8 cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#240993] to-[#430D9E] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Terminal className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">محاكي الأدوات</h3>
                      <p className="text-gray-400 mb-6">
                        تعلم أوامر Bash والأدوات الأساسية للأمن السيبراني
                        من خلال بيئة محاكاة تفاعلية
                      </p>
                      <div className="flex items-center gap-2 text-[#430D9E]">
                        <span>ابدأ التعلم</span>
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Attack Simulator Card */}
                  <div 
                    onClick={() => setCurrentPage('attack')}
                    className="gradient-border p-8 cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6210A9] to-[#7112AF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Shield className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">محاكي الهجمات</h3>
                      <p className="text-gray-400 mb-6">
                        جرب سيناريوهات هجومية ودفاعية واقعية
                        وتعلم كيفية التعامل مع التهديدات السيبرانية
                      </p>
                      <div className="flex items-center gap-2 text-[#7112AF]">
                        <span>ابدأ المحاكاة</span>
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-bold text-center mb-12">مميزات المنصة</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: Terminal, title: 'بيئة آمنة', desc: 'تعلم بدون مخاطر على جهازك' },
                    { icon: BookOpen, title: 'محتوى تعليمي', desc: 'دروس نظرية وعملية متكاملة' },
                    { icon: Shield, title: 'مستويات متعددة', desc: 'من المبتدئين للمحترفين' },
                  ].map((feature, i) => (
                    <div key={i} className="glass p-6 rounded-xl text-center">
                      <feature.icon className="w-10 h-10 mx-auto mb-4 text-[#430D9E]" />
                      <h3 className="font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="glass-strong mt-20">
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/TuSecurity logo-01.png" 
                      alt="TuSecurity Club" 
                      className="h-10 w-auto"
                    />
                    <span className="text-gray-400">نادي الأمن السيبراني - جامعة الطائف</span>
                  </div>
                  <p className="text-gray-500 text-sm">© 2025 جميع الحقوق محفوظة</p>
                </div>
              </div>
            </footer>
          </div>
        );
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0f]">
      {renderPage()}
    </div>
  );
}

export default App;

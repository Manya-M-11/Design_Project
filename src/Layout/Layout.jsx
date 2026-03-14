import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
// import LanguageToggle from '../components/ui/LanguageToggle';



import { 
  Home, 
  Bug, 
  TrendingUp, 
  Leaf, 
  Cloud, 
  Tractor,
  Menu,
  X,
  Bell,
  Sprout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageContext from '../components/LanguageContext';

function LayoutContent({ children }) {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, label: t('home') },
    { name: 'PestDetection', icon: Bug, label: t('pestDetection') },
    { name: 'MarketPrices', icon: TrendingUp, label: t('marketPrices') },
    { name: 'SoilAdvisory', icon: Leaf, label: t('soilAdvisory') },
    { name: 'WeatherAlerts', icon: Cloud, label: t('weatherAlerts') },
    { name: 'Advisories', icon: Bell, label: t('advisories') },
    { name: 'MyFarm', icon: Tractor, label: t('myFarm') },
  ];

  const normalizedPath =
    location.pathname === '/' ? createPageUrl('Home') : location.pathname;

  const currentPageName =
    navItems.find((item) => createPageUrl(item.name) === normalizedPath)?.name ||
    'Home';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">KrishiSiri</h1>
                <p className="text-xs text-emerald-100">{t('tagline')}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    currentPageName === item.name
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* <LanguageToggle /> */}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10"
            >
              <nav className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.name)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      currentPageName === item.name
                        ? 'bg-white/20 text-white'
                        : 'text-emerald-100 hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-emerald-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sprout className="w-8 h-8" />
              <div>
                <p className="font-bold text-lg">KrishiSiri</p>
                <p className="text-sm text-emerald-300">{t('tagline')}</p>
              </div>
            </div>
            <p className="text-sm text-emerald-400">
              © 2026 KrishiSiri. Empowering Farmers with AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </LanguageProvider>
  );
}
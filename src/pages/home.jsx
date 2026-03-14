import React from 'react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from 'api/base44';
import { useQuery } from '@tanstack/react-query';
import QuickActionCard from '../components/home/quickActionCard';
import StatsCard from '../components/home/StatsCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { 
  Bug, 
  TrendingUp, 
  Leaf, 
  Cloud, 
  Sprout,
  ArrowRight,
  Bell,
  Wheat,
  Droplets,
  Sun
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Badge from '../components/ui/badge';
import { format } from 'date-fns';
import { createPageUrl } from '../Layout/utils';

export default function Home() {
  const { t, language } = useLanguage();

  const { data: advisories } = useQuery({
    queryKey: ['advisories-home'],
    queryFn: () => base44.entities.Advisory.filter({ priority: 'urgent' }, '-created_date', 3),
    initialData: []
  });

  const { data: marketPrices } = useQuery({
    queryKey: ['market-prices-home'],
    queryFn: () => base44.entities.MarketPrice.list('-created_date', 4),
    initialData: []
  });

  const quickActions = [
    {
      icon: Bug,
      title: t('detectPest'),
      description: language === 'kn' ? 'ಚಿತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ ಕೀಟಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ' : 'Upload image to detect pests instantly',
      page: 'PestDetection',
      color: 'rose'
    },
    {
      icon: TrendingUp,
      title: t('checkPrices'),
      description: language === 'kn' ? 'ಇತ್ತೀಚಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ನೋಡಿ' : 'View latest market prices & trends',
      page: 'MarketPrices',
      color: 'blue'
    },
    {
      icon: Leaf,
      title: t('soilHealth'),
      description: language === 'kn' ? 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ ಪಡೆಯಿರಿ' : 'Get soil health analysis & advice',
      page: 'SoilAdvisory',
      color: 'emerald'
    },
    {
      icon: Cloud,
      title: t('weatherInfo'),
      description: language === 'kn' ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಪಡೆಯಿರಿ' : 'Get weather forecast & alerts',
      page: 'WeatherAlerts',
      color: 'purple'
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      weather: 'bg-blue-100 text-blue-700',
      pest: 'bg-red-100 text-red-700',
      market: 'bg-amber-100 text-amber-700',
      soil: 'bg-emerald-100 text-emerald-700',
      general: 'bg-gray-100 text-gray-700',
      urgent: 'bg-rose-100 text-rose-700'
    };
    return colors[category] || colors.general;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'falling') return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return <span className="w-4 h-4 text-gray-400">—</span>;
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600 text-white p-8 md:p-12"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-transparent" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sprout className="w-8 h-8" />
            </div>
            <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              AI-Powered
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-8">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to={createPageUrl('PestDetection')}>
              <button className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg">
                {t('detectPest')}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to={createPageUrl('MyFarm')}>
              <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/30 transition-colors">
                {t('myFarm')}
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl" />
      </motion.section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard icon={Wheat} value="15+" label={language === 'kn' ? 'ಬೆಳೆಗಳು' : 'Crops Tracked'} color="emerald" />
        <StatsCard icon={Cloud} value="24/7" label={language === 'kn' ? 'ಹವಾಮಾನ' : 'Weather Updates'} color="blue" />
        <StatsCard icon={Bug} value="95%" label={language === 'kn' ? 'ಪತ್ತೆ ನಿಖರತೆ' : 'Detection Accuracy'} color="amber" />
        <StatsCard icon={Droplets} value="SMS" label={language === 'kn' ? 'ಎಚ್ಚರಿಕೆಗಳು' : 'Instant Alerts'} color="purple" />
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('quickActions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={action.page} {...action} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Urgent Advisories */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-500" />
                {t('urgentAdvisories')}
              </CardTitle>
              <Link to={createPageUrl('Advisories')}>
                <span className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                  {language === 'kn' ? 'ಎಲ್ಲಾ ನೋಡಿ' : 'View All'} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {advisories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {language === 'kn' ? 'ತುರ್ತು ಸಲಹೆಗಳಿಲ್ಲ' : 'No urgent advisories'}
              </p>
            ) : (
              advisories.map((advisory) => (
                <div key={advisory.id} className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center shrink-0">
                      <Bell className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {language === 'kn' ? advisory.title_kannada || advisory.title : advisory.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {language === 'kn' ? advisory.content_kannada || advisory.content : advisory.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getCategoryColor(advisory.category)}>
                          {t(advisory.category)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(advisory.created_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Market Prices Preview */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                {t('trendingCrops')}
              </CardTitle>
              <Link to={createPageUrl('MarketPrices')}>
                <span className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                  {language === 'kn' ? 'ಎಲ್ಲಾ ನೋಡಿ' : 'View All'} <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {marketPrices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಲಭ್ಯವಿಲ್ಲ' : 'No market prices available'}
              </p>
            ) : (
              <div className="space-y-3">
                {marketPrices.map((price) => (
                  <div key={price.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Wheat className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {language === 'kn' ? price.crop_name_kannada || price.crop_name : price.crop_name}
                        </p>
                        <p className="text-sm text-gray-500">{price.market_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{price.price_per_quintal?.toLocaleString()}</p>
                      <div className="flex items-center gap-1 justify-end">
                        {getTrendIcon(price.trend)}
                        <span className={`text-xs font-medium ${
                          price.trend === 'rising' ? 'text-green-600' : 
                          price.trend === 'falling' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {t(price.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weather Quick View */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 md:p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sun className="w-10 h-10" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">{language === 'kn' ? 'ಇಂದಿನ ಹವಾಮಾನ' : "Today's Weather"}</p>
              <p className="text-3xl font-bold">28°C</p>
              <p className="text-blue-100">{language === 'kn' ? 'ಭಾಗಶಃ ಮೋಡ' : 'Partly Cloudy'}</p>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center">
              <Droplets className="w-6 h-6 mx-auto mb-1" />
              <p className="text-2xl font-bold">65%</p>
              <p className="text-xs text-blue-100">{t('humidity')}</p>
            </div>
            <div className="text-center">
              <Cloud className="w-6 h-6 mx-auto mb-1" />
              <p className="text-2xl font-bold">12mm</p>
              <p className="text-xs text-blue-100">{t('rainfall')}</p>
            </div>
          </div>
          
          <Link to={createPageUrl('WeatherAlerts')}>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-50 transition-colors">
              {t('forecast')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
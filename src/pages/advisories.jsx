import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from 'api/base44';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle,
  Cloud,
  Bug,
  TrendingUp,
  Leaf,
  Info,
  Filter,
  RefreshCw,
  Loader2,
  ChevronDown,
  Calendar,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import Badge from 'components/ui/badge';
import Button from 'components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import { format } from 'date-fns';

export default function Advisories() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const { data: advisories, isLoading } = useQuery({
    queryKey: ['advisories'],
    queryFn: () => base44.entities.Advisory.list('-created_date', 50),
    initialData: []
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5 farming advisories relevant to Karnataka farmers for current season. Include:
1. Weather-related advisory
2. Pest/disease alert
3. Market update
4. Soil/fertilizer advisory
5. General farming tip

For each advisory provide:
- Title in English
- Title in Kannada
- Content in English (2-3 sentences)
- Content in Kannada
- Category (weather, pest, market, soil, or general)
- Priority (low, medium, high, or urgent)
- Target crops (relevant crops)
- Target districts (Karnataka districts)
- Valid until date (next 7-14 days)`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            advisories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  title_kannada: { type: "string" },
                  content: { type: "string" },
                  content_kannada: { type: "string" },
                  category: { type: "string" },
                  priority: { type: "string" },
                  target_crops: { type: "array", items: { type: "string" } },
                  target_districts: { type: "array", items: { type: "string" } },
                  valid_until: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      if (result.advisories) {
        await base44.entities.Advisory.bulkCreate(result.advisories);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
    }
  });

  const getCategoryIcon = (category) => {
    const icons = {
      weather: Cloud,
      pest: Bug,
      market: TrendingUp,
      soil: Leaf,
      general: Info,
      urgent: AlertTriangle
    };
    return icons[category] || Info;
  };

  const getCategoryColor = (category) => {
    const colors = {
      weather: 'bg-blue-100 text-blue-700 border-blue-200',
      pest: 'bg-red-100 text-red-700 border-red-200',
      market: 'bg-amber-100 text-amber-700 border-amber-200',
      soil: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      general: 'bg-gray-100 text-gray-700 border-gray-200',
      urgent: 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return colors[category] || colors.general;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityBorder = (priority) => {
    const colors = {
      low: 'border-l-green-500',
      medium: 'border-l-blue-500',
      high: 'border-l-orange-500',
      urgent: 'border-l-red-500'
    };
    return colors[priority] || colors.medium;
  };

  const filteredAdvisories = advisories.filter(advisory => {
    const categoryMatch = categoryFilter === 'all' || advisory.category === categoryFilter;
    const priorityMatch = priorityFilter === 'all' || advisory.priority === priorityFilter;
    return categoryMatch && priorityMatch;
  });

  const urgentAdvisories = advisories.filter(a => a.priority === 'urgent' || a.priority === 'high');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t('advisoryTitle')}</h1>
          <p className="text-gray-600 mt-2">
            {language === 'kn' 
              ? 'ಇತ್ತೀಚಿನ ಕೃಷಿ ಸಲಹೆಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು'
              : 'Latest farming advisories and alerts'}
          </p>
        </div>
        <Button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          {generateMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {language === 'kn' ? 'ಸಲಹೆಗಳನ್ನು ರಚಿಸಿ' : 'Generate Advisories'}
        </Button>
      </motion.div>

      {/* Urgent Alerts Banner */}
      {urgentAdvisories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">{t('urgentAdvisories')}</h2>
            <Badge className="bg-white/20 text-white">{urgentAdvisories.length}</Badge>
          </div>
          <div className="space-y-3">
            {urgentAdvisories.slice(0, 2).map((advisory) => (
              <div key={advisory.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <h4 className="font-semibold">
                  {language === 'kn' ? advisory.title_kannada || advisory.title : advisory.title}
                </h4>
                <p className="text-red-100 text-sm mt-1 line-clamp-2">
                  {language === 'kn' ? advisory.content_kannada || advisory.content : advisory.content}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={language === 'kn' ? 'ವರ್ಗ' : 'Category'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'kn' ? 'ಎಲ್ಲಾ ವರ್ಗಗಳು' : 'All Categories'}</SelectItem>
                  <SelectItem value="weather">{t('weather')}</SelectItem>
                  <SelectItem value="pest">{t('pest')}</SelectItem>
                  <SelectItem value="market">{t('market')}</SelectItem>
                  <SelectItem value="soil">{t('soil')}</SelectItem>
                  <SelectItem value="general">{t('general')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Target className="w-5 h-5 text-gray-400" />
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={language === 'kn' ? 'ಆದ್ಯತೆ' : 'Priority'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'kn' ? 'ಎಲ್ಲಾ ಆದ್ಯತೆಗಳು' : 'All Priorities'}</SelectItem>
                  <SelectItem value="urgent">{t('urgent')}</SelectItem>
                  <SelectItem value="high">{t('high')}</SelectItem>
                  <SelectItem value="medium">{t('medium')}</SelectItem>
                  <SelectItem value="low">{t('low')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advisories List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : filteredAdvisories.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {language === 'kn' ? 'ಯಾವುದೇ ಸಲಹೆಗಳಿಲ್ಲ' : 'No advisories found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'kn' 
                ? 'ಹೊಸ ಸಲಹೆಗಳನ್ನು ರಚಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ'
                : 'Click to generate new advisories'}
            </p>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {language === 'kn' ? 'ಸಲಹೆಗಳನ್ನು ರಚಿಸಿ' : 'Generate Advisories'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAdvisories.map((advisory, index) => {
              const CategoryIcon = getCategoryIcon(advisory.category);
              const isExpanded = expandedId === advisory.id;
              
              return (
                <motion.div
                  key={advisory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`border-0 shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4 ${getPriorityBorder(advisory.priority)}`}
                    onClick={() => setExpandedId(isExpanded ? null : advisory.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getCategoryColor(advisory.category).split(' ')[0]}`}>
                          <CategoryIcon className={`w-6 h-6 ${getCategoryColor(advisory.category).split(' ')[1]}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                {language === 'kn' ? advisory.title_kannada || advisory.title : advisory.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className={`${getCategoryColor(advisory.category)} border`}>
                                  {t(advisory.category)}
                                </Badge>
                                <Badge className={getPriorityColor(advisory.priority)}>
                                  {t(advisory.priority)}
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(new Date(advisory.created_date), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                          
                          <p className={`text-gray-600 mt-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {language === 'kn' ? advisory.content_kannada || advisory.content : advisory.content}
                          </p>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-100 space-y-3"
                              >
                                {advisory.target_crops && advisory.target_crops.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-500 mb-2">
                                      {language === 'kn' ? 'ಸಂಬಂಧಿತ ಬೆಳೆಗಳು' : 'Relevant Crops'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {advisory.target_crops.map((crop, i) => (
                                        <Badge key={i} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                          {crop}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {advisory.target_districts && advisory.target_districts.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-500 mb-2">
                                      {language === 'kn' ? 'ಗುರಿ ಜಿಲ್ಲೆಗಳು' : 'Target Districts'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {advisory.target_districts.map((district, i) => (
                                        <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                          {district}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {advisory.valid_until && (
                                  <p className="text-sm text-gray-500">
                                    {t('validUntil')}: {format(new Date(advisory.valid_until), 'MMM d, yyyy')}
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
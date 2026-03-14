import React, { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from 'api/base44';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Tractor, 
  MapPin,
  Phone,
  Bell,
  Save,
  Plus,
  X,
  Wheat,
  Leaf,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import Badge from 'components/ui/badge';
import Button from 'components/ui/button';
import Input from 'components/ui/input';
import Label from 'components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';
import Switch from 'components/ui/switch';

export default function MyFarm() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [newCrop, setNewCrop] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: farms, isLoading } = useQuery({
    queryKey: ['my-farms'],
    queryFn: () => base44.entities.Farm.list('-created_date', 1),
    initialData: []
  });

  const farm = farms[0] || null;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    district: '',
    size_acres: '',
    soil_type: '',
    crops: [],
    phone_number: '',
    sms_alerts_enabled: true,
    preferred_language: 'en'
  });

  React.useEffect(() => {
    if (farm) {
      setFormData({
        name: farm.name || '',
        location: farm.location || '',
        district: farm.district || '',
        size_acres: farm.size_acres || '',
        soil_type: farm.soil_type || '',
        crops: farm.crops || [],
        phone_number: farm.phone_number || '',
        sms_alerts_enabled: farm.sms_alerts_enabled ?? true,
        preferred_language: farm.preferred_language || 'en'
      });
    }
  }, [farm]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (farm) {
        return base44.entities.Farm.update(farm.id, data);
      } else {
        return base44.entities.Farm.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-farms'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  });

  const addCrop = () => {
    if (newCrop.trim() && !formData.crops.includes(newCrop.trim())) {
      setFormData({
        ...formData,
        crops: [...formData.crops, newCrop.trim()]
      });
      setNewCrop('');
    }
  };

  const removeCrop = (crop) => {
    setFormData({
      ...formData,
      crops: formData.crops.filter(c => c !== crop)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      size_acres: parseFloat(formData.size_acres) || 0
    });
  };

  const soilTypes = [
    { value: 'black_soil', label: t('black_soil') },
    { value: 'red_soil', label: t('red_soil') },
    { value: 'alluvial', label: t('alluvial') },
    { value: 'laterite', label: t('laterite') },
    { value: 'sandy', label: t('sandy') },
    { value: 'clay', label: t('clay') }
  ];

  const districts = [
    'Bangalore Urban', 'Bangalore Rural', 'Mysore', 'Mandya', 'Hassan',
    'Tumkur', 'Kolar', 'Chikkaballapur', 'Ramanagara', 'Chamarajanagar',
    'Kodagu', 'Dakshina Kannada', 'Udupi', 'Uttara Kannada', 'Shimoga',
    'Chikkamagaluru', 'Davangere', 'Chitradurga', 'Bellary', 'Raichur',
    'Koppal', 'Gadag', 'Dharwad', 'Haveri', 'Belgaum', 'Bagalkot',
    'Bijapur', 'Gulbarga', 'Bidar', 'Yadgir'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
          <Tractor className="w-4 h-4" />
          {language === 'kn' ? 'ನಿಮ್ಮ ಜಮೀನು ನಿರ್ವಹಣೆ' : 'Farm Management'}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('farmDetails')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'kn' 
            ? 'ನಿಮ್ಮ ಜಮೀನಿನ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ ಮತ್ತು SMS ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ'
            : 'Update your farm details and enable SMS alerts for weather and farming advisories'}
        </p>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5" />
          {language === 'kn' ? 'ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Saved successfully!'}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Basic Info */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Tractor className="w-5 h-5" />
                {language === 'kn' ? 'ಮೂಲ ಮಾಹಿತಿ' : 'Basic Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">{t('farmName')}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'kn' ? 'ನಿಮ್ಮ ಜಮೀನಿನ ಹೆಸರು' : 'Enter farm name'}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">{t('location')}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={language === 'kn' ? 'ಗ್ರಾಮ/ಸ್ಥಳ' : 'Village/Location'}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">{t('district')}</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => setFormData({ ...formData, district: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={language === 'kn' ? 'ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ' : 'Select district'} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">{t('farmSize')}</Label>
                  <Input
                    type="number"
                    value={formData.size_acres}
                    onChange={(e) => setFormData({ ...formData, size_acres: e.target.value })}
                    placeholder="0"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">{t('soilType')}</Label>
                  <Select
                    value={formData.soil_type}
                    onValueChange={(value) => setFormData({ ...formData, soil_type: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿ' : 'Select'} />
                    </SelectTrigger>
                    <SelectContent>
                      {soilTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crops & Alerts */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2">
                <Wheat className="w-5 h-5" />
                {language === 'kn' ? 'ಬೆಳೆಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು' : 'Crops & Alerts'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Current Crops */}
              <div className="space-y-3">
                <Label className="text-gray-700 font-medium">{t('currentCrops')}</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    placeholder={language === 'kn' ? 'ಬೆಳೆ ಹೆಸರು' : 'Crop name'}
                    className="h-12"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCrop())}
                  />
                  <Button
                    type="button"
                    onClick={addCrop}
                    className="bg-amber-500 hover:bg-amber-600 h-12 px-6"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.crops.map((crop) => (
                    <Badge
                      key={crop}
                      className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-sm flex items-center gap-2"
                    >
                      <Leaf className="w-3 h-3" />
                      {crop}
                      <button
                        type="button"
                        onClick={() => removeCrop(crop)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </Badge>
                  ))}
                  {formData.crops.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      {language === 'kn' ? 'ಯಾವುದೇ ಬೆಳೆಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ' : 'No crops added yet'}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">{t('phoneNumber')}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="pl-10 h-12"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {language === 'kn' 
                    ? 'SMS ಎಚ್ಚರಿಕೆಗಳಿಗಾಗಿ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ'
                    : 'Enter your mobile number for SMS alerts'}
                </p>
              </div>

              {/* SMS Alerts Toggle */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t('smsAlerts')}</p>
                      <p className="text-sm text-gray-500">
                        {language === 'kn' 
                          ? 'ಹವಾಮಾನ ಮತ್ತು ಕೃಷಿ ಎಚ್ಚರಿಕೆಗಳು'
                          : 'Weather & farming alerts'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.sms_alerts_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, sms_alerts_enabled: checked })}
                  />
                </div>
              </div>

              {/* Preferred Language */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  {language === 'kn' ? 'SMS ಭಾಷೆ' : 'SMS Language'}
                </Label>
                <Select
                  value={formData.preferred_language}
                  onValueChange={(value) => setFormData({ ...formData, preferred_language: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-center"
        >
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 px-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {language === 'kn' ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {t('save')}
              </>
            )}
          </Button>
        </motion.div>
      </form>

      {/* SMS Info Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'kn' ? 'SMS ಎಚ್ಚರಿಕೆಗಳ ಬಗ್ಗೆ' : 'About SMS Alerts'}
              </h3>
              <p className="text-gray-600">
                {language === 'kn' 
                  ? 'SMS ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿದರೆ, ನೀವು ಹವಾಮಾನ ನವೀಕರಣಗಳು, ಕೀಟ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಬದಲಾವಣೆಗಳ ಬಗ್ಗೆ SMS ಮೂಲಕ ಸೂಚನೆಗಳನ್ನು ಪಡೆಯುತ್ತೀರಿ. ಕಡಿಮೆ ನೆಟ್‌ವರ್ಕ್ ಪ್ರದೇಶಗಳಲ್ಲಿಯೂ ಕೆಲಸ ಮಾಡುತ್ತದೆ.'
                  : 'When enabled, you will receive SMS notifications for weather updates, pest alerts, and market price changes. Works even in low-network areas.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
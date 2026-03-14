import React, { useEffect, useState } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { base44 } from 'api/base44';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  RefreshCw,
  Loader2,
  CloudSun,
  CloudLightning,
  Snowflake,
  MapPin,
  Calendar,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import Badge from 'components/ui/badge';
import Button from 'components/ui/button';
import Input from 'components/ui/input';
import { format } from 'date-fns';

const DEFAULT_COORDS = { name: 'Bangalore, Karnataka', latitude: 12.9716, longitude: 77.5946 };

const WEATHER_CODE_MAP = {
  0: 'Clear',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Cloudy',
  45: 'Fog',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  61: 'Slight Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  71: 'Slight Snow',
  73: 'Moderate Snow',
  75: 'Heavy Snow',
  80: 'Rain Showers',
  81: 'Moderate Rain Showers',
  82: 'Violent Rain Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Hail',
  99: 'Thunderstorm with Heavy Hail'
};

const mapWeatherCode = (code) => WEATHER_CODE_MAP[code] || 'Clear';

const getWeatherIcon = (condition) => {
  const conditionLower = condition?.toLowerCase() || '';
  if (conditionLower.includes('rain') || conditionLower.includes('shower')) return CloudRain;
  if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return CloudLightning;
  if (conditionLower.includes('cloud') && conditionLower.includes('sun')) return CloudSun;
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) return Cloud;
  if (conditionLower.includes('snow')) return Snowflake;
  return Sun;
};

const getAlertColor = (severity) => {
  const colors = {
    low: 'bg-blue-100 text-blue-700 border-blue-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    critical: 'bg-red-100 text-red-700 border-red-200'
  };
  return colors[severity] || colors.medium;
};

const getWeatherAdvice = (condition) => {
  if (condition.toLowerCase().includes('rain')) {
    return {
      en: 'Cover sensitive crops, drain standing water, and delay spraying.',
      kn: 'ಸೂಕ್ಷ್ಮ ಬೆಳೆಗಳನ್ನು ಆವರಿಸಿ, ನಿಂತ ನೀರನ್ನು ಹರಿಸಿ ಮತ್ತು ಸ್ಪ್ರೇಗಣೆಯನ್ನು ಬೇಗದೆ ನಿಲ್ಲಿಸಿ.'
    };
  }
  if (condition.toLowerCase().includes('clear')) {
    return {
      en: 'Use the dry window to irrigate and fertilize your fields.',
      kn: 'ಬಿಸಿಲು ಸಮಯವನ್ನು ಬಳಸಿ ನೀರಾವರಿ ಮತ್ತು ಹಾರವನ್ನು ಹಚ್ಚಿ.'
    };
  }
  if (condition.toLowerCase().includes('storm')) {
    return {
      en: 'Secure structures and delay harvest until the storm passes.',
      kn: 'ರಚನೆಗಳನ್ನು ಬಿಗಿಗೊಳಿಸಿ ಮತ್ತು ಗಾಳಿ ಬಿಡುವವರೆಗೂ ಕಚ್ಚಹಣಿಯನ್ನು ತಡ ಮಾಡಿ.'
    };
  }
  return {
    en: 'Monitor conditions daily and adapt irrigation accordingly.',
    kn: 'ದಿನಸಿ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಗಮನಿಸಿ ಮತ್ತು ನೀರಾವರಿ ಹೊಂದಿಸಿ.'
  };
};

const fetchCoordinates = async (query) => {
  if (!query) return DEFAULT_COORDS;
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`
  );
  if (!res.ok) {
    throw new Error('Location lookup failed');
  }
  const data = await res.json();
  const candidate = data.results?.[0];
  return candidate
    ? { name: candidate.name, latitude: candidate.latitude, longitude: candidate.longitude }
    : DEFAULT_COORDS;
};

const fetchWeather = async ({ latitude, longitude }) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
  );
  if (!res.ok) {
    throw new Error('Weather fetch failed');
  }
  return res.json();
};

const normalizeWeather = (raw) => {
  const condition = mapWeatherCode(raw.current_weather?.weathercode ?? 0);
  const humidity = raw.hourly?.relativehumidity_2m?.[0];
  const rainfall = raw.hourly?.precipitation_probability?.[0] ?? 0;

  const forecastDates = raw.daily?.time || [];
  const tempMax = raw.daily?.temperature_2m_max || [];
  const tempMin = raw.daily?.temperature_2m_min || [];
  const weathercode = raw.daily?.weathercode || [];
  const rainChance = raw.daily?.precipitation_probability_max || [];

  const forecast = forecastDates.map((date, index) => ({
    day: date,
    dayName: format(new Date(date), 'EEE'),
    temp_high: Math.round(tempMax[index] ?? 0),
    temp_low: Math.round(tempMin[index] ?? 0),
    condition: mapWeatherCode(weathercode[index] ?? 0),
    rain_chance: rainChance[index] ?? 0
  }));

  const advice = getWeatherAdvice(condition);

  return {
    current: {
      temperature: Math.round(raw.current_weather.temperature),
      feels_like: Math.round(raw.current_weather.temperature),
      condition,
      humidity,
      wind_speed: raw.current_weather.windspeed,
      rainfall_mm: rainfall
    },
    forecast,
    alerts: [],
    farming_advice: advice.en,
    farming_advice_kannada: advice.kn
  };
};

export default function WeatherAlerts() {
  const { t, language } = useLanguage();
  const [location, setLocation] = useState(DEFAULT_COORDS.name);
  const [activeLocation, setActiveLocation] = useState(DEFAULT_COORDS.name);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: advisories } = useQuery({
    queryKey: ['weather-advisories'],
    queryFn: () => base44.entities.Advisory.filter({ category: 'weather' }, '-created_date', 5),
    initialData: []
  });

  const loadWeather = async () => {
    setIsLoading(true);
    setWeatherError('');
    try {
      const coords = await fetchCoordinates(location);
      const raw = await fetchWeather(coords);
      setWeatherData(normalizeWeather(raw));
      setActiveLocation(coords.name);
    } catch (error) {
      setWeatherError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('weatherTitle')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'kn' 
            ? 'ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಕೃಷಿ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ'
            : 'Get weather forecasts and farming advice for your region'}
        </p>
      </motion.div>

      {/* Location Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={language === 'kn' ? 'ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ' : 'Enter location'}
                className="pl-12 py-6 text-lg rounded-xl"
              />
            </div>
          <Button
            onClick={loadWeather}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 py-6 px-8 text-lg"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                {language === 'kn' ? 'ಹವಾಮಾನ ಪಡೆಯಿರಿ' : 'Get Weather'}
              </>
            )}
          </Button>
          </div>
        </CardContent>
      </Card>

    {weatherError && (
      <Card className="border-0 shadow-lg bg-red-50">
        <CardContent className="text-center text-red-700">
          {weatherError}
        </CardContent>
      </Card>
    )}

      {weatherData ? (
        <>
          {/* Current Weather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                      {React.createElement(getWeatherIcon(weatherData.current?.condition), {
                        className: "w-14 h-14"
                      })}
                    </div>
                    <div>
                      <p className="text-blue-100 mb-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {activeLocation}
                      </p>
                      <p className="text-5xl md:text-6xl font-bold">
                        {weatherData.current?.temperature}°C
                      </p>
                      <p className="text-xl text-blue-100 mt-1">
                        {weatherData.current?.condition}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Thermometer className="w-6 h-6" />
                      </div>
                      <p className="text-2xl font-bold">{weatherData.current?.feels_like}°</p>
                      <p className="text-xs text-blue-100">
                        {language === 'kn' ? 'ಅನುಭವ' : 'Feels Like'}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Droplets className="w-6 h-6" />
                      </div>
                      <p className="text-2xl font-bold">
                        {weatherData.current?.humidity ?? '--'}%
                      </p>
                      <p className="text-xs text-blue-100">{t('humidity')}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Wind className="w-6 h-6" />
                      </div>
                      <p className="text-2xl font-bold">{weatherData.current?.wind_speed}</p>
                      <p className="text-xs text-blue-100">km/h</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <CloudRain className="w-6 h-6" />
                      </div>
                      <p className="text-2xl font-bold">
                        {weatherData.current?.rainfall_mm ?? '--'}
                      </p>
                      <p className="text-xs text-blue-100">mm</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Weather Alerts */}
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                {language === 'kn' ? 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು' : 'Weather Alerts'}
              </h2>
              {weatherData.alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-0 shadow-md ${
                    alert.severity === 'high' || alert.severity === 'critical' 
                      ? 'bg-red-50' 
                      : 'bg-amber-50'
                  }`}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        alert.severity === 'high' || alert.severity === 'critical'
                          ? 'bg-red-100'
                          : 'bg-amber-100'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.severity === 'high' || alert.severity === 'critical'
                            ? 'text-red-600'
                            : 'text-amber-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{alert.type}</span>
                          <Badge className={getAlertColor(alert.severity)}>
                            {t(alert.severity)}
                          </Badge>
                        </div>
                        <p className="text-gray-700">
                          {language === 'kn' ? alert.message_kannada : alert.message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* 7-Day Forecast */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                {t('forecast')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {weatherData.forecast?.map((day, index) => {
                  const WeatherIcon = getWeatherIcon(day.condition);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`text-center p-4 rounded-2xl ${
                        index === 0 
                          ? 'bg-blue-50 border-2 border-blue-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {day.dayName || day.day}
                      </p>
                      <WeatherIcon className="w-10 h-10 mx-auto mb-2 text-blue-500" />
                      <p className="text-lg font-bold text-gray-900">{day.temp_high}°</p>
                      <p className="text-sm text-gray-500">{day.temp_low}°</p>
                      {day.rain_chance > 0 && (
                        <div className="flex items-center justify-center gap-1 mt-2 text-blue-600">
                          <Droplets className="w-3 h-3" />
                          <span className="text-xs">{day.rain_chance}%</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Farming Advice */}
          {weatherData.farming_advice && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <Bell className="w-5 h-5" />
                  {language === 'kn' ? 'ಕೃಷಿ ಸಲಹೆ' : 'Farming Advice'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {language === 'kn' 
                    ? weatherData.farming_advice_kannada 
                    : weatherData.farming_advice}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-20">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cloud className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {language === 'kn' ? 'ಹವಾಮಾನವನ್ನು ಪಡೆಯಲು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ' : 'Enter location to get weather'}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === 'kn' 
                ? 'ಮಾಹಿತಿ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ'
                : 'Weather information will appear here'}
            </p>
            <Button
              onClick={loadWeather}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                language === 'kn' ? 'ಹವಾಮಾನ ಪಡೆಯಿರಿ' : 'Get Weather Now'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Weather Advisories */}
      {advisories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'kn' ? 'ಇತ್ತೀಚಿನ ಹವಾಮಾನ ಸಲಹೆಗಳು' : 'Recent Weather Advisories'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisories.map((advisory) => (
              <Card key={advisory.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <Cloud className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {language === 'kn' ? advisory.title_kannada || advisory.title : advisory.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {format(new Date(advisory.created_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {language === 'kn' ? advisory.content_kannada || advisory.content : advisory.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
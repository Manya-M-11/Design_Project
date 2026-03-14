import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navigation
    home: "Home",
    pestDetection: "Pest Detection",
    marketPrices: "Market Prices",
    soilAdvisory: "Soil Advisory",
    weatherAlerts: "Weather Alerts",
    myFarm: "My Farm",
    advisories: "Advisories",
    
    // Common
    welcome: "Welcome to KrishiSiri",
    tagline: "Your AI-Powered Farming Companion",
    language: "Language",
    submit: "Submit",
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    upload: "Upload",
    analyze: "Analyze",
    search: "Search",
    viewDetails: "View Details",
    
    // Home
    heroTitle: "Smart Farming for Better Harvests",
    heroSubtitle: "Get AI-powered insights on pests, soil, weather, and market trends",
    quickActions: "Quick Actions",
    detectPest: "Detect Pest",
    checkPrices: "Check Prices",
    soilHealth: "Soil Health",
    weatherInfo: "Weather Info",
    
    // Pest Detection
    pestDetectionTitle: "AI Pest Detection",
    uploadPestImage: "Upload Image of Affected Plant/Pest",
    dragDropImage: "Drag and drop or click to upload",
    analyzing: "Analyzing image...",
    pestIdentified: "Pest Identified",
    severity: "Severity",
    treatment: "Recommended Treatment",
    organicOption: "Organic Alternative",
    preventionTips: "Prevention Tips",
    
    // Market
    marketTitle: "Market Price Trends",
    currentPrice: "Current Price",
    pricePerQuintal: "per quintal",
    trend: "Trend",
    demand: "Demand",
    rising: "Rising",
    falling: "Falling",
    stable: "Stable",
    trendingCrops: "Trending Crops",
    
    // Soil
    soilTitle: "Soil Analysis & Advisory",
    phLevel: "pH Level",
    nitrogen: "Nitrogen",
    phosphorus: "Phosphorus",
    potassium: "Potassium",
    organicMatter: "Organic Matter",
    moisture: "Moisture",
    recommendations: "Recommendations",
    suitableCrops: "Suitable Crops",
    
    // Weather
    weatherTitle: "Weather Forecast & Alerts",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    windSpeed: "Wind Speed",
    forecast: "7-Day Forecast",
    
    // Farm
    farmDetails: "Farm Details",
    farmName: "Farm Name",
    location: "Location",
    district: "District",
    farmSize: "Farm Size (Acres)",
    soilType: "Soil Type",
    currentCrops: "Current Crops",
    phoneNumber: "Phone Number",
    smsAlerts: "SMS Alerts",
    enableSMS: "Enable SMS Alerts",
    
    // Advisory
    advisoryTitle: "Farming Advisories",
    urgentAdvisories: "Urgent Advisories",
    recentUpdates: "Recent Updates",
    category: "Category",
    validUntil: "Valid Until",
    
    // Soil Types
    black_soil: "Black Soil",
    red_soil: "Red Soil",
    alluvial: "Alluvial Soil",
    laterite: "Laterite Soil",
    sandy: "Sandy Soil",
    clay: "Clay Soil",
    
    // Severity
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    very_high: "Very High",
    urgent: "Urgent",
    
    // Categories
    weather: "Weather",
    pest: "Pest",
    market: "Market",
    soil: "Soil",
    general: "General"
  },
  kn: {
    // Navigation
    home: "ಮುಖಪುಟ",
    pestDetection: "ಕೀಟ ಪತ್ತೆ",
    marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    soilAdvisory: "ಮಣ್ಣಿನ ಸಲಹೆ",
    weatherAlerts: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
    myFarm: "ನನ್ನ ಜಮೀನು",
    advisories: "ಸಲಹೆಗಳು",
    
    // Common
    welcome: "ಕೃಷಿಸಿರಿಗೆ ಸ್ವಾಗತ",
    tagline: "ನಿಮ್ಮ AI-ಚಾಲಿತ ಕೃಷಿ ಸಂಗಾತಿ",
    language: "ಭಾಷೆ",
    submit: "ಸಲ್ಲಿಸಿ",
    save: "ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    upload: "ಅಪ್ಲೋಡ್",
    analyze: "ವಿಶ್ಲೇಷಿಸಿ",
    search: "ಹುಡುಕಿ",
    viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ",
    
    // Home
    heroTitle: "ಉತ್ತಮ ಫಸಲಿಗಾಗಿ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ",
    heroSubtitle: "ಕೀಟಗಳು, ಮಣ್ಣು, ಹವಾಮಾನ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳ ಬಗ್ಗೆ AI-ಚಾಲಿತ ಒಳನೋಟಗಳನ್ನು ಪಡೆಯಿರಿ",
    quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    detectPest: "ಕೀಟ ಪತ್ತೆ",
    checkPrices: "ಬೆಲೆಗಳನ್ನು ನೋಡಿ",
    soilHealth: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
    weatherInfo: "ಹವಾಮಾನ ಮಾಹಿತಿ",
    
    // Pest Detection
    pestDetectionTitle: "AI ಕೀಟ ಪತ್ತೆ",
    uploadPestImage: "ಪೀಡಿತ ಸಸ್ಯ/ಕೀಟದ ಚಿತ್ರವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    dragDropImage: "ಡ್ರ್ಯಾಗ್ ಮತ್ತು ಡ್ರಾಪ್ ಮಾಡಿ ಅಥವಾ ಅಪ್ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    analyzing: "ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    pestIdentified: "ಕೀಟ ಗುರುತಿಸಲಾಗಿದೆ",
    severity: "ತೀವ್ರತೆ",
    treatment: "ಶಿಫಾರಸು ಮಾಡಿದ ಚಿಕಿತ್ಸೆ",
    organicOption: "ಸಾವಯವ ಪರ್ಯಾಯ",
    preventionTips: "ತಡೆಗಟ್ಟುವ ಸಲಹೆಗಳು",
    
    // Market
    marketTitle: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಪ್ರವೃತ್ತಿಗಳು",
    currentPrice: "ಪ್ರಸ್ತುತ ಬೆಲೆ",
    pricePerQuintal: "ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್",
    trend: "ಪ್ರವೃತ್ತಿ",
    demand: "ಬೇಡಿಕೆ",
    rising: "ಏರುತ್ತಿದೆ",
    falling: "ಇಳಿಯುತ್ತಿದೆ",
    stable: "ಸ್ಥಿರ",
    trendingCrops: "ಟ್ರೆಂಡಿಂಗ್ ಬೆಳೆಗಳು",
    
    // Soil
    soilTitle: "ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸಲಹೆ",
    phLevel: "pH ಮಟ್ಟ",
    nitrogen: "ಸಾರಜನಕ",
    phosphorus: "ರಂಜಕ",
    potassium: "ಪೊಟ್ಯಾಸಿಯಂ",
    organicMatter: "ಸಾವಯವ ಪದಾರ್ಥ",
    moisture: "ತೇವಾಂಶ",
    recommendations: "ಶಿಫಾರಸುಗಳು",
    suitableCrops: "ಸೂಕ್ತ ಬೆಳೆಗಳು",
    
    // Weather
    weatherTitle: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು",
    temperature: "ತಾಪಮಾನ",
    humidity: "ಆರ್ದ್ರತೆ",
    rainfall: "ಮಳೆ",
    windSpeed: "ಗಾಳಿ ವೇಗ",
    forecast: "7-ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
    
    // Farm
    farmDetails: "ಜಮೀನು ವಿವರಗಳು",
    farmName: "ಜಮೀನು ಹೆಸರು",
    location: "ಸ್ಥಳ",
    district: "ಜಿಲ್ಲೆ",
    farmSize: "ಜಮೀನು ಗಾತ್ರ (ಎಕರೆ)",
    soilType: "ಮಣ್ಣಿನ ಪ್ರಕಾರ",
    currentCrops: "ಪ್ರಸ್ತುತ ಬೆಳೆಗಳು",
    phoneNumber: "ಫೋನ್ ಸಂಖ್ಯೆ",
    smsAlerts: "SMS ಎಚ್ಚರಿಕೆಗಳು",
    enableSMS: "SMS ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
    
    // Advisory
    advisoryTitle: "ಕೃಷಿ ಸಲಹೆಗಳು",
    urgentAdvisories: "ತುರ್ತು ಸಲಹೆಗಳು",
    recentUpdates: "ಇತ್ತೀಚಿನ ನವೀಕರಣಗಳು",
    category: "ವರ್ಗ",
    validUntil: "ಮಾನ್ಯತೆ ಅಂತಿಮ ದಿನಾಂಕ",
    
    // Soil Types
    black_soil: "ಕಪ್ಪು ಮಣ್ಣು",
    red_soil: "ಕೆಂಪು ಮಣ್ಣು",
    alluvial: "ಮೆಕ್ಕಲು ಮಣ್ಣು",
    laterite: "ಜಂಬಿಟ್ಟು ಮಣ್ಣು",
    sandy: "ಮರಳು ಮಣ್ಣು",
    clay: "ಜೇಡಿ ಮಣ್ಣು",
    
    // Severity
    low: "ಕಡಿಮೆ",
    medium: "ಮಧ್ಯಮ",
    high: "ಹೆಚ್ಚು",
    critical: "ತೀವ್ರ",
    very_high: "ಬಹಳ ಹೆಚ್ಚು",
    urgent: "ತುರ್ತು",
    
    // Categories
    weather: "ಹವಾಮಾನ",
    pest: "ಕೀಟ",
    market: "ಮಾರುಕಟ್ಟೆ",
    soil: "ಮಣ್ಣು",
    general: "ಸಾಮಾನ್ಯ"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('krishisiri_language');
    if (saved) setLanguage(saved);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('krishisiri_language', lang);
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
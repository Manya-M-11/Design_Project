import React, { useMemo, useState, useCallback } from 'react';
import { useLanguage } from '../components/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Camera,
  CheckCircle,
  Loader2,
  Sparkles,
  X,
  ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Badge from '../components/ui/badge';
import Button from '../components/ui/button';
import { format } from 'date-fns';

const PLANT_ID_API_URL = 'https://plant.id/api/v3/identification?disease_model=full&symptoms=true&similar_images=true';
const PLANT_ID_KEY = process.env.REACT_APP_PLANT_ID_KEY;

const fallbackReports = [
  {
    id: 'demo-1',
    pest_name: 'Stem Borer',
    pest_name_kannada: 'ಸ್ಟೆಮ್ ಬೋರರ್',
    severity: 'high',
    affected_crop: 'Maize',
    treatment_recommendation: 'Spray Azadirachtin-based bio-pesticide at dusk.',
    treatment_recommendation_kannada: 'ನದಿನ ಹೊತ್ತಿನಲ್ಲಿ ಅಜಿನಡ್ರಾಕ್ಟಿನ್ ಆಧಾರಿತ ಜೀವ ನಾಶಕ ಹಚ್ಚಿ.',
    organic_alternative: 'Use pheromone traps and remove affected stems.',
    prevention_tips: [
      'Inspect tassels weekly.',
      'Destroy lodged plants immediately.',
      'Rotate with legumes next season.',
    ],
    created_date: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'demo-2',
    pest_name: 'Powdery Mildew',
    pest_name_kannada: 'ಪುಡ್ರಿಯ ಮೇಲ್ವಾತ',
    severity: 'medium',
    affected_crop: 'Grapes',
    treatment_recommendation: 'Apply wettable sulfur every 10 days until symptoms fade.',
    treatment_recommendation_kannada: 'ಲಕ್ಷಣಗಳು ಕಡಿಮೆಯಾಗುವವರೆಗೆ 10 ದಿನಾಂತರ ನುಗ್ಗುವ ಧೂಳನ್ನು ಹಚ್ಚಿ.',
    organic_alternative: 'Increase ventilation and remove infected leaves.',
    prevention_tips: [
      'Space plants to improve air flow.',
      'Avoid overhead watering.',
      'Use drip irrigation.',
    ],
    created_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60'
  }
];

const severityColorMap = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200'
};

const formatProbability = (prob) => `${(prob * 100).toFixed(1)}%`;

const probabilityToSeverity = (prob) => {
  if (prob >= 0.6) return 'critical';
  if (prob >= 0.45) return 'high';
  if (prob >= 0.3) return 'medium';
  return 'low';
};

const kannadaTranslations = {
  'Stem Borer': 'ಸ್ಟೆಮ್ ಬೋರರ್',
  'Powdery Mildew': 'ಪುಡ್ರಿಯ ಮೇಲ್ವಾತ'
};

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function parsePlantIdResponseBody(response) {
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    if (!response.ok) {
      throw new Error(text || `${response.status} ${response.statusText}`);
    }
    throw new Error('Received unexpected response from Plant.id');
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || text || `${response.status} ${response.statusText}`);
  }

  return data;
}

function buildFallbackAnalysis(language) {
  const sample = fallbackReports[0];
  const fallbackSuggestions = fallbackReports.map((report) => ({
    id: report.id,
    name: report.pest_name,
    probability: report.severity === 'high' ? 0.78 : 0.55,
    similar_images: [],
    details: {
      language: 'en',
      entity_id: report.id
    }
  }));

  const topSuggestion = fallbackSuggestions[0];

  return {
    topSuggestion,
    suggestions: fallbackSuggestions,
    isPlant: { probability: 0.95, threshold: 0.5, binary: true },
    image_url: sample.image_url,
    processed_at: new Date().toISOString()
  };
}

function parsePlantIdResponse(data) {
  const suggestionsData = data?.result?.classification?.suggestions || [];
  const mappedSuggestions = suggestionsData.map((suggestion) => ({
    id: suggestion.id,
    name: suggestion.name,
    probability: suggestion.probability,
    similar_images: suggestion.similar_images || [],
    details: suggestion.details ?? {},
  }));

  const topSuggestion = mappedSuggestions[0] || {
    id: 'unknown',
    name: 'Unknown plant',
    probability: 0,
    similar_images: [],
    details: {}
  };

  return {
    topSuggestion,
    suggestions: mappedSuggestions.length ? mappedSuggestions : [topSuggestion],
    isPlant: data?.result?.is_plant ?? { probability: 0, threshold: 0.5, binary: false },
    raw: data
  };
}

export default function PestDetection() {
  const { t, language } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentReports, setRecentReports] = useState(fallbackReports);
  const [error, setError] = useState('');

  const severityColor = useMemo(() => (severity) => severityColorMap[severity] || severityColorMap.medium, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError('');
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError(t('uploadPestImage'));
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      let analysis;

      if (!PLANT_ID_KEY) {
        analysis = buildFallbackAnalysis(language);
      } else {
        const base64Image = await toBase64(selectedImage);
        const response = await fetch(PLANT_ID_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': PLANT_ID_KEY
          },
          body: JSON.stringify({
            images: [base64Image],
            similar_images: true,
            // plant_language: language === 'kn' ? 'kn' : 'en',
            // disease_details is no longer supported as modifier; rely on query params
          })
        });

        const data = await parsePlantIdResponseBody(response);
        analysis = parsePlantIdResponse(data, language);
      }

      setAnalysisResult(analysis);
      const top = analysis.topSuggestion;
      const reportEntry = {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
        pest_name: top.name,
        pest_name_kannada: top.name,
        severity: probabilityToSeverity(top.probability),
        affected_crop: `Confidence ${formatProbability(top.probability)}`,
        created_date: new Date().toISOString(),
        image_url: previewUrl || analysis.image_url
      };

      setRecentReports((prev) => [reportEntry, ...prev].slice(0, 6));
    } catch (err) {
      setError(err.message || 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mx-auto">
          <Sparkles className="w-4 h-4" />
          {language === 'kn' ? 'AI-ಚಾಲಿತ ವಿಶ್ಲೇಷಣೆ' : 'AI-Powered Analysis'}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {t('pestDetectionTitle')}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'kn'
            ? 'ನಿಮ್ಮ ಬೆಳೆಯ ಚಿತ್ರವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಕೀಟಗಳು ಅಥವಾ ರೋಗಗಳನ್ನು ತಕ್ಷಣ ಗುರುತಿಸಿ'
            : 'Upload an image of your crop and instantly identify pests or diseases with treatment guidance'}
        </p>
        {!PLANT_ID_KEY && (
          <p className="text-sm text-amber-600">
            {language === 'kn'
              ? 'Plant.id API ಕೀ ಇಲ್ಲದಿದ್ದರೆ, ಸ್ಯಾಂपಲ್ ಫಲಿತಾಂಶಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತದೆ.'
              : 'Without a Plant.id API key the app shows sample results—set REACT_APP_PLANT_ID_KEY for live analysis.'}
          </p>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {t('uploadPestImage')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {!previewUrl ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                    dragActive
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10 text-rose-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-2">{t('dragDropImage')}</p>
                  <p className="text-sm text-gray-500">
                    {language === 'kn' ? 'PNG, JPG ಅಥವಾ JPEG (ಗರಿಷ್ಠ 10MB)' : 'PNG, JPG or JPEG (max 10MB)'}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={clearSelection}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-6 text-lg rounded-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('analyzing')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        {t('analyze')}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            {error && (
              <p className="text-sm text-rose-600 mt-4 text-center">{error}</p>
            )}
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {analysisResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl h-full">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {t('pestIdentified')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t('pestIdentified')}</p>
                      <h3 className="text-2xl font-bold text-gray-900">{analysisResult.topSuggestion.name}</h3>
                      <p className="text-gray-600 mt-1">
                        Accuracy: <strong>{formatProbability(analysisResult.topSuggestion.probability)}</strong>
                      </p>
                      {analysisResult.isPlant && (
                        <p className="text-xs text-gray-500 mt-1">
                          {analysisResult.isPlant.binary
                            ? `Plant confidence ${formatProbability(analysisResult.isPlant.probability)}`
                            : 'Model is uncertain if this is a plant'}
                        </p>
                      )}
                    </div>
                    <Badge className={`${severityColor(probabilityToSeverity(analysisResult.topSuggestion.probability))} text-sm px-3 py-1`}>
                      {t(probabilityToSeverity(analysisResult.topSuggestion.probability))}
                    </Badge>
                  </div>

                  {analysisResult.topSuggestion.similar_images?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Reference images</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {analysisResult.topSuggestion.similar_images.slice(0, 6).map((img) => (
                          <a
                            key={img.id}
                            href={img.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl overflow-hidden border border-gray-100"
                          >
                            <img src={img.url_small || img.url} alt={analysisResult.topSuggestion.name} className="w-full h-24 object-cover" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.suggestions.length > 1 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Other likely identifications</h4>
                      <ul className="space-y-3">
                        {analysisResult.suggestions.slice(1, 5).map((suggestion) => (
                          <li key={suggestion.id} className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3">
                            <div>
                              <p className="font-semibold text-gray-900">{suggestion.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatProbability(suggestion.probability)} similarity
                              </p>
                            </div>
                            <Badge className={`${severityColor(probabilityToSeverity(suggestion.probability))} text-xs px-2 py-1`}>
                              {t(probabilityToSeverity(suggestion.probability))}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-0 shadow-xl h-full flex items-center justify-center bg-gray-50">
                <CardContent className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {language === 'kn' ? 'ಚಿತ್ರವನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಿ' : 'Upload an image to analyze'}
                  </h3>
                  <p className="text-gray-500">
                    {language === 'kn'
                      ? 'ಫಲಿತಾಂಶಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ'
                      : 'Results will appear here'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {recentReports.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'kn' ? 'ಇತ್ತೀಚಿನ ವರದಿಗಳು' : 'Recent Reports'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map((report) => (
              <Card
                key={report.id}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                {report.image_url && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={report.image_url}
                      alt={report.pest_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {language === 'kn' ? report.pest_name_kannada : report.pest_name}
                    </h4>
                    <Badge className={`${severityColorMap[report.severity]} text-sm px-3 py-1`}>
                      {t(report.severity)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{report.affected_crop}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(report.created_date), 'MMM d, yyyy')}
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
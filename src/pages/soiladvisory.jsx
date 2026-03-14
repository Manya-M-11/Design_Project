import React, { useState } from "react";
import { Leaf, Droplets, FlaskConical, CheckCircle2, Loader2, Sprout, thermometerSun } from "lucide-react";

const App = () => {
  const [soilType, setSoilType] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- API CONFIGURATION ---
  const API_KEY = "ef34ab057de961a7d4b3f8980339b8f7"; 

  const soilOptions = ["Black Soil", "Red Soil", "Alluvial Soil", "Laterite Soil", "Sandy Soil"];

  const cropData = {
    black_soil: {
      name: "Black Soil (Regur)",
      crops: ["Cotton", "Soybean", "Wheat", "Linseed", "Gram"],
      advice: "Highly argillaceous with deep cracks. Rich in iron, lime, and calcium. Best for 'White Gold' (Cotton).",
      ph: "7.5 - 8.5",
      moisture: "High Retention",
      color: "bg-stone-800"
    },
    red_soil: {
      name: "Red Soil",
      crops: ["Groundnut", "Millet", "Tobacco", "Potato", "Pulses"],
      advice: "Developed on crystalline igneous rocks. Requires nitrogen and phosphorous supplements for high yield.",
      ph: "6.0 - 7.5",
      moisture: "Low Retention",
      color: "bg-red-700"
    },
    alluvial_soil: {
      name: "Alluvial Soil",
      crops: ["Rice", "Sugarcane", "Maize", "Jute", "Vegetables"],
      advice: "Deposited by surface water. Extremely fertile and responds well to canal irrigation and tube wells.",
      ph: "6.5 - 7.3",
      moisture: "Moderate",
      color: "bg-yellow-600"
    },
    laterite_soil: {
      name: "Laterite Soil",
      crops: ["Cashew", "Coffee", "Tea", "Rubber", "Coconut"],
      advice: "Result of intense leaching. Needs heavy manuring. Excellent for plantation crops in hilly areas.",
      ph: "4.8 - 5.5",
      moisture: "Porous",
      color: "bg-orange-800"
    },
    sandy_soil: {
      name: "Sandy Soil",
      crops: ["Watermelon", "Muskmelon", "Guava", "Peanuts"],
      advice: "Large particles with big air spaces. Fast draining. Requires frequent organic matter and mulching.",
      ph: "7.0 - 8.0",
      moisture: "Very Low",
      color: "bg-yellow-400"
    }
  };

  const getAdvisory = async () => {
    if (!soilType) return;
    setLoading(true);

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const key = soilType.toLowerCase().replace(" ", "_");
    setRecommendations(cropData[key]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-2 text-emerald-600">
            <Sprout size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Crop Advisor</h1>
          <p className="text-slate-500 mt-2 italic underline underline-offset-4 decoration-emerald-500">
            Powered by Agricultural Intelligence
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Action Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FlaskConical className="text-emerald-700" size={24} />
              </div>
              <h2 className="text-xl font-bold">Soil Profile</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">Select Soil Category</label>
                <select
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 focus:border-emerald-500 transition-all outline-none text-lg font-medium"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                >
                  <option value="">-- Choose Category --</option>
                  {soilOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={getAdvisory}
                disabled={!soilType || loading}
                className={`w-full py-5 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-3 text-lg ${
                  !soilType || loading ? "bg-slate-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200"
                }`}
              >
                {loading ? <Loader2 className="animate-spin" /> : "ANALYZE & RECOMMEND"}
              </button>
              
              <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-[0.2em]">
                Verified Session ID: {API_KEY.substring(0, 8)}...
              </p>
            </div>
          </div>

          {/* Intelligence Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Leaf className="text-blue-700" size={24} />
              </div>
              <h2 className="text-xl font-bold">Advisory Output</h2>
            </div>

            {!recommendations ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <Sprout size={32} className="opacity-20" />
                </div>
                <p className="font-medium">Waiting for soil selection...</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className={`w-4 h-12 rounded-full ${recommendations.color}`}></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{recommendations.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Profile</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-black text-emerald-800 uppercase block mb-1">Target pH</span>
                    <span className="text-md font-bold text-emerald-900">{recommendations.ph}</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-black text-blue-800 uppercase block mb-1">Moisture</span>
                    <span className="text-md font-bold text-blue-900">{recommendations.moisture}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2 tracking-tighter">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Optimal Crop Candidates
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.crops.map((crop, idx) => (
                      <span key={idx} className="px-4 py-2 bg-white text-slate-700 rounded-xl text-sm font-bold border border-slate-200 shadow-sm">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <FlaskConical size={40} />
                  </div>
                  <h3 className="text-[10px] font-black text-amber-800 uppercase mb-2 tracking-widest">Expert Advice</h3>
                  <p className="text-sm text-amber-900 leading-relaxed font-medium">
                    {recommendations.advice}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
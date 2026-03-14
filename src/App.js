
import VoiceAssistant from "./pages/VoiceAssistant";
import Layout from "./Layout/Layout";
import Home from "./pages/home";
import Advisories from "./pages/advisories";
import PestDetection from "./pages/pestdetection";
import MarketPrices from "./pages/marketprices";
import MyFarm from "./pages/myfarm";
import SoilAdvisory from "./pages/soiladvisory";
import WeatherAlerts from "./pages/weatheralerts";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pestdetection" element={<PestDetection />} />
        <Route path="/marketprices" element={<MarketPrices />} />
        <Route path="/soiladvisory" element={<SoilAdvisory />} />
        <Route path="/weatheralerts" element={<WeatherAlerts />} />
        <Route path="/advisories" element={<Advisories />} />
        <Route path="/myfarm" element={<MyFarm />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="/voice" element={<VoiceAssistant />} />
      </Routes>
    </Layout>
  );
}

export default App;

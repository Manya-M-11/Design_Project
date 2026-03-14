const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

async function fetchMarketPrices() {
  const response = await fetch(`${API_BASE}/.netlify/functions/market-prices`);
  if (!response.ok) {
    throw new Error(`Market prices fetch failed: ${response.status}`);
  }
  return response.json();
}

const base44 = {
  entities: {
    MarketPrice: {
      list: fetchMarketPrices
    }
  }
};

export default base44;

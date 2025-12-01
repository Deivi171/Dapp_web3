/**
 * Servicio para obtener datos de CoinGecko API
 * @module services/coingecko
 */

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

/**
 * Obtiene el precio actual de Ethereum en USD
 * @returns {Promise<number>} Precio de ETH en USD
 */
export const getEthPrice = async () => {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) {
      throw new Error('Error al obtener precio de ETH');
    }
    
    const data = await response.json();
    
    return {
      usd: data.ethereum.usd,
      change24h: data.ethereum.usd_24h_change,
    };
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    // Retornar valores por defecto en caso de error
    return {
      usd: 0,
      change24h: 0,
    };
  }
};

/**
 * Obtiene datos de mercado de Ethereum
 * @returns {Promise<Object>} Datos de mercado
 */
export const getEthMarketData = async () => {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      throw new Error('Error al obtener datos de mercado');
    }
    
    const data = await response.json();
    
    return {
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd,
      marketCap: data.market_data.market_cap.usd,
    };
  } catch (error) {
    console.error('Error fetching ETH market data:', error);
    return null;
  }
};

// /utils/fetchWithProxy.js
import axios from 'axios';

const fetchWithProxy = async (url, proxies) => {
  let proxy;
  let success = false;
  let response = null;

  // Intentamos con varios proxies hasta que el request sea exitoso
  while (!success && proxies.length > 0) {
    proxy = proxies[Math.floor(Math.random() * proxies.length)];
    
    try {
      response = await axios.get(url, {
        proxy: {
          host: proxy.split(':')[0],
          port: proxy.split(':')[1]
        }
      });
      success = response.status === 200;
    } catch (error) {
      console.error(`Error with proxy ${proxy}:`, error);
      // Si hay error, lo descartamos y seguimos con otro proxy
    }
  }

  return success ? response.data : null;
};

export default fetchWithProxy;

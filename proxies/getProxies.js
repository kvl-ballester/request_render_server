// /proxies/getProxies.js
import axios from 'axios';
import * as cheerio from 'cheerio';

async function getProxies() {
    try {
      const { data } = await axios.get("https://free-proxy-list.net/");
      const $ = cheerio.load(data);
  
      const proxies = [];
  
      $(".table-responsive.fpl-list tbody tr").each((i, row) => {
        const cols = $(row).find("td");
        const ip = $(cols[0]).text();
        const port = $(cols[1]).text();
        const isHttps = $(cols[6]).text() === "yes";
  
        if (isHttps) {
          proxies.push(`${ip}:${port}`);
        }
      });
  
      return proxies;
    } catch (error) {
      console.error("Error getting proxies:", error.message);
      return [];
    }
  }

export default getProxies;

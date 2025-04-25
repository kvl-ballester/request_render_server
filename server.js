// server.js
import express from 'express';
import getProxies from './proxies/getProxies.js';
import fetchWithProxy from './utils/fetchWithProxy.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const app = express();
const port = process.env.PORT || 3000;

let proxies = [];

const fetchProxiesAndStartJob = async () => {
  proxies = await getProxies();
  if (proxies.length === 0) {
    console.log('No proxies available.');
    return;
  }
  
  console.log('Proxies loaded successfully.');
};

// Endpoint para ser llamado desde cron-job.org
app.get('/fetch-data', async (req, res) => {
  if (proxies.length === 0) {
    // Si no tenemos proxies, intentamos obtenerlos
    await fetchProxiesAndStartJob();
  }

  const url = 'https://n8n-on-render-sfmu.onrender.com'; // URL que quieres visitar
  const response = await fetchWithProxy(url, proxies);

  if (response) {
    console.log('Request successful:', response);
    res.send(response);
  } else {
    console.log('Failed to fetch the URL after trying all proxies.');
    res.status(500).send('Error fetching the URL');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

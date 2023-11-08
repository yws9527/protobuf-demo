import axios from 'axios'

const apiVersion = '1.0.0';

const httpService = axios.create({
  timeout: 1 * 60 * 60 * 1000,
  baseURL: '/api',
  headers: {
    'satoken': '',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/octet-stream',
  },
  responseType: 'arraybuffer'
});

export { apiVersion };

export default httpService;
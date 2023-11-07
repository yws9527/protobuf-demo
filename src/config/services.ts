import axios from 'axios'
import { storage } from '@/utils/storage';

const apiVersion = '1.0.0';
const token = storage.get('token');

const httpService = axios.create({
  timeout: 1 * 60 * 60 * 1000,
  baseURL: '/api',
  headers: {
    'satoken': token,
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/octet-stream',
  },
  responseType: 'arraybuffer'
});

export { apiVersion, token };

export default httpService;
import axios from 'axios'

const httpService = axios.create({
  timeout: 1 * 60 * 60 * 1000,
  method: 'post',
  baseURL: '/api',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/octet-stream'
  },
  responseType: 'arraybuffer'
});

export default httpService;
import axios from 'axios';

// Production URL
// const BASE_URI = 'http://124.123.187.169:3000';
// const BASE_URI = 'https://service.buildersbroadcast.com/';

// Staging URL
// const BASE_URI = 'http://65.2.141.38:3000/';
const BASE_URI='https://stg-api.buildersbroadcast.com:3000/';
// const BASE_URI = 'http://10.35.30.248:3000/';




const axiosInstance = axios.create({
  baseURL: BASE_URI
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || null;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default axiosInstance ;

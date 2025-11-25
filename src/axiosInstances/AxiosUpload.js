import axios from 'axios';

// Production URL
// const UPLOAD_URL ='https://service.buildersbroadcast.com:446/';

// Staging URL
const UPLOAD_URL ='https://stg-api.buildersbroadcast.com:3004/';
// const UPLOAD_URL ='http://3.7.229.231:3004/';

// const UPLOAD_URL ='http://10.35.30.248:3004/';



const axiosUpload = axios.create({
    baseURL: UPLOAD_URL
  });
  axiosUpload.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken') || null;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  export default axiosUpload;
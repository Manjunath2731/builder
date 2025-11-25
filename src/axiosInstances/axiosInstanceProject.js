import axios from 'axios';

// Production URL
// const PROJECT_BRODCASTES_URL ='https://service.buildersbroadcast.com:444/';

// Staging URL
const PROJECT_BRODCASTES_URL ='https://stg-api.buildersbroadcast.com:3001/'
// const PROJECT_BRODCASTES_URL ='http://3.7.229.231:3001/'
// const PROJECT_BRODCASTES_URL ='http://10.35.30.248:3001/';



// 

const axiosAPIInstanceProject = axios.create({
    baseURL: PROJECT_BRODCASTES_URL
  });
  axiosAPIInstanceProject.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken') || null;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  export default axiosAPIInstanceProject;
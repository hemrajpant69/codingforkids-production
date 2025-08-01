// axiosSetup.js
import axios from 'axios';

axios.interceptors.request.use((config) => {
  const sessionToken = localStorage.getItem('sessionToken');
  const email = localStorage.getItem('userEmail');

  if (sessionToken && email) {
    config.headers['sessiontoken'] = sessionToken;
    config.headers['email'] = email;
  }

  return config;
});

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default axios;

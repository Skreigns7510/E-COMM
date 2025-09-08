import axios from 'axios';

// Create an instance of axios
const API = axios.create({
  baseURL: 'http://localhost:7000/api', // Your backend API base URL
});

// ✅ Use an interceptor to add the token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Standard format for JWT is "Bearer <token>"
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

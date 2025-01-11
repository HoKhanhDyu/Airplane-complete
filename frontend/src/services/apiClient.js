import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: 'https://127.0.0.1:8000/api/',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});


// Interceptor để thêm Authorization token vào header
apiClient.interceptors.request.use(
    (config) => {
      const token = Cookies.get("access"); // Lấy token từ cookie "access"
  
      if (token && token !== "" && token !== "undefined") {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      // In ra toàn bộ headers
      console.log("Request Headers:", config.headers);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default apiClient;
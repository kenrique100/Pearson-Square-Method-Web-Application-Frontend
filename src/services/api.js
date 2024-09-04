
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Adjust the port if necessary in respect to your backend 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;

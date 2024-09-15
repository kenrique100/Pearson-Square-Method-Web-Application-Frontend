import axios from 'axios';

const API_URL = 'http://localhost:8080/api/feed-formulations';
const API_V1_URL = 'http://localhost:8080/api/v1/feed-formulation';

const api = axios.create({
  baseURL: API_V1_URL, // Adjust this as per your backend structure
  headers: {
    'Content-Type': 'application/json'
  }
});

// Functions for managing feed formulations
export const createFeedFormulation = (data) => {
  return api.post('/', data);  // Uses the axios instance to post
};

export const getFeedFormulations = () => {
  return api.get('/');
};

export const getFeedFormulationById = (id) => {
  return api.get(`/${id}`);
};

export const updateFeedFormulation = (id, data) => {
  return api.put(`/${id}`, data);
};

export const deleteFeedFormulation = (id) => {
  return api.delete(`/${id}`);
};

export const apiUtils = {
  API_URL,
  API_V1_URL
};

export default api;

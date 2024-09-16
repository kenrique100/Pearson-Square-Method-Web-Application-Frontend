import axios from 'axios';

const BASE_URLS = {
  LOCAL: 'http://localhost:8080/api/feed-formulations',
  PRODUCTION: '/api/v1/feed-formulation',
};

const useLocalAPI = true; // Set this to false when not using the local API

const API_BASE_URL = useLocalAPI ? BASE_URLS.LOCAL : BASE_URLS.PRODUCTION;

// Create a new feed formulation
export const createFeedFormulation = async (request) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, request);
    return response.data;
  } catch (error) {
    console.error('Error creating formulation:', error);
    // Handle the error more gracefully
    throw new Error(error.response?.data?.message || 'Failed to create formulation');
  }
};

// Get a feed formulation by ID and date
export const getFeedFormulationByIdAndDate = async (id, date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching formulation by ID and date:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch formulation');
  }
};

// Get all feed formulations
export const getAllFeedFormulations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all formulations:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch formulations');
  }
};

// Update a feed formulation by ID and date
export const updateFeedFormulationByIdAndDate = async (id, date, request) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/${date}`, request);
    return response.data;
  } catch (error) {
    console.error('Error updating formulation:', error);
    throw new Error(error.response?.data?.message || 'Failed to update formulation');
  }
};

// Delete a feed formulation by ID and date
export const deleteFeedFormulationByIdAndDate = async (id, date) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}/${date}`);
  } catch (error) {
    console.error('Error deleting formulation:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete formulation');
  }
};

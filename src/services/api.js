import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Change this to your backend URL

// FeedFormulationController APIs
export const getFormulations = () => axios.get(`${API_URL}/feed-formulation`);

// Get formulation by ID and date
export const getFormulationByIdAndDate = (id, date) => axios.get(`${API_URL}/feed-formulation/${id}/${date}`);

export const createFormulation = (data) => axios.post(`${API_URL}/feed-formulation`, data);
export const updateFeedFormulationByIdAndDate = (id, date, data) => axios.put(`${API_URL}/feed-formulation/${id}/${date}`, data);
export const deleteFeedFormulationByIdAndDate = (id, date) => axios.delete(`${API_URL}/feed-formulation/${id}/${date}`);

// CustomFeedFormulationController APIs
export const getCustomFormulations = () => axios.get(`${API_URL}/feed-formulations`);

// Get custom formulation by ID and date
export const getCustomFormulationByIdAndDate = (id, date) => axios.get(`${API_URL}/feed-formulations/${id}/${date}`);

export const createCustomFormulation = (data) => axios.post(`${API_URL}/feed-formulations`, data);
export const updateCustomFeedFormulationByIdAndDate = (id, date, data) => axios.put(`${API_URL}/feed-formulations/${id}/${date}`, data);
export const deleteCustomFeedFormulationByIdAndDate= (id, date) => axios.delete(`${API_URL}/feed-formulations/${id}/${date}`);
const api = {
    getFormulations,
    getFormulationByIdAndDate,
    createFormulation,
    updateFeedFormulationByIdAndDate,
    deleteFeedFormulationByIdAndDate,
    createCustomFormulation,
    getCustomFormulations,
    getCustomFormulationByIdAndDate,
    updateCustomFeedFormulationByIdAndDate,
    deleteCustomFeedFormulationByIdAndDate,
};

export default api;

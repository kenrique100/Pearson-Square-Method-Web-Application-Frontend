import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';


// Standard FeedFormulation APIs
export const getFormulations = () => axios.get(`${API_URL}/feed-formulation`);
export const getFormulationByIdAndDate = (formulationId, date) => axios.get(`${API_URL}/feed-formulation/${formulationId}/${date}`);
export const createFormulation = (data) => axios.post(`${API_URL}/feed-formulation`, data);
export const updateFeedFormulationByIdAndDate = (formulationId, date, data) => axios.put(`${API_URL}/feed-formulation/${formulationId}/${date}`, data);
export const deleteFeedFormulationByIdAndDate = (formulationId, date) => axios.delete(`${API_URL}/feed-formulation/${formulationId}/${date}`);

// Custom FeedFormulation APIs
export const getCustomFormulations = () => axios.get(`${API_URL}/feed-formulations`);
export const getCustomFormulationByIdAndDate = (formulationId, date) => axios.get(`${API_URL}/feed-formulations/${formulationId}/${date}`);
export const createCustomFormulation = (data) => axios.post(`${API_URL}/feed-formulations`, data);
export const updateCustomFeedFormulationByIdAndDate = (formulationId, date, data) => axios.put(`${API_URL}/feed-formulations/${formulationId}/${date}`, data);
export const deleteCustomFeedFormulationByIdAndDate = (formulationId, date) => axios.delete(`${API_URL}/feed-formulations/${formulationId}/${date}`);

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
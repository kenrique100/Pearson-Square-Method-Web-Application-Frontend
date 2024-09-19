import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api'; // Import the API service
import { motion } from 'framer-motion';

const CustomFeedFormulationView = () => {
  const { formulationId, date } = useParams();  // Destructure to get params directly
  const [formulation, setFormulation] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  // Define fetchFormulation with useCallback to prevent re-creating it on every render
  const fetchFormulation = useCallback(async () => {
    setLoading(true); // Set loading state to true when starting to fetch
    setError(null); // Reset error state
    try {
      const response = await api.getCustomFormulationByIdAndDate(formulationId, date);
      setFormulation(response.data);
    } catch (error) {
      console.error('Error fetching formulation:', error);
      setError('Failed to fetch formulation.'); // Set error message
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  }, [formulationId, date]); // Only depend on formulationId and date

  // Call fetchFormulation inside useEffect
  useEffect(() => {
    fetchFormulation();
  }, [fetchFormulation]); // No need to pass id explicitly

  // Display loading state if formulation data is not yet available
  if (loading) {
    return <p>Loading...</p>; // Consider using a spinner or loading indicator
  }

  if (error) {
    return <p className="alert alert-danger">{error}</p>; // Display error message
  }

  if (!formulation) {
    return <p>Formulation not found</p>; // Handle case where no formulation is found
  }

  // Ensure formulation.ingredients is an array before filtering
  const ingredients = formulation.ingredients || [];

  return (
    <motion.div 
      className="container" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <h2>{formulation.formulationName}</h2>
      <p>Date: {new Date(formulation.dateCreated).toLocaleDateString()}</p>
      
      <h3>Proteins</h3>
      {ingredients
        .filter((ingredient) => ingredient.category === 'Proteins')
        .map((ingredient, index) => (
          <div key={index}>
            <p>{ingredient.name}: {ingredient.quantityKg} Kg</p>
          </div>
        ))}
      
      <h3>Carbohydrates</h3>
      {ingredients
        .filter((ingredient) => ingredient.category === 'Carbohydrates')
        .map((ingredient, index) => (
          <div key={index}>
            <p>{ingredient.name}: {ingredient.quantityKg} Kg</p>
          </div>
        ))}
    </motion.div>
  );
};

export default CustomFeedFormulationView;

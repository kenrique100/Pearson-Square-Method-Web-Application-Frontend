import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const CustomFeedFormulationView = () => {
  const { id } = useParams();
  const [formulation, setFormulation] = useState(null);

  useEffect(() => {
    fetchFormulation();
  }, [id]);

  const fetchFormulation = async () => {
    try {
      const response = await axios.get(`/api/feed-formulations/${id}`);
      setFormulation(response.data);
    } catch (error) {
      console.error('Error fetching formulation:', error);
    }
  };

  if (!formulation) {
    return <p>Loading...</p>;
  }

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h2>{formulation.formulationName}</h2>
      <p>Date: {new Date(formulation.date).toLocaleDateString()}</p>
      <h3>Proteins</h3>
      {formulation.ingredients
        .filter((ingredient) => ingredient.category === 'Proteins')
        .map((ingredient, index) => (
          <div key={index}>
            <p>{ingredient.name}: {ingredient.quantityKg} Kg</p>
          </div>
        ))}
      <h3>Carbohydrates</h3>
      {formulation.ingredients
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

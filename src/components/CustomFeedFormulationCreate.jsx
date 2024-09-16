import React, { useState, useEffect } from 'react';
import { createFeedFormulation } from '../services/feedFormulationsService';
import { motion } from 'framer-motion';
import axios from 'axios';

const CustomFeedFormulationCreate = () => {
  const [formulationName, setFormulationName] = useState('');
  const [ingredients, setIngredients] = useState({ proteins: [], carbohydrates: [] });
  const [selectedType, setSelectedType] = useState('proteins');

  // State to store available ingredients from the backend
  const [availableProteins, setAvailableProteins] = useState([]);
  const [availableCarbohydrates, setAvailableCarbohydrates] = useState([]);

  // Fetch ingredients from the backend on component mount
  useEffect(() => {
    fetchAvailableIngredients();
  }, []);

  const fetchAvailableIngredients = async () => {
    try {
      const response = await axios.get('/api/ingredients');
      const proteins = response.data.filter(i => i.category === 'Proteins');
      const carbohydrates = response.data.filter(i => i.category === 'Carbohydrates');
      setAvailableProteins(proteins);
      setAvailableCarbohydrates(carbohydrates);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const addIngredient = (ingredientType) => {
    setIngredients({
      ...ingredients,
      [ingredientType]: [...ingredients[ingredientType], { name: '', quantity: '' }],
    });
  };

  const handleIngredientChange = (index, value, ingredientType) => {
    const newIngredients = [...ingredients[ingredientType]];
    newIngredients[index] = { ...newIngredients[index], ...value };
    setIngredients({ ...ingredients, [ingredientType]: newIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      formulationName,
      ingredients,
    };

    try {
      await createFeedFormulation(payload);
      alert('Formulation created successfully!');
    } catch (error) {
      console.error('Error creating formulation:', error);
    }
  };

  return (
    <motion.div
      className="form-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Create Feed Formulation</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Formulation Name</label>
          <input
            type="text"
            className="form-control"
            value={formulationName}
            onChange={(e) => setFormulationName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Select Type</label>
          <select
            className="form-control"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="proteins">Proteins</option>
            <option value="carbohydrates">Carbohydrates</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={() => addIngredient(selectedType)}
        >
          Add {selectedType}
        </button>

        {ingredients[selectedType].map((ingredient, index) => (
          <div key={index} className="mb-3">
            <label className="form-label">Ingredient Name</label>
            <select
              className="form-control"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, { name: e.target.value }, selectedType)
              }
            >
              <option value="">Select Ingredient</option>
              {(selectedType === 'proteins' ? availableProteins : availableCarbohydrates).map((ing) => (
                <option key={ing.name} value={ing.name}>
                  {ing.name}
                </option>
              ))}
            </select>
            <label className="form-label">Quantity (Kg)</label>
            <input
              type="number"
              className="form-control"
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(index, { quantity: e.target.value }, selectedType)
              }
            />
          </div>
        ))}

        <button type="submit" className="btn btn-primary">
          Create Formulation
        </button>
      </form>
    </motion.div>
  );
};

export default CustomFeedFormulationCreate;

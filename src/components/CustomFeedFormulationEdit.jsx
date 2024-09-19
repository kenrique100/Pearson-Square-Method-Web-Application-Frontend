import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Form, Button, Row, Col } from 'react-bootstrap';

const CustomFeedFormulationEdit = () => {
  const { formulationId } = useParams();
  const navigate = useNavigate();
  const [formulationName, setFormulationName] = useState('');
  const [proteins, setProteins] = useState([{ name: '', quantityKg: '' }]);
  const [carbohydrates, setCarbohydrates] = useState([{ name: '', quantityKg: '' }]);
  
  // If 'date' is needed, you can fetch or set it here. If not, remove it from the API calls.
  const date = new Date().toISOString().split('T')[0]; // Example of setting today's date

  const fetchFormulation = useCallback(async () => {
    try {
      const response = await axios.get(`/feed-formulations/${formulationId}/${date}`);
      
      setFormulationName(response.data.formulationName || ''); // Fallback to empty string if undefined
  
      // Ensure ingredients are defined before filtering
      const ingredients = response.data?.ingredients || [];
      
      // Filter proteins and carbohydrates only if ingredients exist
      setProteins(ingredients.filter(i => i.category === 'Proteins'));
      setCarbohydrates(ingredients.filter(i => i.category === 'Carbohydrates'));
  
    } catch (error) {
      console.error('Error fetching formulation:', error);
    }
  }, [formulationId, date]);
  
  
  useEffect(() => {
    if (formulationId) {
      fetchFormulation();
    }
  }, [formulationId, fetchFormulation]);

  const handleAddIngredient = (setIngredients) => {
    setIngredients((prev) => [...prev, { name: '', quantityKg: '' }]);
  };

  const handleInputChange = (setIngredients, index, field, value) => {
    setIngredients((prevIngredients) => {
      const newIngredients = [...prevIngredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return newIngredients;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFormulation = {
      formulationName,
      ingredients: [
        ...proteins.map((p) => ({ ...p, category: 'Proteins' })),
        ...carbohydrates.map((c) => ({ ...c, category: 'Carbohydrates' })),
      ],
    };
    try {
      await axios.put(`/feed-formulations/${formulationId}/${date}`, newFormulation);
      alert('Formulation updated successfully');
      navigate('/feed-formulations');
    } catch (error) {
      console.error('Error updating formulation:', error);
    }
  };

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h2>Edit Feed Formulation</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Formulation Name</Form.Label>
          <Form.Control
            type="text"
            value={formulationName}
            onChange={(e) => setFormulationName(e.target.value)}
          />
        </Form.Group>

        <h4>Proteins</h4>
        {proteins.map((protein, index) => (
          <Row key={index} className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Protein Name"
                value={protein.name}
                onChange={(e) => handleInputChange(setProteins, index, 'name', e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Quantity (Kg)"
                value={protein.quantityKg}
                onChange={(e) => handleInputChange(setProteins, index, 'quantityKg', e.target.value)}
              />
            </Col>
          </Row>
        ))}
        <Button onClick={() => handleAddIngredient(setProteins)}>Add Protein</Button>

        <h4>Carbohydrates</h4>
        {carbohydrates.map((carb, index) => (
          <Row key={index} className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Carbohydrate Name"
                value={carb.name}
                onChange={(e) => handleInputChange(setCarbohydrates, index, 'name', e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Quantity (Kg)"
                value={carb.quantityKg}
                onChange={(e) => handleInputChange(setCarbohydrates, index, 'quantityKg', e.target.value)}
              />
            </Col>
          </Row>
        ))}
        <Button onClick={() => handleAddIngredient(setCarbohydrates)}>Add Carbohydrate</Button>

        <Button type="submit" className="mt-3">Update Formulation</Button>
      </Form>
    </motion.div>
  );
};

export default CustomFeedFormulationEdit;

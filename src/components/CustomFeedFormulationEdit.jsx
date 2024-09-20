import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';  // Import icons from react-icons

const CustomFeedFormulationEdit = () => {
  const { formulationId } = useParams(); // Get formulationId from URL parameters
  const navigate = useNavigate(); // Hook for navigating between routes
  const [formulationName, setFormulationName] = useState(''); // Formulation name state
  const [proteins, setProteins] = useState([{ name: '', quantityKg: '' }]); // Protein ingredients state
  const [carbohydrates, setCarbohydrates] = useState([{ name: '', quantityKg: '' }]); // Carbohydrate ingredients state
  
  // Example of setting today's date
  const date = new Date().toISOString().split('T')[0]; 

  // Fetch formulation details using the formulationId and date
  const fetchFormulation = useCallback(async () => {
    try {
      const response = await axios.get(`/feed-formulations/${formulationId}/${date}`);
      
      // Update state with fetched data, fallback to empty if undefined
      setFormulationName(response.data.formulationName || ''); 
  
      // Ensure ingredients are defined and filter them
      const ingredients = response.data?.ingredients || [];
      setProteins(ingredients.filter(i => i.category === 'Proteins'));
      setCarbohydrates(ingredients.filter(i => i.category === 'Carbohydrates'));
  
    } catch (error) {
      console.error('Error fetching formulation:', error);
    }
  }, [formulationId, date]);
  
  useEffect(() => {
    if (formulationId) {
      fetchFormulation(); // Fetch formulation on component mount
    }
  }, [formulationId, fetchFormulation]);

  // Function to add a new ingredient row
  const handleAddIngredient = (setIngredients) => {
    setIngredients((prev) => [...prev, { name: '', quantityKg: '' }]);
  };

  // Handle input change for ingredient fields
  const handleInputChange = (setIngredients, index, field, value) => {
    setIngredients((prevIngredients) => {
      const newIngredients = [...prevIngredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return newIngredients;
    });
  };

  // Handle form submission
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
      navigate('/feed-formulations'); // Navigate to formulations list
    } catch (error) {
      console.error('Error updating formulation:', error);
    }
  };

  return (
    <motion.div className="container p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h2 className="mb-4">Edit Feed Formulation</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label>Formulation Name</Form.Label>
          <Form.Control
            type="text"
            value={formulationName}
            onChange={(e) => setFormulationName(e.target.value)}
            required
          />
        </Form.Group>

        {/* Protein Ingredients */}
        <h4 className="mt-4">Proteins</h4>
        {proteins.map((protein, index) => (
          <Row key={index} className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Protein Name"
                value={protein.name}
                onChange={(e) => handleInputChange(setProteins, index, 'name', e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Quantity (Kg)"
                value={protein.quantityKg}
                onChange={(e) => handleInputChange(setProteins, index, 'quantityKg', e.target.value)}
                required
              />
            </Col>
          </Row>
        ))}
        <Button 
          variant="outline-primary" 
          onClick={() => handleAddIngredient(setProteins)} 
          className="mb-4"
        >
          Add Protein
        </Button>

        {/* Carbohydrate Ingredients */}
        <h4 className="mt-4">Carbohydrates</h4>
        {carbohydrates.map((carb, index) => (
          <Row key={index} className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Carbohydrate Name"
                value={carb.name}
                onChange={(e) => handleInputChange(setCarbohydrates, index, 'name', e.target.value)}
                required
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Quantity (Kg)"
                value={carb.quantityKg}
                onChange={(e) => handleInputChange(setCarbohydrates, index, 'quantityKg', e.target.value)}
                required
              />
            </Col>
          </Row>
        ))}
        <Button 
          variant="outline-primary" 
          onClick={() => handleAddIngredient(setCarbohydrates)} 
          className="mb-4"
        >
          Add Carbohydrate
        </Button>

        {/* Submit Button - Positioned at the bottom on all screens */}
        <Row>
          <Col className="d-flex justify-content-center">
            <Button type="submit" variant="success" className="mt-3">
              Update Formulation
            </Button>
          </Col>
        </Row>
        <Link to="/custom/formulation/list">
            <Button variant="secondary">
              <FaArrowLeft className="d-block d-sm-none" /> {/* Icon on small screen */}
              <span className="d-none d-sm-inline">Back to List</span> {/* Text on larger screen */}
            </Button>
        </Link>
      </Form>
    </motion.div>
  );
};

export default CustomFeedFormulationEdit;


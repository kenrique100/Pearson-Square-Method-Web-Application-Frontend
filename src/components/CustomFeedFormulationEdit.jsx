import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

const CustomFeedFormulationEdit = () => {
  const { formulationId } = useParams(); // Extract formulationId from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [formulationName, setFormulationName] = useState(''); // State for formulation name
  const [proteins, setProteins] = useState([{ name: '', quantityKg: '' }]); // State for protein ingredients
  const [carbohydrates, setCarbohydrates] = useState([{ name: '', quantityKg: '' }]); // State for carbohydrate ingredients

  const date = new Date().toISOString().split('T')[0]; // Today's date

  // Fetch formulation details based on formulationId and date
  const fetchFormulation = useCallback(async () => {
    try {
      const response = await axios.get(`/feed-formulations/${formulationId}/${date}`);
      setFormulationName(response.data.formulationName || ''); // Set formulation name
      const ingredients = response.data?.ingredients || [];
      setProteins(ingredients.filter(i => i.category === 'Proteins')); // Filter proteins
      setCarbohydrates(ingredients.filter(i => i.category === 'Carbohydrates')); // Filter carbohydrates
    } catch (error) {
      console.error('Error fetching formulation:', error); // Error handling
    }
  }, [formulationId, date]);

  useEffect(() => {
    if (formulationId) {
      fetchFormulation(); // Fetch formulation on component mount
    }
  }, [formulationId, fetchFormulation]);

  // Add a new ingredient row
  const handleAddIngredient = (setIngredients) => {
    setIngredients((prev) => [...prev, { name: '', quantityKg: '' }]);
  };

  // Handle input changes for ingredient fields
  const handleInputChange = (setIngredients, index, field, value) => {
    setIngredients((prevIngredients) => {
      const newIngredients = [...prevIngredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return newIngredients;
    });
  };

  // Handle removal of an ingredient
  const handleRemoveIngredient = (setIngredients, index) => {
    setIngredients((prevIngredients) => prevIngredients.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const newFormulation = {
      formulationName,
      ingredients: [
        ...proteins.map((p) => ({ ...p, category: 'Proteins' })),
        ...carbohydrates.map((c) => ({ ...c, category: 'Carbohydrates' })),
      ],
    };
    try {
      await axios.put(`/feed-formulations/${formulationId}/${date}`, newFormulation);
      alert('Formulation updated successfully'); // Success message
      navigate('/custom/formulation/list'); // Redirect to formulations list
    } catch (error) {
      console.error('Error updating formulation:', error); // Error handling
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

        {/* Protein Ingredients Section */}
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
            <Col>
              <Button variant="danger" onClick={() => handleRemoveIngredient(setProteins, index)}>Remove</Button>
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

        {/* Carbohydrate Ingredients Section */}
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
            <Col>
              <Button variant="danger" onClick={() => handleRemoveIngredient(setCarbohydrates, index)}>Remove</Button>
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
            <FaArrowLeft className="d-block d-sm-none" /> {/* Icon on small screens */}
            <span className="d-none d-sm-inline">Back to List</span> {/* Text on larger screens */}
          </Button>
        </Link>
      </Form>
    </motion.div>
  );
};

export default CustomFeedFormulationEdit;

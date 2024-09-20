import React, { useState } from 'react';
import { Form, Button, Spinner, ListGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom'; 
import { motion } from 'framer-motion'; 
import * as api from '../services/api'; 

const CustomFeedFormulationCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    formulationName: '',
    proteins: [],
    carbohydrates: []
  });

  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [currentCategory, setCurrentCategory] = useState('proteins');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const availableIngredients = {
    proteins: ['Soya Beans', 'Groundnuts', 'Blood Meal', 'Fish Meal'],
    carbohydrates: ['Maize', 'Cassava'],
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddIngredient = () => {
    if (!ingredientName || !ingredientQuantity) {
      toast.error('Both name and quantity are required.');
      return;
    }

    const newIngredient = { name: ingredientName, quantityKg: parseFloat(ingredientQuantity) };

    setFormData((prevData) => ({
      ...prevData,
      [currentCategory]: [...prevData[currentCategory], newIngredient]
    }));

    setIngredientName('');
    setIngredientQuantity('');
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.formulationName.trim()) {
      errs.formulationName = 'Formulation name is required.';
    }
    if (formData.proteins.length === 0) {
      errs.proteins = 'At least one protein is required.';
    }
    if (formData.carbohydrates.length === 0) {
      errs.carbohydrates = 'At least one carbohydrate is required.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await api.createCustomFormulation(formData);
      toast.success('Formulation created successfully!');
      setTimeout(() => {
        navigate('/custom/formulation/list');
      }, 2000);
    } catch (error) {
      toast.error('Failed to create formulation.');
      console.error('Error creating formulation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="p-4">
      <ToastContainer />
      <h2>Create Custom Feed Formulation</h2>

      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group controlId="formulationName">
          <Form.Label>Formulation Name</Form.Label>
          <Form.Control
            type="text"
            name="formulationName"
            value={formData.formulationName}
            onChange={handleChange}
            isInvalid={errors.formulationName}
          />
          <Form.Control.Feedback type="invalid">{errors.formulationName}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="ingredientCategory">
          <Form.Label>Ingredient Category</Form.Label>
          <Form.Control as="select" onChange={(e) => setCurrentCategory(e.target.value)} value={currentCategory}>
            <option value="proteins">Proteins</option>
            <option value="carbohydrates">Carbohydrates</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="ingredientName">
          <Form.Label>Ingredient Name</Form.Label>
          <Form.Control as="select" value={ingredientName} onChange={(e) => setIngredientName(e.target.value)}>
            <option value="">Select Ingredient</option>
            {availableIngredients[currentCategory].map((ingredient, index) => (
              <option key={index} value={ingredient}>{ingredient}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="ingredientQuantity">
          <Form.Label>Quantity (Kg)</Form.Label>
          <Form.Control
            type="number"
            value={ingredientQuantity}
            onChange={(e) => setIngredientQuantity(e.target.value)}
          />
        </Form.Group>

        <Button onClick={handleAddIngredient} className="mt-4 mb-3">Add Ingredient</Button>

        <h4>Selected Ingredients:</h4>
        <ListGroup>
          {formData[currentCategory].map((ingredient, index) => (
            <ListGroup.Item key={index}>
              {ingredient.name}: {ingredient.quantityKg} Kg
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Center the submit button and add padding */}
        <div className="d-flex justify-content-center mt-4">
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" /> : 'Create Formulation'}
          </Button>
        </div>
      </Form>
    </motion.div>
  );
};

export default CustomFeedFormulationCreate;

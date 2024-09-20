import React, { useState } from 'react';
import { Form, Button, Spinner, ListGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify'; // Importing toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing toast styles
import { useNavigate } from 'react-router-dom'; // Hook to programmatically navigate
import { motion } from 'framer-motion'; // Framer Motion for animations
import * as api from '../services/api'; // Importing API services

const CustomFeedFormulationCreate = () => {
  // useNavigate hook for navigation
  const navigate = useNavigate();

  // State to store form data including formulation name, proteins, and carbohydrates
  const [formData, setFormData] = useState({
    formulationName: '',
    proteins: [],
    carbohydrates: []
  });

  // State to manage the current ingredient's name and quantity
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  
  // State to manage which category of ingredients is being selected (proteins or carbohydrates)
  const [currentCategory, setCurrentCategory] = useState('proteins');
  
  // Loading state for API call
  const [loading, setLoading] = useState(false);
  
  // State to hold form validation errors
  const [errors, setErrors] = useState({});

  // List of available ingredients based on category (proteins and carbohydrates)
  const availableIngredients = {
    proteins: ['Soya Beans', 'Groundnuts', 'Blood Meal', 'Fish Meal'],
    carbohydrates: ['Maize', 'Cassava'],
  };

  // Function to handle changes in form input fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // Dynamically setting form data
    });
  };

  // Function to add an ingredient to the current category
  const handleAddIngredient = () => {
    // Validation: ensure both ingredient name and quantity are provided
    if (!ingredientName || !ingredientQuantity) {
      toast.error('Both name and quantity are required.'); // Show error if either is missing
      return;
    }

    // Create a new ingredient object with name and quantity
    const newIngredient = { name: ingredientName, quantityKg: parseFloat(ingredientQuantity) };

    // Add the new ingredient to the corresponding category in formData (proteins or carbohydrates)
    setFormData((prevData) => ({
      ...prevData,
      [currentCategory]: [...prevData[currentCategory], newIngredient]
    }));

    // Clear the ingredient name and quantity fields after adding the ingredient
    setIngredientName('');
    setIngredientQuantity('');
  };

  // Function to validate the form before submitting
  const validateForm = () => {
    const errs = {};
    // Validate formulation name
    if (!formData.formulationName.trim()) {
      errs.formulationName = 'Formulation name is required.';
    }
    // Ensure at least one protein is added
    if (formData.proteins.length === 0) {
      errs.proteins = 'At least one protein is required.';
    }
    // Ensure at least one carbohydrate is added
    if (formData.carbohydrates.length === 0) {
      errs.carbohydrates = 'At least one carbohydrate is required.';
    }
    return errs; // Return validation errors (if any)
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Validate form data
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // If validation fails, display errors
      return;
    }

    setLoading(true); // Set loading state to true while API call is in progress
    try {
      // Call API to create the custom feed formulation
      await api.createCustomFormulation(formData);

      // Show success toast notification on successful creation
      toast.success('Formulation created successfully!');

      // Redirect the user to the formulation list after a short delay
      setTimeout(() => {
        navigate('/custom/formulation/list'); // Navigate to the formulation list page
      }, 2000); // 2-second delay to allow the toast notification to be shown
    } catch (error) {
      // Show error toast notification if API call fails
      toast.error('Failed to create formulation.');
      console.error('Error creating formulation:', error);
    } finally {
      setLoading(false); // Set loading state to false after the API call completes
    }
  };

  return (
    // Animate the form container using Framer Motion
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <ToastContainer /> {/* Container for displaying toast notifications */}
      <h2>Create Custom Feed Formulation</h2>

      {/* Form to create a custom feed formulation */}
      <Form onSubmit={handleSubmit}>
        {/* Form field for formulation name */}
        <Form.Group controlId="formulationName">
          <Form.Label>Formulation Name</Form.Label>
          <Form.Control
            type="text"
            name="formulationName"
            value={formData.formulationName}
            onChange={handleChange}
            isInvalid={errors.formulationName} // Display validation error if any
          />
          <Form.Control.Feedback type="invalid">{errors.formulationName}</Form.Control.Feedback>
        </Form.Group>

        {/* Dropdown to select ingredient category (proteins or carbohydrates) */}
        <Form.Group controlId="ingredientCategory">
          <Form.Label>Ingredient Category</Form.Label>
          <Form.Control as="select" onChange={(e) => setCurrentCategory(e.target.value)} value={currentCategory}>
            <option value="proteins">Proteins</option>
            <option value="carbohydrates">Carbohydrates</option>
          </Form.Control>
        </Form.Group>

        {/* Dropdown to select ingredient name from the available ingredients */}
        <Form.Group controlId="ingredientName">
          <Form.Label>Ingredient Name</Form.Label>
          <Form.Control as="select" value={ingredientName} onChange={(e) => setIngredientName(e.target.value)}>
            <option value="">Select Ingredient</option>
            {availableIngredients[currentCategory].map((ingredient, index) => (
              <option key={index} value={ingredient}>{ingredient}</option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Input field to enter ingredient quantity */}
        <Form.Group controlId="ingredientQuantity">
          <Form.Label>Quantity (Kg)</Form.Label>
          <Form.Control
            type="number"
            value={ingredientQuantity}
            onChange={(e) => setIngredientQuantity(e.target.value)}
          />
        </Form.Group>

        {/* Button to add the selected ingredient */}
        <Button onClick={handleAddIngredient}>Add Ingredient</Button>

        {/* Display selected ingredients (proteins or carbohydrates) */}
        <h4>Selected Ingredients:</h4>
        <ListGroup>
          {formData[currentCategory].map((ingredient, index) => (
            <ListGroup.Item key={index}>
              {ingredient.name}: {ingredient.quantityKg} Kg
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Submit button to create the formulation */}
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" /> : 'Create Formulation'} {/* Show spinner when loading */}
        </Button>
      </Form>
    </motion.div>
  );
};

export default CustomFeedFormulationCreate;

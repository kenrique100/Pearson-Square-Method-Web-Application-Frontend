import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner, ListGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as api from '../services/api'; // Import the API methods

// Component for creating a new custom feed formulation
const CustomFeedFormulationCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    formulationName: '',
    ingredients: {
      proteins: [],
      carbohydrates: []
    }
  });
  const [currentIngredientCategory, setCurrentIngredientCategory] = useState('proteins');
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [availableProteins, setAvailableProteins] = useState([]);
  const [availableCarbohydrates, setAvailableCarbohydrates] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Prepopulate ingredient lists
  useEffect(() => {
    setAvailableProteins([
      { name: 'Soya Beans' },
      { name: 'Groundnuts' },
      { name: 'Blood Meal' },
      { name: 'Fish Meal' },
    ]);

    setAvailableCarbohydrates([
      { name: 'Maize' },
      { name: 'Cassava' },
    ]);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle adding ingredients to the formulation
  const handleAddIngredient = () => {
    if (ingredientName && ingredientQuantity) {
      const newIngredient = { name: ingredientName, quantityKg: parseFloat(ingredientQuantity) };
      setFormData((prevData) => ({
        ...prevData,
        ingredients: {
          ...prevData.ingredients,
          [currentIngredientCategory]: [...prevData.ingredients[currentIngredientCategory], newIngredient]
        }
      }));
      setIngredientName('');
      setIngredientQuantity('');
    }
  };

  // Validate form before submission
  const validate = () => {
    const errs = {};
    if (!formData.formulationName.trim()) {
      errs.formulationName = 'Formulation Name is required.';
    }
    if (formData.ingredients.proteins.length === 0 || formData.ingredients.carbohydrates.length === 0) {
      errs.ingredients = 'At least one ingredient from both proteins and carbohydrates is required.';
    }
    return errs;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.createCustomFormulation(formData); // Use the custom API
      toast.success('Formulation created successfully!');
      navigate(`/formulations/${response.data.formulationId}`);
    } catch (error) {
      console.error('Error creating formulation:', error);
      toast.error('Failed to create formulation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer />
      <h2>Create Custom Feed Formulation</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFormulationName" className="mb-3">
          <Form.Label>Formulation Name</Form.Label>
          <Form.Control
            type="text"
            name="formulationName"
            value={formData.formulationName}
            onChange={handleChange}
            isInvalid={!!errors.formulationName}
            placeholder="Enter formulation name"
          />
          <Form.Control.Feedback type="invalid">
            {errors.formulationName}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formIngredientCategory" className="mb-3">
          <Form.Label>Ingredient Category</Form.Label>
          <Form.Select
            value={currentIngredientCategory}
            onChange={(e) => setCurrentIngredientCategory(e.target.value)}
          >
            <option value="proteins">Proteins</option>
            <option value="carbohydrates">Carbohydrates</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formIngredientName" className="mb-3">
          <Form.Label>Ingredient Name</Form.Label>
          <Form.Select
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
          >
            <option value="">Select an ingredient</option>
            {(currentIngredientCategory === 'proteins' ? availableProteins : availableCarbohydrates).map((ingredient) => (
              <option key={ingredient.name} value={ingredient.name}>
                {ingredient.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formIngredientQuantity" className="mb-3">
          <Form.Label>Ingredient Quantity (kg)</Form.Label>
          <Form.Control
            type="number"
            value={ingredientQuantity}
            onChange={(e) => setIngredientQuantity(e.target.value)}
            placeholder="Enter ingredient quantity"
          />
        </Form.Group>

        <Button variant="secondary" onClick={handleAddIngredient}>
          Add Ingredient
        </Button>

        <hr />
        <h4>Ingredients List</h4>
        {Object.keys(formData.ingredients).map((category) => (
          <div key={category}>
            <h5>{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
            {formData.ingredients[category].length > 0 ? (
              <ListGroup>
                {formData.ingredients[category].map((ingredient, idx) => (
                  <ListGroup.Item key={idx}>
                    {ingredient.name}: {ingredient.quantityKg} kg
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No {category} added yet.</p>
            )}
          </div>
        ))}

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Create'}
        </Button>
      </Form>
    </motion.div>
  );
};

export default CustomFeedFormulationCreate;

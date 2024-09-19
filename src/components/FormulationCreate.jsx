import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api'; // Adjust import based on your service
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Component for creating a new feed formulation
const FormulationCreate = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [formData, setFormData] = useState({
    formulationName: '', // New state for formulation name
    quantity: '',
    targetCpValue: ''
  }); // State to manage form data
  const [errors, setErrors] = useState({}); // State to manage form validation errors
  const [loading, setLoading] = useState(false); // State to manage loading state

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Function to validate form data before submission
  const validate = () => {
    const errs = {};
    // Validate formulation name
    if (!formData.formulationName || formData.formulationName.trim() === '') {
      errs.formulationName = 'Formulation Name is required.';
    }
    // Validate quantity (must be between 1 and 1000 kg)
    if (!formData.quantity || formData.quantity <= 0 || formData.quantity > 1000) {
      errs.quantity = 'Quantity must be between 1 and 1000 kg.';
    }
    // Validate target CP value (must be greater than zero)
    if (!formData.targetCpValue || formData.targetCpValue <= 0) {
      errs.targetCpValue = 'Target CP Value must be greater than zero.';
    }
    return errs; // Return any validation errors found
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const validationErrors = validate(); // Validate form data
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors); // If errors exist, set them in state and abort submission
      return;
    }
    setLoading(true); // Set loading state to true while the request is being made
    try {
      const response = await api.createFeedFormulation(formData, true); // Call custom API
      toast.success('Formulation created successfully!'); // Show success toast notification
      navigate(`/formulations/${response.formulationId}`); // Navigate to the newly created formulation's page
    } catch (error) {
      console.error('Error creating formulation:', error); // Log error to console
      const errorMessage = error.message || 'Failed to create formulation.'; // Handle error message
      toast.error(errorMessage); // Show error toast notification
    } finally {
      setLoading(false); // Set loading state to false after request is complete
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }} // Initial animation state
      animate={{ y: 0, opacity: 1 }} // Final animation state
      transition={{ duration: 0.5 }} // Animation duration
    >
      <ToastContainer /> {/* Container for displaying toast notifications */}
      <h2>Create New Formulation</h2>
      <Form onSubmit={handleSubmit}> {/* Form to create a new formulation */}
        <Form.Group controlId="formFormulationName" className="mb-3">
          <Form.Label>Formulation Name</Form.Label>
          <Form.Control
            type="text"
            name="formulationName"
            value={formData.formulationName}
            onChange={handleChange}
            isInvalid={!!errors.formulationName} // Show validation error if any
            placeholder="Enter formulation name"
          />
          <Form.Control.Feedback type="invalid">
            {errors.formulationName} {/* Display formulation name validation error */}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formQuantity" className="mb-3">
          <Form.Label>Quantity (kg)</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            isInvalid={!!errors.quantity} // Show validation error if any
            placeholder="Enter quantity in kilograms"
          />
          <Form.Control.Feedback type="invalid">
            {errors.quantity} {/* Display quantity validation error */}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTargetCpValue" className="mb-3">
          <Form.Label>Target CP Value</Form.Label>
          <Form.Control
            type="number"
            name="targetCpValue"
            value={formData.targetCpValue}
            onChange={handleChange}
            isInvalid={!!errors.targetCpValue} // Show validation error if any
            placeholder="Enter target CP value"
          />
          <Form.Control.Feedback type="invalid">
            {errors.targetCpValue} {/* Display target CP value validation error */}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Create'} {/* Show spinner if loading */}
        </Button>
      </Form>
    </motion.div>
  );
};

export default FormulationCreate;

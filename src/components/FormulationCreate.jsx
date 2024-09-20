import React, { useState } from 'react'; 
import { Form, Button, Spinner } from 'react-bootstrap'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 

const FormulationCreate = () => {
  const navigate = useNavigate();  // Hook for programmatic navigation
  const [data, setData] = useState({
    formulationName: '',
    quantity: '',
    targetCpValue: ''
  });
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [loading, setLoading] = useState(false); // State to control loading spinner

  // Handle input change and update the respective state field
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  // Validate the input fields before submission
  const validate = () => {
    const errs = {};
    if (!data.formulationName.trim()) {
      errs.formulationName = 'Formulation Name is required.';
    }
    if (!data.quantity || data.quantity <= 0 || data.quantity > 5000) {
      errs.quantity = 'Quantity must be between 1 and 5000 kg.';
    }
    if (!data.targetCpValue || data.targetCpValue <= 0) {
      errs.targetCpValue = 'Target CP Value must be greater than zero.';
    }
    return errs;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const validationErrors = validate(); // Validate form inputs
  
    // If there are validation errors, set them and stop submission
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
  
    setLoading(true); // Set loading state to true to show spinner
    try {
      // Call the API to create a new formulation without assigning the response to a variable
      await api.createFormulation(data);
      toast.success('Formulation created successfully!'); // Show success toast
      setLoading(false);
  
      // After successful creation, redirect to the FormulationList page
      navigate('/'); // Redirects to the list of formulations
    } catch (error) {
      console.error('Error creating formulation:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create formulation.';
      toast.error(errorMessage); // Show error toast
      setLoading(false); // Set loading to false if the request fails
    }
  };
  

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer /> {/* Container for showing toast notifications */}
      <h2>Create New Formulation</h2>
      <Form onSubmit={handleSubmit}> {/* Form for creating a formulation */}
        <Form.Group controlId="formFormulationName" className="mb-3">
          <Form.Label>Formulation Name</Form.Label>
          <Form.Control
            type="text"
            name="formulationName"
            value={data.formulationName}
            onChange={handleChange}
            isInvalid={!!errors.formulationName} // Display validation error if any
            placeholder="Enter formulation name"
          />
          <Form.Control.Feedback type="invalid">
            {errors.formulationName} {/* Show error message for name */}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formQuantity" className="mb-3">
          <Form.Label>Quantity (kg)</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={data.quantity}
            onChange={handleChange}
            isInvalid={!!errors.quantity} // Display validation error if any
            placeholder="Enter quantity in kilograms"
          />
          <Form.Control.Feedback type="invalid">
            {errors.quantity} {/* Show error message for quantity */}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formTargetCpValue" className="mb-3">
          <Form.Label>Target CP Value</Form.Label>
          <Form.Control
            type="number"
            name="targetCpValue"
            value={data.targetCpValue}
            onChange={handleChange}
            isInvalid={!!errors.targetCpValue} // Display validation error if any
            placeholder="Enter target CP value"
          />
          <Form.Control.Feedback type="invalid">
            {errors.targetCpValue} {/* Show error message for CP value */}
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

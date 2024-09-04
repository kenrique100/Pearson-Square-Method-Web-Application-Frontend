import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import { motion } from 'framer-motion';

// Component for editing an existing feed formulation
const FormulationEdit = () => {
  const { id } = useParams(); // Get the formulation ID from the URL parameters
  const navigate = useNavigate(); // Initialize navigation hook
  const [formulation, setFormulation] = useState(null); // State to store the formulation details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [showEditModal, setShowEditModal] = useState(false); // State to manage visibility of the edit modal
  const [formData, setFormData] = useState({
    formulationName: '',  // New state for formulation name
    quantity: '',
    targetCpValue: ''
  }); // State to manage form data
  const [errors, setErrors] = useState({}); // State to manage form validation errors

  // Function to fetch the formulation details from the API
  const fetchFormulation = async () => {
    try {
      const response = await api.get('/feed-formulation'); // Fetch all formulations
      const found = response.data.find(f => f.formulationId === id); // Find the formulation with the matching ID
      if (found) {
        setFormulation(found); // Set the found formulation in state
        setFormData({
          formulationName: found.formulationName, // Populate form data with the formulation's name
          quantity: found.quantity, // Populate form data with the formulation's quantity
          targetCpValue: found.targetCpValue // Populate form data with the formulation's target CP value
        });
      }
      setLoading(false); // Set loading state to false after fetching
    } catch (error) {
      console.error('Error fetching formulation:', error); // Log error to console
      setLoading(false); // Set loading state to false if an error occurs
    }
  };

  // useEffect hook to fetch formulation details when the component mounts or the ID changes
  useEffect(() => {
    fetchFormulation(); // Fetch formulation when component mounts or ID changes
  }, [id]);

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
    // Validate formulation name (must not be empty)
    if (!formData.formulationName || formData.formulationName.trim() === '') {
      errs.formulationName = 'Formulation name is required.';
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
  const handleSubmit = async () => {
    const validationErrors = validate(); // Validate form data
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors); // If errors exist, set them in state and abort submission
      return;
    }
    try {
      // Send PUT request to API to update the formulation
      await api.put(`/feed-formulation/${formulation.formulationId}/${formulation.date}`, formData);
      toast.success('Formulation updated successfully!'); // Show success toast notification
      navigate(`/formulations/${formulation.formulationId}`); // Navigate back to the updated formulation's page
    } catch (error) {
      console.error('Error updating formulation:', error); // Log error to console
      toast.error('Failed to update formulation.'); // Show error toast notification
    }
  };

  // Display loading spinner while fetching data
  if (loading) {
    return <Spinner animation="border" />;
  }

  // Display a message if the formulation is not found
  if (!formulation) {
    return <h2>Formulation not found</h2>;
  }

  return (
    <motion.div
      initial={{ scale: 0.8 }} // Initial animation state
      animate={{ scale: 1 }} // Final animation state
      transition={{ duration: 0.3 }} // Animation duration
    >
      <ToastContainer /> {/* Container for displaying toast notifications */}
      <h2>Edit Formulation</h2>
      <Button variant="primary" onClick={() => setShowEditModal(true)}>
        Edit Details
      </Button>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Formulation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Input field for formulation name */}
            <Form.Group controlId="formFormulationName" className="mb-3">
              <Form.Label>Formulation Name</Form.Label>
              <Form.Control
                type="text"
                name="formulationName"
                value={formData.formulationName}
                onChange={handleChange}
                isInvalid={!!errors.formulationName} // Show validation error if any
              />
              <Form.Control.Feedback type="invalid">
                {errors.formulationName} {/* Display formulation name validation error */}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Input field for quantity */}
            <Form.Group controlId="formQuantity" className="mb-3">
              <Form.Label>Quantity (kg)</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                isInvalid={!!errors.quantity} // Show validation error if any
              />
              <Form.Control.Feedback type="invalid">
                {errors.quantity} {/* Display quantity validation error */}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Input field for target CP value */}
            <Form.Group controlId="formTargetCpValue" className="mb-3">
              <Form.Label>Target CP Value</Form.Label>
              <Form.Control
                type="number"
                name="targetCpValue"
                value={formData.targetCpValue}
                onChange={handleChange}
                isInvalid={!!errors.targetCpValue} // Show validation error if any
              />
              <Form.Control.Feedback type="invalid">
                {errors.targetCpValue} {/* Display target CP value validation error */}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Buttons for canceling or submitting the form */}
            <Button variant="secondary" onClick={() => setShowEditModal(false)} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default FormulationEdit; // Export component as default

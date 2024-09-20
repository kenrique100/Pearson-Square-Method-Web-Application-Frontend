import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';
import { motion } from 'framer-motion';

const FormulationEdit = () => {
  const { formulationId, date } = useParams(); // Get formulationId and date from URL params
  const navigate = useNavigate(); // For redirecting user
  const [formulation, setFormulation] = useState(null); // Holds formulation data
  const [loading, setLoading] = useState(true); // Shows loading spinner
  const [showEditModal, setShowEditModal] = useState(false); // Controls the edit modal visibility
  const [formData, setFormData] = useState({
    formulationName: '',
    quantity: '',
    targetCpValue: ''
  });
  const [errors, setErrors] = useState({}); // Holds form validation errors

  // Fetch formulation details using formulationId and date
  const fetchFormulation = useCallback(async () => {
    try {
      const response = await api.getFormulationByIdAndDate(formulationId, date);
      if (response.data) {
        setFormulation(response.data); // Set fetched formulation data
        setFormData({
          formulationName: response.data.formulationName,
          quantity: response.data.quantity,
          targetCpValue: response.data.targetCpValue
        });
      }
      setLoading(false); // Stop the loading spinner
    } catch (error) {
      console.error('Error fetching formulation:', error);
      setLoading(false); // Stop loading even if there is an error
    }
  }, [formulationId, date]);

  // Fetch formulation when the component is mounted
  useEffect(() => {
    fetchFormulation();
  }, [fetchFormulation]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Form validation function
  const validate = () => {
    const errs = {};
    if (!formData.formulationName.trim()) {
      errs.formulationName = 'Formulation name is required.';
    }
    if (!formData.quantity || formData.quantity <= 0 || formData.quantity > 5000) {
      errs.quantity = 'Quantity must be between 1 and 5000 kg.';
    }
    if (!formData.targetCpValue || formData.targetCpValue <= 0) {
      errs.targetCpValue = 'Target CP Value must be greater than zero.';
    }
    return errs;
  };

  // Handle form submission for updating the formulation
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if validation fails
      return;
    }
    try {
      await api.updateFeedFormulationByIdAndDate(formulationId, date, formData);
      toast.success('Formulation updated successfully!');
      navigate(`/formulation/view/${formulationId}/${date}`); // Redirect to view the updated formulation
    } catch (error) {
      console.error('Error updating formulation:', error);
      toast.error('Failed to update formulation.');
    }
  };

  if (loading) {
    return <Spinner animation="border" />; // Display spinner while loading
  }

  if (!formulation) {
    return <h2>Formulation not found</h2>; // Display error message if no formulation is found
  }

  return (
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
      <ToastContainer />
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
            {/* Formulation Name */}
            <Form.Group controlId="formFormulationName" className="mb-3">
              <Form.Label>Formulation Name</Form.Label>
              <Form.Control
                type="text"
                name="formulationName"
                value={formData.formulationName}
                onChange={handleChange}
                isInvalid={!!errors.formulationName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.formulationName}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Quantity */}
            <Form.Group controlId="formQuantity" className="mb-3">
              <Form.Label>Quantity (kg)</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                isInvalid={!!errors.quantity}
              />
              <Form.Control.Feedback type="invalid">
                {errors.quantity}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Target CP Value */}
            <Form.Group controlId="formTargetCpValue" className="mb-3">
              <Form.Label>Target CP Value</Form.Label>
              <Form.Control
                type="number"
                name="targetCpValue"
                value={formData.targetCpValue}
                onChange={handleChange}
                isInvalid={!!errors.targetCpValue}
              />
              <Form.Control.Feedback type="invalid">
                {errors.targetCpValue}
              </Form.Control.Feedback>
            </Form.Group>

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

export default FormulationEdit;

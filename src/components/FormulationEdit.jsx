import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback for memoizing fetchFormulation
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFeedFormulationByIdAndDate, updateFeedFormulationByIdAndDate } from '../services/feedFormulationsService'; // Named imports from feedFormulationsService
import { motion } from 'framer-motion';

// Component for editing an existing feed formulation
const FormulationEdit = () => {
  const { id } = useParams(); // Get the formulation ID from the URL parameters
  const navigate = useNavigate(); // Initialize navigation hook
  const [formulation, setFormulation] = useState(null); // State to store the formulation details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [showEditModal, setShowEditModal] = useState(false); // State to manage visibility of the edit modal
  const [formData, setFormData] = useState({
    formulationName: '',
    quantity: '',
    targetCpValue: ''
  }); // State to manage form data
  const [errors, setErrors] = useState({}); // State to manage form validation errors

  // Function to fetch the formulation details from the API
  const fetchFormulation = useCallback(async () => {
    try {
      const response = await getFeedFormulationByIdAndDate(id); // Fetch the specific formulation by ID
      if (response) {
        setFormulation(response);
        setFormData({
          formulationName: response.formulationName,
          quantity: response.quantity,
          targetCpValue: response.targetCpValue
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching formulation:', error);
      setLoading(false);
    }
  }, [id]);

  // useEffect hook to fetch formulation details when the component mounts or the ID changes
  useEffect(() => {
    fetchFormulation(); // Fetch formulation when component mounts or ID changes
  }, [fetchFormulation]);

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
    if (!formData.formulationName || formData.formulationName.trim() === '') {
      errs.formulationName = 'Formulation name is required.';
    }
    if (!formData.quantity || formData.quantity <= 0 || formData.quantity > 1000) {
      errs.quantity = 'Quantity must be between 1 and 1000 kg.';
    }
    if (!formData.targetCpValue || formData.targetCpValue <= 0) {
      errs.targetCpValue = 'Target CP Value must be greater than zero.';
    }
    return errs;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await updateFeedFormulationByIdAndDate(formulation.formulationId, formData);
      toast.success('Formulation updated successfully!');
      navigate(`/formulations/${formulation.formulationId}`);
    } catch (error) {
      console.error('Error updating formulation:', error);
      toast.error('Failed to update formulation.');
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
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
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

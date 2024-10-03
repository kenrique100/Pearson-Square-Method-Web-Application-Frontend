import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CustomFeedFormulationEdit = ({ formulationId }) => {
  const [showEditModal, setShowEditModal] = useState(false); // Control modal visibility
  const [formulationName, setFormulationName] = useState(''); // Formulation name
  const [proteins, setProteins] = useState([{ name: '', quantityKg: '' }]); // Protein ingredients
  const [carbohydrates, setCarbohydrates] = useState([{ name: '', quantityKg: '' }]); // Carbohydrate ingredients

  const date = new Date().toISOString().split('T')[0]; // Current date for API requests

  // Fetch formulation details by ID and date
  const fetchFormulation = useCallback(async () => {
    try {
      const response = await axios.get(`/feed-formulations/${formulationId}/${date}`);
      const formulationData = response.data;

      setFormulationName(formulationData.formulationName || ''); // Set formulation name

      // Separate proteins and carbohydrates by their category
      const ingredients = formulationData?.ingredients || [];
      const proteinIngredients = ingredients.filter(i => i.category === 'Proteins');
      const carbohydrateIngredients = ingredients.filter(i => i.category === 'Carbohydrates');

      // Set fetched ingredients to state
      setProteins(proteinIngredients.length ? proteinIngredients : [{ name: '', quantityKg: '' }]);
      setCarbohydrates(carbohydrateIngredients.length ? carbohydrateIngredients : [{ name: '', quantityKg: '' }]);
    } catch (error) {
      console.error('Error fetching formulation:', error); // Error handling
    }
  }, [formulationId, date]);

  // Fetch formulation when modal is opened
  useEffect(() => {
    if (formulationId && showEditModal) {
      fetchFormulation();
    }
  }, [formulationId, fetchFormulation, showEditModal]);

  // Open and close modal
  const handleOpenEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  // Add a new ingredient row (for proteins or carbohydrates)
  const handleAddIngredient = (setIngredients) => {
    setIngredients((prev) => [...prev, { name: '', quantityKg: '' }]);
  };

  // Handle changes in the ingredient fields
  const handleInputChange = (setIngredients, index, field, value) => {
    setIngredients((prevIngredients) => {
      const newIngredients = [...prevIngredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      return newIngredients;
    });
  };

  // Remove an ingredient row
  const handleRemoveIngredient = (setIngredients, index) => {
    setIngredients((prevIngredients) => prevIngredients.filter((_, i) => i !== index));
  };

  // Submit the form to update the feed formulation
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    const updatedFormulation = {
      formulationName,
      proteins: proteins.map((p) => ({ name: p.name, quantityKg: parseFloat(p.quantityKg) })),
      carbohydrates: carbohydrates.map((c) => ({ name: c.name, quantityKg: parseFloat(c.quantityKg) })),
    };

    try {
      await axios.put(`/feed-formulations/${formulationId}/${date}`, updatedFormulation);
      alert('Formulation updated successfully!'); // Success message
      handleCloseEditModal(); // Close modal on success
    } catch (error) {
      console.error('Error updating formulation:', error); // Error handling
    }
  };

  return (
    <div>
      {/* Edit button to open modal */}
      <Button onClick={handleOpenEditModal}>Edit Formulation</Button>

      {/* Modal for editing the formulation */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered size="lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Feed Formulation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {/* Formulation name input */}
              <Form.Group className="mb-4">
                <Form.Label>Formulation Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formulationName}
                  onChange={(e) => setFormulationName(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Protein ingredients section */}
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

              {/* Carbohydrate ingredients section */}
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

              {/* Submit button */}
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button type="submit" variant="success" className="mt-3">
                    Update Formulation
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {/* Link back to the formulation list */}
            <Link to="/custom/formulation/list">
              <Button variant="secondary">
                <FaArrowLeft className="d-block d-sm-none" /> {/* Icon on small screens */}
                <span className="d-none d-sm-inline">Back to List</span> {/* Text on larger screens */}
              </Button>
            </Link>
          </Modal.Footer>
        </motion.div>
      </Modal>
    </div>
  );
};

export default CustomFeedFormulationEdit;

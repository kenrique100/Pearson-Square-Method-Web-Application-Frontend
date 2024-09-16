import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllFeedFormulations, deleteFeedFormulationByIdAndDate } from '../services/feedFormulationsService';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormulationList = () => {
  const [formulations, setFormulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteDate, setDeleteDate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch all formulations
  const fetchFormulations = async () => {
    try {
      const response = await getAllFeedFormulations();
      setFormulations(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching formulations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormulations();
  }, []);

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteFeedFormulationByIdAndDate(deleteId, deleteDate);
      toast.success('Formulation deleted successfully!');
      fetchFormulations();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting formulation:', error);
      toast.error('Error deleting formulation');
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Formulations List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Formulation Name</th>
            <th>Creation Date</th>
            <th>Quantity (kg)</th>
            <th>Target CP Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {formulations.map(f => (
            <tr key={f.formulationId}>
              <td>{f.formulationId}</td>
              <td>{f.formulationName}</td>
              <td>{new Date(f.date).toLocaleDateString()}</td>
              <td>{f.quantity}</td>
              <td>{f.targetCpValue}</td>
              <td>
                <div className="d-none d-md-inline">
                  <Link to={`/formulations/${f.formulationId}`}>
                    <Button variant="primary" className="me-2">View</Button>
                  </Link>
                  <Link to={`/formulations/${f.formulationId}/edit`}>
                    <Button variant="warning" className="me-2">Edit</Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDeleteId(f.formulationId);
                      setDeleteDate(f.date);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
                <div className="d-md-none">
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to={`/formulations/${f.formulationId}`}>
                        View
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to={`/formulations/${f.formulationId}/edit`}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setDeleteId(f.formulationId);
                          setDeleteDate(f.date);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this formulation?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default FormulationList;

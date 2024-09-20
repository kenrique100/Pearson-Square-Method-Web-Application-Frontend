import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../services/api';
import 'react-toastify/dist/ReactToastify.css';

const FormulationList = () => {
  const [formulations, setFormulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalData, setDeleteModalData] = useState({ formulationId: null, date: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchFormulations = async () => {
      try {
        const { data } = await api.getFormulations();
        setFormulations(data);
      } catch (error) {
        console.error('Error fetching formulations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulations();
  }, []);

  const openDeleteModal = (formulationId, date) => {
    setDeleteModalData({ formulationId, date });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    const { formulationId, date } = deleteModalData;
    try {
      await api.deleteFeedFormulationByIdAndDate(formulationId, date);
      toast.success('Formulation deleted successfully!');
      setFormulations(prevFormulations => 
        prevFormulations.filter(f => f.formulationId !== formulationId)
      );
    } catch (error) {
      console.error('Error deleting formulation:', error);
      toast.error('Error deleting formulation');
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
          {formulations.map(({ formulationId, formulationName, date, quantity, targetCpValue }) => (
            <tr key={formulationId}>
              <td>{formulationId}</td>
              <td>{formulationName}</td>
              <td>{new Date(date).toLocaleDateString()}</td>
              <td>{quantity || 'N/A'}</td>
              <td>{targetCpValue}</td>
              <td>
                <ActionButtons
                  formulationId={formulationId}
                  date={date}
                  openDeleteModal={openDeleteModal}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </motion.div>
  );
};

const ActionButtons = ({ formulationId, date, openDeleteModal }) => (
  <>
    <div className="d-none d-md-inline">
      <Link to={`/formulation/view/${formulationId}/${date}`}>
        <Button variant="primary" className="me-2">View</Button>
      </Link>
      <Link to={`/formulation/edit/${formulationId}/${date}`}>
        <Button variant="warning" className="me-2">Edit</Button>
      </Link>
      <Button variant="danger" onClick={() => openDeleteModal(formulationId, date)}>
        Delete
      </Button>
    </div>

    <div className="d-md-none">
      <Dropdown>
        <Dropdown.Toggle variant="secondary">Actions</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={`/formulation/view/${formulationId}/${date}`}>
            View
          </Dropdown.Item>
          <Dropdown.Item as={Link} to={`/formulation/edit/${formulationId}/${date}`}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={() => openDeleteModal(formulationId, date)}>
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </>
);

const DeleteConfirmationModal = ({ show, onHide, onDelete }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Delete</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to delete this formulation?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Cancel</Button>
      <Button variant="danger" onClick={onDelete}>Delete</Button>
    </Modal.Footer>
  </Modal>
);

export default FormulationList;

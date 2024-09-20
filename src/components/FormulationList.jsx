import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Dropdown, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import api from '../services/api';
import 'react-toastify/dist/ReactToastify.css';

const FormulationList = () => {
  // State to hold formulations and loading status
  const [formulations, setFormulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalData, setDeleteModalData] = useState({ formulationId: null, date: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Number of formulations displayed per page

  // Fetch formulations from the API on component mount
  useEffect(() => {
    const fetchFormulations = async () => {
      try {
        const { data } = await api.getFormulations();
        setFormulations(data); // Store fetched formulations in state
      } catch (error) {
        console.error('Error fetching formulations:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFormulations();
  }, []);

  // Open the delete confirmation modal
  const openDeleteModal = (formulationId, date) => {
    setDeleteModalData({ formulationId, date });
    setShowDeleteModal(true);
  };

  // Handle formulation deletion
  const handleDelete = async () => {
    const { formulationId, date } = deleteModalData;
    try {
      await api.deleteFeedFormulationByIdAndDate(formulationId, date); // Call API to delete formulation
      toast.success('Formulation deleted successfully!'); // Show success message
      setFormulations(prevFormulations =>
        prevFormulations.filter(f => f.formulationId !== formulationId) // Update state to remove deleted formulation
      );
    } catch (error) {
      console.error('Error deleting formulation:', error);
      toast.error('Error deleting formulation'); // Show error message
    } finally {
      setShowDeleteModal(false); // Close the delete modal
    }
  };

  // Calculate pagination indices
  const indexOfLastItem = currentPage * itemsPerPage; // Last item index
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // First item index
  const currentFormulations = formulations.slice(indexOfFirstItem, indexOfLastItem); // Get current formulations for the page

  const totalPages = Math.ceil(formulations.length / itemsPerPage); // Calculate total number of pages

  // Show spinner while loading
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
          {currentFormulations.map(({ formulationId, formulationName, date, quantity, targetCpValue }) => (
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

      {/* Pagination Controls */}
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage} // Highlight active page
            onClick={() => setCurrentPage(index + 1)} // Set current page on click
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </motion.div>
  );
};

// Component for action buttons
const ActionButtons = ({ formulationId, date, openDeleteModal }) => (
  <>
    <div className="d-none d-md-flex justify-content-start">
      {/* View formulation link */}
      <Link to={`/formulation/view/${formulationId}/${date}`}>
        <Button variant="primary" className="me-2 btn-sm">View</Button>
      </Link>
      {/* Edit formulation link */}
      <Link to={`/formulation/edit/${formulationId}/${date}`}>
        <Button variant="warning" className="me-2 btn-sm">Edit</Button>
      </Link>
      {/* Delete formulation button */}
      <Button variant="danger" className="me-2 btn-sm" onClick={() => openDeleteModal(formulationId, date)}>
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

// Delete confirmation modal component
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

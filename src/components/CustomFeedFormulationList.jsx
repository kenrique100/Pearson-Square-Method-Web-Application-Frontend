import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Dropdown, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toast CSS
const CustomFeedFormulationList = () => {
  const [formulations, setFormulations] = useState([]); // Holds all formulations fetched from the API
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [deleteModalData, setDeleteModalData] = useState({ formulationId: null, date: null }); // Holds data for the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Manages delete modal visibility
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page for pagination
  const itemsPerPage = 7; // Number of formulations per page

  // Fetch the formulations when the component loads
  useEffect(() => {
    const fetchFormulations = async () => {
      try {
        const { data } = await api.getCustomFormulations();
        setFormulations(data);
      } catch (error) {
        console.error('Error fetching formulations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormulations();
  }, []);

  // Opens the delete modal with the selected formulation ID and date
  const openDeleteModal = (formulationId, date) => {
    setDeleteModalData({ formulationId, date });
    setShowDeleteModal(true);
  };

  // Handles deletion of a formulation
  const handleDelete = async () => {
    const { formulationId, date } = deleteModalData;
    try {
      await api.deleteCustomFeedFormulationByIdAndDate(formulationId, date);
      toast.success('Formulation deleted successfully!');
      setFormulations((prev) => prev.filter((f) => f.formulationId !== formulationId)); // Remove the deleted formulation from the list
    } catch (error) {
      console.error('Error deleting formulation:', error);
      toast.error('Error deleting formulation');
    } finally {
      setShowDeleteModal(false); // Close the delete modal
    }
  };

  // Handle loading state
  if (loading) {
    return <Spinner animation="border" />;
  }

  // Pagination calculation to slice formulations for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFormulations = formulations.slice(indexOfFirstItem, indexOfLastItem); // Formulations for the current page

  // Handle pagination page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2>Custom Formulations List</h2>
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
          {currentFormulations.map(({ formulationId, formulationName, date, totalQuantityKg, targetCpValue }) => (
            <tr key={formulationId}>
              <td>{formulationId}</td>
              <td>{formulationName}</td>
              <td>{new Date(date).toLocaleDateString()}</td>
              <td>{totalQuantityKg || 'N/A'}</td>
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

      {/* Render pagination only if there are more than 7 formulations */}
      {formulations.length > itemsPerPage && (
        <Pagination>
          {Array.from({ length: Math.ceil(formulations.length / itemsPerPage) }, (_, index) => (
            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Delete Confirmation Modal */}
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
    {/* Action buttons for larger screens (md and up) */}
    <div className="d-none d-md-flex justify-content-start">
      {/* Link to view formulation */}
      <Link to={`/custom/formulation/view/${formulationId}/${date}`}>
        <Button variant="primary" className="me-2 btn-sm">View</Button>
      </Link>
      {/* Link to edit formulation */}
      <Link to={`/custom/formulation/edit/${formulationId}/${date}`}>
        <Button variant="warning" className="me-2 btn-sm">Edit</Button>
      </Link>
      {/* Button to open delete confirmation modal */}
      <Button
        variant="danger"
        className="btn-sm"
        onClick={() => openDeleteModal(formulationId, date)}
      >
        Delete
      </Button>
    </div>

    {/* Dropdown for smaller screens (below md) */}
    <div className="d-md-none">
      <Dropdown>
        {/* Dropdown toggle button */}
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          Actions
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {/* Dropdown items for each action */}
          <Dropdown.Item as={Link} to={`/custom/formulation/view/${formulationId}/${date}`}>
            View
          </Dropdown.Item>
          <Dropdown.Item as={Link} to={`/custom/formulation/edit/${formulationId}/${date}`}>
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

// Delete Confirmation Modal component
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

export default CustomFeedFormulationList;

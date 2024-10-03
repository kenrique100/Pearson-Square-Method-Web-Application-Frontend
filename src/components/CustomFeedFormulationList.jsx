import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Dropdown, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa'; // Import filter icon for filtering feature
import api from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toast CSS

const CustomFeedFormulationList = () => {
  const [formulations, setFormulations] = useState([]); // Holds all formulations fetched from the API
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [deleteModalData, setDeleteModalData] = useState({ formulationId: null, date: null }); // Holds data for the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Manages delete modal visibility
  const [sortPeriod, setSortPeriod] = useState('all'); // State for sorting period
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

  // Filter formulations based on the selected sortPeriod
  const getFilteredFormulations = () => {
    const now = new Date();

    return formulations.filter(f => {
      const creationDate = new Date(f.date);
      
      // Apply filtering logic based on the selected period
      switch (sortPeriod) {
        case '24hours':
          return now - creationDate <= 24 * 60 * 60 * 1000; // Last 24 hours
        case '1month':
          return now - creationDate <= 30 * 24 * 60 * 60 * 1000; // Last 1 month
        case '2months':
          return now - creationDate <= 2 * 30 * 24 * 60 * 60 * 1000; // Last 2 months
        case '6months':
          return now - creationDate <= 6 * 30 * 24 * 60 * 60 * 1000; // Last 6 months
        case '1year':
          return now - creationDate <= 12 * 30 * 24 * 60 * 60 * 1000; // Last 1 year
        default:
          return true; // Show all formulations
      }
    }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort formulations by creation date in ascending order
  };

  // Apply filtering and pagination
  const filteredFormulations = getFilteredFormulations();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFormulations = filteredFormulations.slice(indexOfFirstItem, indexOfLastItem);

  // Handle loading state
  if (loading) {
    return <Spinner animation="border" />;
  }

  // Handle pagination page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
     {/* Top Section with Title and Filter Button */}
     <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Custom Formulations List</h2>

        {/* Filter Icon and Dropdown */}
        <div className="d-inline-block">
          {/* Filter Button for medium and larger screens */}
          <Dropdown className="d-none d-md-inline-block">
            <Dropdown.Toggle
              variant="primary"
              className="d-flex align-items-center px-3 py-2"
              style={{ borderRadius: '5px', backgroundColor: '#007bff', color: '#fff' }} // Style the filter button
            >
              <FaFilter size={20} className="me-2" /> {/* Filter icon */}
              <span>Filter</span> {/* Filter text */}
            </Dropdown.Toggle>

            {/* Dropdown for filter options */}
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortPeriod('24hours')}>Last 24 Hours</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('1month')}>Last 1 Month</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('2months')}>Last 2 Months</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('6months')}>Last 6 Months</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('1year')}>Last 1 Year</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('all')}>All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Filter Icon only for small screens */}
          <Dropdown className="d-md-none">
            <Dropdown.Toggle
              variant="primary"
              className="px-2 py-2"
              style={{ borderRadius: '5px', backgroundColor: '#007bff', color: '#fff' }}
            >
              <FaFilter size={20} /> {/* Only filter icon */}
            </Dropdown.Toggle>

            {/* Dropdown for filter options */}
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortPeriod('24hours')}>Last 24 Hours</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('1month')}>Last 1 Month</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('2months')}>Last 2 Months</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('6months')}>Last 6 Months</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('1year')}>Last 1 Year</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortPeriod('all')}>All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        </div>
      {/* Table displaying formulations */}
      <Table striped bordered hover>
        <thead>
          <tr>
            {/* <th>ID</th> -- Removed ID column */}
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
              {/* <td>{formulationId}</td> -- Removed ID cell */}
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

      {/* Render pagination only if there are more than itemsPerPage formulations */}
      {filteredFormulations.length > itemsPerPage && (
        <Pagination>
          {Array.from({ length: Math.ceil(filteredFormulations.length / itemsPerPage) }, (_, index) => (
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

// Component for action buttons
const ActionButtons = ({ formulationId, date, openDeleteModal }) => (
  <>
    {/* Action buttons for larger screens (md and up) */}
    <div className="d-none d-md-flex justify-content-start">
      <Link to={`/custom/formulation/view/${formulationId}/${date}`}>
        <Button variant="primary" className="me-2 btn-sm">View</Button>
      </Link>
      <Link to={`/custom/formulation/edit/${formulationId}/${date}`}>
        <Button variant="warning" className="me-2 btn-sm">Edit</Button>
      </Link>
      <Button variant="danger" className="btn-sm" onClick={() => openDeleteModal(formulationId, date)}>
        Delete
      </Button>
    </div>

    {/* Dropdown for smaller screens (below md) */}
    <div className="d-md-none">
      <Dropdown>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">Actions</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={`/custom/formulation/view/${formulationId}/${date}`}>View</Dropdown.Item>
          <Dropdown.Item as={Link} to={`/custom/formulation/edit/${formulationId}/${date}`}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={() => openDeleteModal(formulationId, date)}>Delete</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </>
);

// Modal for delete confirmation
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

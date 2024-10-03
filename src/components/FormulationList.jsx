import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Dropdown, Pagination, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaFilter } from 'react-icons/fa'; // Import filter icon for small screen usage
import api from '../services/api'; // Import API service to fetch data
import 'react-toastify/dist/ReactToastify.css';

const FormulationList = () => {
  // State to store all formulations fetched from the API
  const [formulations, setFormulations] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [deleteModalData, setDeleteModalData] = useState({ formulationId: null, date: null }); // Data for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal visibility state
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page
  const [filter, setFilter] = useState('All'); // Selected filter state
  const itemsPerPage = 7; // Number of items to display per page

  // Fetch formulations on component mount
  useEffect(() => {
    const fetchFormulations = async () => {
      try {
        const { data } = await api.getFormulations(); // Fetch data from the API
        // Sort formulations by date
        setFormulations(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (error) {
        console.error('Error fetching formulations:', error); // Handle any errors
      } finally {
        setLoading(false); // End loading state after data is fetched
      }
    };

    fetchFormulations();
  }, []); // Empty dependency array ensures this runs only on mount

  // Handle formulation deletion
  const handleDelete = async () => {
    const { formulationId, date } = deleteModalData; // Extract formulation ID and date for deletion
    try {
      await api.deleteFeedFormulationByIdAndDate(formulationId, date); // Call API to delete formulation
      toast.success('Formulation deleted successfully!'); // Show success message
      // Remove the deleted formulation from state
      setFormulations(prevFormulations =>
        prevFormulations.filter(f => f.formulationId !== formulationId)
      );
    } catch (error) {
      console.error('Error deleting formulation:', error); // Log error if deletion fails
      toast.error('Error deleting formulation'); // Show error message
    } finally {
      setShowDeleteModal(false); // Hide delete modal after operation
    }
  };

  // Function to filter formulations based on selected filter
  const filterFormulations = () => {
    const now = new Date(); // Get current date
    // Filter formulations based on the selected time range
    return formulations.filter(({ date }) => {
      const formulationDate = new Date(date); // Parse formulation date
      const timeDiff = now - formulationDate; // Calculate time difference
      switch (filter) {
        case 'Last 24 Hours':
          return timeDiff <= 24 * 60 * 60 * 1000; // Last 24 hours
        case '1 Week':
          return timeDiff <= 7 * 24 * 60 * 60 * 1000; // Last week
        case '1 Month':
          return timeDiff <= 30 * 24 * 60 * 60 * 1000; // Last month
        case '2 Months':
          return timeDiff <= 60 * 24 * 60 * 60 * 1000; // Last 2 months
        case '6 Months':
          return timeDiff <= 180 * 24 * 60 * 60 * 1000; // Last 6 months
        case '1 Year':
          return timeDiff <= 365 * 24 * 60 * 60 * 1000; // Last year
        case 'All':
        default:
          return true; // Return all formulations for "All"
      }
    });
  };

  const filteredFormulations = filterFormulations(); // Get the filtered formulations
  const indexOfLastItem = currentPage * itemsPerPage; // Calculate index of the last item on the current page
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Calculate index of the first item on the current page
  const currentFormulations = filteredFormulations.slice(indexOfFirstItem, indexOfLastItem); // Get the formulations for the current page
  const totalPages = Math.ceil(filteredFormulations.length / itemsPerPage); // Calculate total number of pages

  if (loading) {
    return <Spinner animation="border" />; // Show a loading spinner if data is being fetched
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Formulations List</h2>

        {/* Dropdown filter visible only on medium and larger screens */}
        <DropdownButton
          id="filter-dropdown"
          title={<><FaFilter /> Filter</>}
          variant="primary"
          onSelect={setFilter}
          className="mb-2 mb-md-0 d-none d-md-block"
        >
          {/* Filter options */}
          <Dropdown.Item eventKey="Last 24 Hours">Last 24 Hours</Dropdown.Item>
          <Dropdown.Item eventKey="1 Week">1 Week</Dropdown.Item>
          <Dropdown.Item eventKey="1 Month">1 Month</Dropdown.Item>
          <Dropdown.Item eventKey="2 Months">2 Months</Dropdown.Item>
          <Dropdown.Item eventKey="6 Months">6 Months</Dropdown.Item>
          <Dropdown.Item eventKey="1 Year">1 Year</Dropdown.Item>
          <Dropdown.Item eventKey="All">All</Dropdown.Item>
        </DropdownButton>

        {/* Button with only filter icon for small screens */}
        <Button variant="primary" className="d-md-none">
          <FaFilter />
        </Button>
      </div>

      {/* Table to display formulations */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Formulation Name</th>
            <th>Creation Date</th>
            <th>Quantity (kg)</th>
            <th>Target CP Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through current formulations and display them in rows */}
          {currentFormulations.map(({ formulationId, formulationName, date, quantity, targetCpValue }) => (
            <tr key={formulationId}>
              <td>{formulationName}</td>
              <td>{new Date(date).toLocaleDateString()}</td>
              <td>{quantity || 'N/A'}</td>
              <td>{targetCpValue}</td>
              <td>
                {/* Render action buttons */}
                <ActionButtons
                  formulationId={formulationId}
                  date={date}
                  openDeleteModal={setDeleteModalData}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination component */}
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
    </motion.div>
  );
};

// Action buttons for each formulation row
const ActionButtons = ({ formulationId, date, openDeleteModal }) => (
  <>
    {/* Full buttons for medium and larger screens */}
    <div className="d-none d-md-flex justify-content-start">
      <Link to={`/formulation/view/${formulationId}/${date}`}>
        <Button variant="primary" className="me-2 btn-sm">View</Button>
      </Link>
      <Link to={`/formulation/edit/${formulationId}/${date}`}>
        <Button variant="warning" className="me-2 btn-sm">Edit</Button>
      </Link>
      <Button variant="danger" className="me-2 btn-sm" onClick={() => openDeleteModal({ formulationId, date })}>
        Delete
      </Button>
    </div>

    {/* Dropdown menu for small screens */}
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
          <Dropdown.Item onClick={() => openDeleteModal({ formulationId, date })}>
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </>
);

// Modal for confirming deletion
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

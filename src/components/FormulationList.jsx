import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Dropdown, Pagination, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaFilter } from 'react-icons/fa'; // Import filter icon for filtering feature
import api from '../services/api';
import 'react-toastify/dist/ReactToastify.css';

const FormulationList = () => {
  // State to store all formulations fetched from the API
  const [formulations, setFormulations] = useState([]);
  // State to manage the loading state while fetching data
  const [loading, setLoading] = useState(true);
  // State to store the data of the formulation being deleted
  const [deleteModalData, setDeleteModalData] = useState({ formulationId: null, date: null });
  // State to manage the visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // State to keep track of the current page in pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State to track the selected filter option (default is 'All')
  const [filter, setFilter] = useState('All');
  const itemsPerPage = 7; // Number of items to display per page in the table

  // Fetch the formulations from the API when the component is mounted
  useEffect(() => {
    const fetchFormulations = async () => {
      try {
        // Fetch all formulations from the API
        const { data } = await api.getFormulations();
        // Sort formulations in ascending order (earliest to latest)
        setFormulations(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (error) {
        console.error('Error fetching formulations:', error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchFormulations();
  }, []);

  // Function to handle the deletion of a formulation
  const handleDelete = async () => {
    const { formulationId, date } = deleteModalData;
    try {
      // Call API to delete the formulation based on its ID and date
      await api.deleteFeedFormulationByIdAndDate(formulationId, date);
      // Show success notification
      toast.success('Formulation deleted successfully!');
      // Remove the deleted formulation from the current state
      setFormulations(prevFormulations =>
        prevFormulations.filter(f => f.formulationId !== formulationId)
      );
    } catch (error) {
      console.error('Error deleting formulation:', error);
      toast.error('Error deleting formulation');
    } finally {
      // Hide the delete confirmation modal
      setShowDeleteModal(false);
    }
  };

  // Function to filter formulations based on the selected filter (date range)
  const filterFormulations = () => {
    const now = new Date(); // Get the current date
    return formulations.filter(({ date }) => {
      const formulationDate = new Date(date); // Convert formulation date to a Date object
      const timeDiff = now - formulationDate; // Calculate time difference from today

      // Filter based on selected filter option
      switch (filter) {
        case 'Last 24 Hours':
          return timeDiff <= 24 * 60 * 60 * 1000; // Show formulations from the last 24 hours
        case '1 Month':
          return timeDiff <= 30 * 24 * 60 * 60 * 1000; // Show formulations from the last 1 month
        case '2 Months':
          return timeDiff <= 60 * 24 * 60 * 60 * 1000; // Show formulations from the last 2 months
        case '6 Months':
          return timeDiff <= 180 * 24 * 60 * 60 * 1000; // Show formulations from the last 6 months
        case '1 Year':
          return timeDiff <= 365 * 24 * 60 * 60 * 1000; // Show formulations from the last year
        case 'All':
        default:
          return true; // Show all formulations if 'All' is selected
      }
    });
  };

  // Apply the filtering function to get the filtered list of formulations
  const filteredFormulations = filterFormulations();
  // Calculate the index of the last item for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calculate the index of the first item for pagination
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Get the formulations for the current page
  const currentFormulations = filteredFormulations.slice(indexOfFirstItem, indexOfLastItem);
  // Calculate the total number of pages for pagination
  const totalPages = Math.ceil(filteredFormulations.length / itemsPerPage);

  // Show a loading spinner while data is being fetched
  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Header and filter dropdown */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Formulations List</h2>
        {/* Filter dropdown to filter formulations by date range */}
        <DropdownButton
          id="filter-dropdown"
          title={<><FaFilter /> Filter</>} // Display filter icon
          variant="primary"
          onSelect={setFilter} // Update filter state when option is selected
          className="mb-2 mb-md-0"
        >
          {/* Filter options */}
          <Dropdown.Item eventKey="Last 24 Hours">Last 24 Hours</Dropdown.Item>
          <Dropdown.Item eventKey="1 Month">1 Month</Dropdown.Item>
          <Dropdown.Item eventKey="2 Months">2 Months</Dropdown.Item>
          <Dropdown.Item eventKey="6 Months">6 Months</Dropdown.Item>
          <Dropdown.Item eventKey="1 Year">1 Year</Dropdown.Item>
          <Dropdown.Item eventKey="All">All</Dropdown.Item>
        </DropdownButton>
      </div>

      {/* Table to display formulations */}
      <Table striped bordered hover responsive>
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
          {/* Display each formulation */}
          {currentFormulations.map(({ formulationId, formulationName, date, quantity, targetCpValue }) => (
            <tr key={formulationId}>
              <td>{formulationId}</td>
              <td>{formulationName}</td>
              <td>{new Date(date).toLocaleDateString()}</td>
              <td>{quantity || 'N/A'}</td>
              <td>{targetCpValue}</td>
              <td>
                {/* Action buttons for each formulation */}
                <ActionButtons
                  formulationId={formulationId}
                  date={date}
                  openDeleteModal={setDeleteModalData} // Open delete modal when clicked
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination controls */}
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
        show={showDeleteModal} // Control modal visibility
        onHide={() => setShowDeleteModal(false)} // Hide modal on cancel
        onDelete={handleDelete} // Delete formulation on confirm
      />
    </motion.div>
  );
};

// Component for action buttons (view, edit, delete)
const ActionButtons = ({ formulationId, date, openDeleteModal }) => (
  <>
    {/* Buttons for larger screens */}
    <div className="d-none d-md-flex justify-content-start">
      <Link to={`/formulation/view/${formulationId}/${date}`}>
        <Button variant="primary" className="me-2 btn-sm">View</Button>
      </Link>
      <Link to={`/formulation/edit/${formulationId}/${date}`}>
        <Button variant="warning" className="me-2 btn-sm">Edit</Button>
      </Link>
      {/* Delete button */}
      <Button variant="danger" className="me-2 btn-sm" onClick={() => openDeleteModal({ formulationId, date })}>
        Delete
      </Button>
    </div>

    {/* Dropdown for smaller screens */}
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

// Component for delete confirmation modal
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

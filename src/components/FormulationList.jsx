import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Modal, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import the toast CSS file

const FormulationList = () => {
  const [formulations, setFormulations] = useState([]); // State to store the list of formulations
  const [loading, setLoading] = useState(true); // State to manage the loading spinner
  const [deleteId, setDeleteId] = useState(null); // State to store the ID of the formulation to be deleted
  const [deleteDate, setDeleteDate] = useState(null); // State to store the date of the formulation to be deleted
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control the visibility of the delete confirmation modal

  // Function to fetch all formulations from the API when the component mounts
  const fetchFormulations = async () => {
    try {
      const response = await api.get('/feed-formulation'); // API call to fetch formulations
      setFormulations(response.data); // Update the formulations state with fetched data
      setLoading(false); // Stop showing the loading spinner
    } catch (error) {
      console.error('Error fetching formulations:', error); // Log errors to the console
      setLoading(false); // Stop showing the loading spinner even if there's an error
    }
  };

  // useEffect hook to fetch formulations when the component mounts
  useEffect(() => {
    fetchFormulations(); // Call fetchFormulations function on component mount
  }, []);

  // Function to handle the deletion of a formulation
  const handleDelete = async () => {
    console.log('Deleting formulation with ID:', deleteId, 'and Date:', deleteDate); // Log the ID and date of the formulation to be deleted
    try {
      await api.delete(`/feed-formulation/${deleteId}/${deleteDate}`); // API call to delete the formulation
      toast.success('Formulation deleted successfully!'); // Show a success toast notification
      fetchFormulations(); // Refresh the list of formulations after deletion
      setShowDeleteModal(false); // Close the delete confirmation modal
    } catch (error) {
      console.error('Error deleting formulation:', error); // Log errors to the console during deletion
      toast.error('Error deleting formulation'); // Show an error toast notification
      setShowDeleteModal(false); // Close the delete confirmation modal even if there's an error
    }
  };

  // If the data is still loading, show a spinner
  if (loading) {
    return <Spinner animation="border" />; // Display a spinner while data is loading
  }

  // Render the list of formulations and the delete confirmation modal
  return (
    <motion.div
      initial={{ opacity: 0 }} // Start with 0 opacity
      animate={{ opacity: 1 }} // Animate to full opacity
      transition={{ duration: 0.5 }} // Set the duration of the animation
    >
      <h2>Formulations List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Formulation Name</th> {/* Add a column header for formulation name */}
            <th>Creation Date</th> {/* Add a column header for the creation date */}
            <th>Quantity (kg)</th>
            <th>Target CP Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {formulations.map(f => (
            <tr key={f.formulationId}>
              <td>{f.formulationId}</td>
              <td>{f.formulationName}</td> {/* Display the formulation name */}
              <td>{new Date(f.date).toLocaleDateString()}</td> {/* Display the creation date */}
              <td>{f.quantity}</td>
              <td>{f.targetCpValue}</td>
              <td>
                <div className="d-none d-md-inline">
                  <Link to={`/formulations/${f.formulationId}`}>
                    <Button variant="primary" className="me-2">View</Button> {/* Button to view the formulation */}
                  </Link>
                  <Link to={`/formulations/${f.formulationId}/edit`}>
                    <Button variant="warning" className="me-2">Edit</Button> {/* Button to edit the formulation */}
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDeleteId(f.formulationId); // Set the formulation ID for deletion
                      setDeleteDate(f.date); // Set the formulation date for deletion
                      setShowDeleteModal(true); // Show the delete confirmation modal
                    }}
                  >
                    Delete
                  </Button> {/* Button to delete the formulation */}
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
                          setDeleteId(f.formulationId); // Set the formulation ID for deletion
                          setDeleteDate(f.date); // Set the formulation date for deletion
                          setShowDeleteModal(true); // Show the delete confirmation modal
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title> {/* Modal title */}
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this formulation?</Modal.Body> {/* Modal body */}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button> {/* Button to cancel the deletion */}
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button> {/* Button to confirm the deletion */}
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default FormulationList;

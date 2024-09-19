import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Table, Button } from 'react-bootstrap';
import api from '../services/api'; // Import the API service

const FormulationList = () => {
  const [formulations, setFormulations] = useState([]);

  useEffect(() => {
    fetchFormulations();
  }, []);

  // Use the API service to fetch formulations
  const fetchFormulations = async () => {
    try {
      const response = await api.getFormulations();
      setFormulations(response.data);
    } catch (error) {
      console.error('Error fetching formulations:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteFeedFormulationByIdAndDate(id); // Adjusted API call to match service
      fetchFormulations(); // Refresh after delete
    } catch (error) {
      console.error('Error deleting formulation:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mt-4"
    >
      <h2>Feed Formulations</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date</th>
            <th>Total Quantity (kg)</th>
            <th>Target CP (%)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {formulations.map((formulation, index) => (
            <tr key={formulation.formulationId}>
              <td>{index + 1}</td>
              <td>{formulation.formulationName}</td>
              <td>{new Date(formulation.date).toLocaleDateString()}</td>
              <td>{formulation.totalQuantityKg}</td>
              <td>{formulation.targetCpValue}%</td>
              <td>
                <Link to={`/formulation/view/${formulation.formulationId}`} className="btn btn-primary btn-sm me-2">
                  View
                </Link>
                <Link to={`/formulation/edit/${formulation.formulationId}`} className="btn btn-warning btn-sm me-2">
                  Edit
                </Link>
                <Button variant="danger" size="sm" onClick={() => handleDelete(formulation.formulationId)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </motion.div>
  );
};

export default FormulationList;

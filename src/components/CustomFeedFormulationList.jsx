import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Table, Button } from 'react-bootstrap';

const CustomFeedFormulationList = () => {
  const [formulations, setFormulations] = useState([]);

  useEffect(() => {
    fetchFormulations();
  }, []);

  const fetchFormulations = async () => {
    try {
      const response = await axios.get('/api/feed-formulations');
      setFormulations(response.data);
    } catch (error) {
      console.error('Error fetching formulations:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/feed-formulations/${id}`);
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
              <td>{formulation.targetCp}%</td>
              <td>
                <Link to={`/custom-feed-formulations/${formulation.formulationId}`} className="btn btn-primary btn-sm me-2">
                  View
                </Link>
                <Link to={`/custom-feed-formulations/${formulation.formulationId}/edit`} className="btn btn-warning btn-sm me-2">
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
      <Link to="/custom-feed-formulations/create" className="btn btn-success mt-3">Create New Formulation</Link>
    </motion.div>
  );
};

export default CustomFeedFormulationList;

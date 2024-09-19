import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, Card } from 'react-bootstrap';
import api from '../services/api';  // Assuming api.js handles API calls
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';  // For Excel export functionality
import { FaArrowLeft, FaEdit, FaPrint, FaFileExcel } from 'react-icons/fa';  // Import icons from react-icons

const FormulationView = () => {
  const { formulationId, date } = useParams(); // Get URL parameters
  const [formulation, setFormulation] = useState(null);  // State to store formulation details
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState(null);  // State to manage any API errors

  // Fetch formulation by id and date
  const fetchFormulation = useCallback(async () => {
    setLoading(true);  // Start loading
    setError(null);  // Reset error before fetching
    try {
      const response = await api.getFormulationByIdAndDate(formulationId, date);
      setFormulation(response.data);  // Set fetched data
    } catch (err) {
      console.error('Error fetching formulation:', err);
      setError('Failed to fetch formulation. Please try again later.');  // Handle any errors
    } finally {
      setLoading(false);  // Stop loading once fetch completes
    }
  }, [formulationId, date]);  // Only re-run when formulationId or date changes

  // Fetch the formulation when component mounts or when id/date changes
  useEffect(() => {
    fetchFormulation();
  }, [fetchFormulation]);  // Depend on the fetch function to trigger the fetch

  if (loading) {
    return <p>Loading...</p>;  // You can replace with a spinner
  }

  if (error) {
    return <p className="alert alert-danger">{error}</p>;  // Display error message
  }

  if (!formulation) {
    return <p>Formulation not found</p>;  // Handle case where no formulation data exists
  }

  // Ensure that ingredients exist before rendering
  const ingredients = formulation.ingredient2s || [];

  // Export formulation data to Excel
  const handleExportToExcel = () => {
    const worksheetData = [
      ['Ingredient', 'Crude Protein (%)', 'Quantity (Kg)'],
      ...ingredients.map(ingredient => [
        ingredient.name,
        ingredient.crudeProtein !== null ? ingredient.crudeProtein : 'N/A',
        ingredient.quantityKg,
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Formulation Details');
    XLSX.writeFile(workbook, `Formulation_${formulationId}.xlsx`);
  };

  // Handle printing the formulation
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      className="container" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <h2>Formulation: {formulation.formulationName}</h2>
      <p><strong>Total Quantity:</strong> {formulation.totalQuantityKg} Kg</p>
      <p><strong>Target CP Value:</strong> {formulation.targetCpValue}%</p>
      
      {/* Ingredients Table */}
      <h3>Ingredients</h3>
      <Card>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Crude Protein (%)</th>
                <th>Quantity (Kg)</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.length > 0 ? (
                ingredients.map((ingredient, index) => (
                  <tr key={index}>
                    <td>{ingredient.name}</td>
                    <td>{ingredient.crudeProtein !== null ? ingredient.crudeProtein : 'N/A'}</td>
                    <td>{ingredient.quantityKg}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No ingredients found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
        {/* Action buttons */}
        <Card.Footer>
          <Link to={`/formulation/edit/${formulationId}/${date}`}>
            <Button variant="warning" className="me-2">
              <FaEdit className="d-block d-sm-none" /> 
              <span className="d-none d-sm-inline">Edit</span>
            </Button>
          </Link>
          <Button variant="info" className="me-2" onClick={handlePrint}>
            <FaPrint className="d-block d-sm-none" /> 
            <span className="d-none d-sm-inline">Print</span>
          </Button>
          <Button variant="success" className="me-2" onClick={handleExportToExcel}>
            <FaFileExcel className="d-block d-sm-none" /> 
            <span className="d-none d-sm-inline">Export to Excel</span>
          </Button>
          <Link to="/formulations">
            <Button variant="secondary">
              <FaArrowLeft className="d-block d-sm-none" /> 
              <span className="d-none d-sm-inline">Back to List</span>
            </Button>
          </Link>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

export default FormulationView;

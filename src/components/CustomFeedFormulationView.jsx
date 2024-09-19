import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Button, Card } from 'react-bootstrap';
import api from '../services/api';  // Assuming api.js handles API calls
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';  // For Excel export functionality
import { FaArrowLeft, FaEdit, FaPrint, FaFileExcel } from 'react-icons/fa';  // Import icons from react-icons

const CustomFeedFormulationView = () => {
  const { formulationId, date } = useParams(); // Destructure to get params directly
  const [formulation, setFormulation] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  // Define fetchFormulation with useCallback to prevent re-creating it on every render
  const fetchFormulation = useCallback(async () => {
    setLoading(true); // Set loading state to true when starting to fetch
    setError(null); // Reset error state
    try {
      const response = await api.getCustomFormulationByIdAndDate(formulationId, date);
      setFormulation(response.data);
    } catch (error) {
      console.error('Error fetching formulation:', error);
      setError('Failed to fetch formulation.'); // Set error message
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  }, [formulationId, date]); // Only depend on formulationId and date

  // Call fetchFormulation inside useEffect
  useEffect(() => {
    fetchFormulation();
  }, [fetchFormulation]); // No need to pass id explicitly

  // Display loading state if formulation data is not yet available
  if (loading) {
    return <p>Loading...</p>; // Consider using a spinner or loading indicator
  }

  if (error) {
    return <p className="alert alert-danger">{error}</p>; // Display error message
  }

  if (!formulation) {
    return <p>Formulation not found</p>; // Handle case where no formulation is found
  }

  // Ensure formulation.ingredients is an array before rendering
  const ingredients = formulation.ingredient2s || [];

  // Handle Excel export
  const handleExportToExcel = () => {
    const worksheetData = [
      ['Ingredient', 'Crude Protein (%)', 'Quantity (Kg)'],
      ...ingredients.map(ingredient => [
        ingredient.name,
        ingredient.crudeProtein !== null ? ingredient.crudeProtein : 'N/A',
        ingredient.quantityKg,
      ])
    ];

    // Create worksheet and workbook, then trigger download
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Formulation Details');
    XLSX.writeFile(workbook, `Formulation_${formulationId}.xlsx`);
  };

  // Handle print
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
      {/* Display Formulation Details */}
      <h2>Formulation: {formulation.formulationName}</h2>
      <p><strong>Total Quantity:</strong> {formulation.totalQuantityKg} Kg</p>
      <p><strong>Target CP Value:</strong> {formulation.targetCpValue}%</p>
      
      {/* Display Ingredients in a Table */}
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
          <Link to={`/feed-formulation/edit/${formulationId}/${date}`}>
            <Button variant="warning" className="me-2">
              <FaEdit className="d-block d-sm-none" /> {/* Icon on small screen */}
              <span className="d-none d-sm-inline">Edit</span> {/* Text on larger screen */}
            </Button>
          </Link>
          <Button variant="info" className="me-2" onClick={handlePrint}>
            <FaPrint className="d-block d-sm-none" /> {/* Icon on small screen */}
            <span className="d-none d-sm-inline">Print</span> {/* Text on larger screen */}
          </Button>
          <Button variant="success" className="me-2" onClick={handleExportToExcel}>
            <FaFileExcel className="d-block d-sm-none" /> {/* Icon on small screen */}
            <span className="d-none d-sm-inline">Export to Excel</span> {/* Text on larger screen */}
          </Button>
          <Link to="/formulations">
            <Button variant="secondary">
              <FaArrowLeft className="d-block d-sm-none" /> {/* Icon on small screen */}
              <span className="d-none d-sm-inline">Back to List</span> {/* Text on larger screen */}
            </Button>
          </Link>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

export default CustomFeedFormulationView;

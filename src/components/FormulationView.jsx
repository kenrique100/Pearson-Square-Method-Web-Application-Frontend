import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Spinner, Button, Card } from 'react-bootstrap';
import api from '../services/api';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export

// Component to view the details of a specific formulation
const FormulationView = () => {
  const { id } = useParams(); // Get the formulation ID from the URL parameters
  const [formulation, setFormulation] = useState(null); // State to store the formulation details
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Function to fetch the formulation details from the API
  const fetchFormulation = async () => {
    try {
      const response = await api.get('/feed-formulation'); // Fetch all formulations from the API
      const found = response.data.find(f => f.formulationId === id); // Find the formulation with the matching ID
      if (found) {
        setFormulation(found); // Set the found formulation in state
      }
      setLoading(false); // Set loading state to false after fetching
    } catch (error) {
      console.error('Error fetching formulation:', error); // Log error to console
      setLoading(false); // Set loading state to false if an error occurs
    }
  };

  // useEffect hook to fetch formulation details when the component mounts or when the ID changes
  useEffect(() => {
    fetchFormulation(); // Fetch formulation details when the component mounts or the ID changes
  }, [id]);

  // Function to print the formulation details
  const handlePrint = () => {
    window.print(); // Trigger the print dialog for the current page
  };

  // Function to export the formulation details to an Excel file
  const handleExportToExcel = () => {
    const worksheetData = [
      ['Formulation ID', formulation.formulationId],
      ['Formulation Name', formulation.formulationName],
      ['Date', new Date(formulation.date).toLocaleDateString()],
      ['Quantity (kg)', formulation.quantity],
      ['Target CP Value', formulation.targetCpValue],
      [],
      ['Ingredients'],
      ['Name', 'Crude Protein (%)', 'Quantity (kg)'],
      ...formulation.ingredients.map(ingredient => [
        ingredient.name,
        ingredient.crudeProtein,
        ingredient.quantity,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); // Create a worksheet from the array of arrays
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Formulation Details'); // Append the worksheet to the workbook
    XLSX.writeFile(workbook, `Formulation_${formulation.formulationId}.xlsx`); // Write the workbook to a file
  };

  // Display loading spinner while fetching data
  if (loading) {
    return <Spinner animation="border" />;
  }

  // Display a message if the formulation is not found
  if (!formulation) {
    return <h2>Formulation not found</h2>;
  }

  return (
    <motion.div
      initial={{ x: -300 }} // Initial animation state (off-screen to the left)
      animate={{ x: 0 }} // Final animation state (onscreen)
      transition={{ type: 'spring', stiffness: 100 }} // Spring animation with stiffness for a bouncing effect
    >
      <Card>
        <Card.Header>
          <h3>Formulation Details</h3> {/* Card header with title */}
        </Card.Header>
        <Card.Body>
          <Table bordered> {/* Table displaying formulation details */}
            <tbody>
              <tr>
                <td><strong>Formulation ID</strong></td>
                <td>{formulation.formulationId}</td> {/* Display formulation ID */}
              </tr>
              <tr>
                <td><strong>Formulation Name</strong></td>
                <td>{formulation.formulationName}</td> {/* Display formulation name */}
              </tr>
              <tr>
                <td><strong>Date</strong></td>
                <td>{new Date(formulation.date).toLocaleDateString()}</td> {/* Display formulation date */}
              </tr>
              <tr>
                <td><strong>Quantity (kg)</strong></td>
                <td>{formulation.quantity}</td> {/* Display formulation quantity */}
              </tr>
              <tr>
                <td><strong>Target CP Value</strong></td>
                <td>{formulation.targetCpValue}</td> {/* Display formulation target CP value */}
              </tr>
            </tbody>
          </Table>

          <h5>Ingredients:</h5> {/* Section header for ingredients */}
          <Table bordered> {/* Table displaying ingredients details */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Crude Protein (%)</th>
                <th>Quantity (kg)</th>
              </tr>
            </thead>
            <tbody>
              {formulation.ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td>{ingredient.name}</td> {/* Display ingredient name */}
                  <td>{ingredient.crudeProtein}</td> {/* Display ingredient crude protein percentage */}
                  <td>{ingredient.quantity}</td> {/* Display ingredient quantity */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer>
          {/* Link to the edit page for this formulation */}
          <Link to={`/formulations/${formulation.formulationId}/edit`}>
            <Button variant="warning" className="me-2">Edit</Button> {/* Button to navigate to edit page */}
          </Link>
          {/* Button to print the formulation details */}
          <Button variant="info" className="me-2" onClick={handlePrint}>
            Print
          </Button>
          {/* Button to export formulation details to Excel */}
          <Button variant="success" className="me-2" onClick={handleExportToExcel}>
            Export to Excel
          </Button>
          {/* Link to navigate back to the formulations list */}
          <Link to="/formulations">
            <Button variant="secondary">Back to List</Button> {/* Button to navigate back to the formulations list */}
          </Link>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

export default FormulationView;

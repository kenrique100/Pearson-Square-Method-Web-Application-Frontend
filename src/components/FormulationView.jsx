import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Spinner, Button, Card } from 'react-bootstrap';
import api from '../services/api';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import { FaArrowLeft, FaEdit, FaPrint, FaFileExcel } from 'react-icons/fa';  // Import icons from react-icons

const FormulationView = () => {
  const { formulationId, date } = useParams(); // Get formulationId and date from URL params
  const [formulation, setFormulation] = useState(null); // State for storing the formulation data
  const [loading, setLoading] = useState(true); // State for loading indicator

  // useCallback to memoize fetchFormulation function
  const fetchFormulation = useCallback(async () => {
    try {
      const response = await api.getFormulationByIdAndDate(formulationId, date); // Fetch formulation by ID and date
      setFormulation(response.data); // Set the fetched formulation data
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error('Error fetching formulation:', error); // Log error if fetching fails
      setLoading(false); // Set loading to false on error
    }
  }, [formulationId, date]);

  // Fetch formulation data when component mounts or params change
  useEffect(() => {
    fetchFormulation();
  }, [fetchFormulation]);

  // Function to handle printing of the formulation details
  const handlePrint = () => {
    const printContent = document.getElementById('printableArea'); // Get the printable area
    const newWindow = window.open('', '', 'width=900,height=600'); // Open a new window
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Formulation</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            h3 { text-align: center; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML} // Write the content to the new window
        </body>
      </html>
    `);
    newWindow.document.close(); // Close the document for the new window
    newWindow.print(); // Trigger print dialog
  };

  // Function to handle exporting formulation details to Excel
  const handleExportToExcel = () => {
    // Prepare data for Excel worksheet
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

    // Create a worksheet and workbook for Excel
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Formulation Details');
    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, `Formulation_${formulation.formulationId}.xlsx`);
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return <Spinner animation="border" />;
  }

  // Show message if formulation not found
  if (!formulation) {
    return <h2>Formulation not found</h2>;
  }

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <Card>
        <Card.Header>
          <h3>Formulation Details</h3>
        </Card.Header>
        <Card.Body>
          <div id="printableArea"> {/* Div for content to be printed */}
            <Table bordered>
              <tbody>
                <tr>
                  <td><strong>Formulation ID</strong></td>
                  <td>{formulation.formulationId}</td>
                </tr>
                <tr>
                  <td><strong>Formulation Name</strong></td>
                  <td>{formulation.formulationName}</td>
                </tr>
                <tr>
                  <td><strong>Date</strong></td>
                  <td>{new Date(formulation.date).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td><strong>Quantity (kg)</strong></td>
                  <td>{formulation.quantity}</td>
                </tr>
                <tr>
                  <td><strong>Target CP Value</strong></td>
                  <td>{formulation.targetCpValue}</td>
                </tr>
              </tbody>
            </Table>

            <h5>Ingredients:</h5>
            <Table bordered>
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
                    <td>{ingredient.name}</td>
                    <td>{ingredient.crudeProtein}</td>
                    <td>{ingredient.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
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
          <Link to="/">
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

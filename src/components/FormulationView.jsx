import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Table, Spinner, Button, Card } from 'react-bootstrap';
import api from '../services/api';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import { FaArrowLeft, FaEdit, FaPrint, FaFileExcel } from 'react-icons/fa';  // Import icons from react-icons

const FormulationView = () => {
  const { formulationId, date } = useParams(); // Use params for formulationId and date
  const [formulation, setFormulation] = useState(null);
  const [loading, setLoading] = useState(true);

  // useCallback to memoize fetchFormulation function
  const fetchFormulation = useCallback(async () => {
    try {
      const response = await api.getFormulationByIdAndDate(formulationId, date); // Fetch by formulationId and date
      setFormulation(response.data); // Set the fetched formulation
      setLoading(false);
    } catch (error) {
      console.error('Error fetching formulation:', error);
      setLoading(false);
    }
  }, [formulationId, date]);

  useEffect(() => {
    fetchFormulation(); // Fetch formulation on component mount or param change
  }, [fetchFormulation]);

  const handlePrint = () => {
    window.print(); // Print the current page
  };

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

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Formulation Details');
    XLSX.writeFile(workbook, `Formulation_${formulation.formulationId}.xlsx`);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

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
        </Card.Body>
        {/* Action buttons */}
        <Card.Footer>
          <Link to={`/formulation/edit/${formulationId}/${date}`}>
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
          <Link to="/">
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


export default FormulationView;

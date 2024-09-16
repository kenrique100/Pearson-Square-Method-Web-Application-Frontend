import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomFeedFormulationList from '../components/CustomFeedFormulationList';
import CustomFeedFormulationView from '../components/CustomFeedFormulationView';
import CustomFeedFormulationCreate from '../components/CustomFeedFormulationCreate';
import CustomFeedFormulationEdit from '../components/CustomFeedFormulationEdit';
import FormulationList from '../components/FormulationList';
import FormulationView from '../components/FormulationView';
import FormulationCreate from '../components/FormulationCreate';
import FormulationEdit from '../components/FormulationEdit';

const AppRoutes = () => {
  // State to toggle between custom and regular formulations
  const [isCustom, setIsCustom] = useState(true);

  // Toggle Handler
  const handleToggle = () => {
    setIsCustom((prev) => !prev); // Switch between custom and regular formulations
  };

  return (
    <div>
      {/* Toggle Button to switch between Custom and Regular Feed Formulations */}
      <div style={{ padding: '1rem', textAlign: 'center' }}>
        <button onClick={handleToggle}>
          {isCustom ? 'Switch to Regular Feed Formulations' : 'Switch to Custom Feed Formulations'}
        </button>
      </div>

      {/* Render Routes based on the toggle */}
      {isCustom ? (
        <Routes>
          {/* Redirect to custom formulations by default */}
          <Route path="/" element={<Navigate to="/custom-feed-formulations" />} />
          
          {/* Custom Feed Formulations */}
          <Route path="/custom-feed-formulations" element={<CustomFeedFormulationList />} />
          <Route path="/custom-feed-formulations/create" element={<CustomFeedFormulationCreate />} />
          <Route path="/custom-feed-formulations/:id/:date" element={<CustomFeedFormulationView />} />
          <Route path="/custom-feed-formulations/:id/:date/edit" element={<CustomFeedFormulationEdit />} />
        </Routes>
      ) : (
        <Routes>
          {/* Redirect to regular formulations by default */}
          <Route path="/" element={<Navigate to="/formulations" />} />
          
          {/* Regular Feed Formulations */}
          <Route path="/formulations" element={<FormulationList />} />
          <Route path="/formulations/create" element={<FormulationCreate />} />
          <Route path="/formulations/:id" element={<FormulationView />} />
          <Route path="/formulations/:id/edit" element={<FormulationEdit />} />
        </Routes>
      )}

      {/* 404 Route */}
      <Routes>
        <Route path="*" element={<h2>404: Page Not Found</h2>} />
      </Routes>
    </div>
  );
};

export default AppRoutes;

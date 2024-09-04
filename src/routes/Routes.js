import React from 'react';
import { Routes as Switch, Route, Navigate } from 'react-router-dom';
import FormulationList from '../components/FormulationList';
import FormulationView from '../components/FormulationView';
import FormulationCreate from '../components/FormulationCreate';
import FormulationEdit from '../components/FormulationEdit'; 

const Routes = () => {
  return (
    <Switch>
      <Route path="/" element={<Navigate to="/formulations" />} />
      <Route path="/formulations" element={<FormulationList />} />
      <Route path="/formulations/create" element={<FormulationCreate />} />
      <Route path="/formulations/:id" element={<FormulationView />} />
      <Route path="/formulations/:id/edit" element={<FormulationEdit />} />
      <Route path="*" element={<h2>404: Page Not Found</h2>} />
    </Switch>
  );
};

export default Routes;

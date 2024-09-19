import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FormulationList from '../components/FormulationList';
import FormulationCreate from '../components/FormulationCreate';
import FormulationView from '../components/FormulationView';
import FormulationEdit from '../components/FormulationEdit';
import CustomFeedFormulationList from '../components/CustomFeedFormulationList';
import CustomFeedFormulationCreate from '../components/CustomFeedFormulationCreate';
import CustomFeedFormulationView from '../components/CustomFeedFormulationView';
import CustomFeedFormulationEdit from '../components/CustomFeedFormulationEdit';

const AppRoutes = () => (
  <Routes>
    {/* Standard FeedFormulationController Routes */}
    <Route path="/" element={<FormulationList />} />
    <Route path="/formulation/create" element={<FormulationCreate />} />
    <Route path="/formulation/view/:formulationId/:date" element={<FormulationView />} />
    <Route path="/formulation/edit/:formulationId/:date" element={<FormulationEdit />} />

    {/* CustomFeedFormulationController Routes */}
    <Route path="/custom/formulation/list" element={<CustomFeedFormulationList />} />
    <Route path="/custom/formulation/create" element={<CustomFeedFormulationCreate />} />
    <Route path="/custom/formulation/view/:formulationId/:date" element={<CustomFeedFormulationView />} />
    <Route path="/custom/formulation/edit/:id/:date" element={<CustomFeedFormulationEdit />} />
  </Routes>
);

export default AppRoutes;

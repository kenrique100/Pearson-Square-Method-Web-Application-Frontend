import React from 'react';
import { Routes as Switch, Route, Navigate } from 'react-router-dom';
import CustomFeedFormulationList from '../components/CustomFeedFormulationList';
import CustomFeedFormulationView from '../components/CustomFeedFormulationView';
import CustomFeedFormulationCreate from '../components/CustomFeedFormulationCreate';
import CustomFeedFormulationEdit from '../components/CustomFeedFormulationEdit';
import FeedFormulationList from '../components/FeedFormulationList';
import FeedFormulationView from '../components/FeedFormulationView';
import FeedFormulationCreate from '../components/FeedFormulationCreate';
import FeedFormulationEdit from '../components/FeedFormulationEdit';

const Routes = () => {
  return (
    <Switch>
      {/* Redirect to custom formulations by default */}
      <Route path="/" element={<Navigate to="/custom-feed-formulations" />} />
      
      {/* Custom Feed Formulations */}
      <Route path="/custom-feed-formulations" element={<CustomFeedFormulationList />} />
      <Route path="/custom-feed-formulations/create" element={<CustomFeedFormulationCreate />} />
      <Route path="/custom-feed-formulations/:id/:date" element={<CustomFeedFormulationView />} />
      <Route path="/custom-feed-formulations/:id/:date/edit" element={<CustomFeedFormulationEdit />} />

      {/* Regular Feed Formulations */}
      <Route path="/feed-formulations" element={<FeedFormulationList />} />
      <Route path="/feed-formulations/create" element={<FeedFormulationCreate />} />
      <Route path="/feed-formulations/:formulationId/:date" element={<FeedFormulationView />} />
      <Route path="/feed-formulations/:formulationId/:date/edit" element={<FeedFormulationEdit />} />

      {/* 404 Route */}
      <Route path="*" element={<h2>404: Page Not Found</h2>} />
    </Switch>
  );
};

export default Routes;

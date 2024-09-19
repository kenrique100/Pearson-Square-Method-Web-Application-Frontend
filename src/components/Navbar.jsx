import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Feed Formulation</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Formulation List</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/formulation/create">Create Formulation</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/custom/formulation/list">Custom Formulation List</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/custom/formulation/create">Create Custom Formulation</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

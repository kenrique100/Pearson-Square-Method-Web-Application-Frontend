import React from 'react'; 
import { BrowserRouter as Router } from 'react-router-dom'; 
import Routes from './routes/Routes'; 
import NavbarComponent from './components/Navbar'; 

// The main App component that serves as the root of the application
function App() {
  return (
    <Router> {/* Wraps the application in a Router to enable routing */}
      <NavbarComponent /> {/* Renders the navigation bar at the top of the page */}
      <div className="container mt-4"> {/* Creates a container with top margin for the main content */}
        <Routes /> {/* Renders the appropriate component based on the current route */}
      </div>
    </Router>
  );
}

export default App; 

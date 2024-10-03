import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavbarComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Fish Feed Formulation Calculator</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Formulation List</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/formulation/create">
              <Nav.Link>Create Formulation</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/custom/formulation/list">
              <Nav.Link>Custom Formulation List</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/custom/formulation/create">
              <Nav.Link>Create Custom Formulation</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

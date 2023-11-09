import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import PageTitle from './PageTitle';

function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" style={{backgroundSize: "0", backgroundColor: "#1B1A1A"}}
    className="mb-auto">
      <Container className='ml-auto'>
        <Navbar.Brand href="../home" className='ml'><PageTitle /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
          </Nav>
          <Nav>
            <Nav.Link> GAMES </Nav.Link>
            <Nav.Link> ACTIVITY </Nav.Link>
            <Nav.Link> PROFILE </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

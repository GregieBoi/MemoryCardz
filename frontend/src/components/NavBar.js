import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import PageTitle from './PageTitle';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import TokenStorage from '../tokenStorage';

function NavBar() {
  const user = TokenStorage.getUser();
  const username = user?.username || '';


  function changeColor(e) {
    e.target.style.color = '#DD2020';
  }

  function revertColor(e) {
    e.target.style.color = '#A5A2A2';
  }

  return (
    <Navbar style={{ backgroundSize: "0", backgroundColor: "#1B1A1A" }}>
      <Container style={{ alignItems: "end" }}>
        <Navbar.Brand href="../home" className="m-0" style={{ justifyContent: "left", alignItems: "end" }}><PageTitle /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end" >
          <Nav className="o" >
          </Nav>
          <Nav>
            <Nav.Link id="navLinks">
              <Link to="/games" onMouseOver={changeColor} onMouseLeave={revertColor} style={{ textDecoration: 'none', color: "#A5A2A2" }}>
                GAMES
              </Link>
            </Nav.Link>
            <Nav.Link id="navLinks">
              <Link to="/activity" onMouseOver={changeColor} onMouseLeave={revertColor} style={{ textDecoration: 'none', color: "#A5A2A2" }}>
                ACTIVITY
              </Link>
            </Nav.Link>
            <Nav.Link id="navLinks">
              <Link to="/profile" onMouseOver={changeColor} onMouseLeave={revertColor} style={{ textDecoration: 'none', color: "#A5A2A2" }}>
                PROFILE
              </Link>
            </Nav.Link>
            <Nav />
          </Nav>
          <SearchBar />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

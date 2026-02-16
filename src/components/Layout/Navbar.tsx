import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';

// Import icons dengan cara yang benar
import { FaHome, FaDoorOpen, FaCalendarAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <FaHome style={{ marginRight: '8px' }} />
          Room Reservation
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/rooms" 
              active={location.pathname === '/rooms'}
            >
              <FaDoorOpen style={{ marginRight: '4px' }} /> Ruangan
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/bookings" 
              active={location.pathname === '/bookings'}
            >
              <FaCalendarAlt style={{ marginRight: '4px' }} /> Peminjaman
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
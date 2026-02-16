import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container className="mt-4">
        {children}
      </Container>
    </>
  );
};

export default Layout;
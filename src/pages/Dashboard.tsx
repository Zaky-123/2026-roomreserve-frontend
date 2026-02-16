import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaDoorOpen, FaCalendarCheck, FaClock, FaUsers } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <Row>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <FaDoorOpen size={40} style={{ color: '#0d6efd', marginBottom: '8px' }} />
              <Card.Title>Total Ruangan</Card.Title>
              <h3>0</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <FaCalendarCheck size={40} style={{ color: '#198754', marginBottom: '8px' }} />
              <Card.Title>Peminjaman Aktif</Card.Title>
              <h3>0</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <FaClock size={40} style={{ color: '#ffc107', marginBottom: '8px' }} />
              <Card.Title>Menunggu</Card.Title>
              <h3>0</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <FaUsers size={40} style={{ color: '#0dcaf0', marginBottom: '8px' }} />
              <Card.Title>Total Peminjam</Card.Title>
              <h3>0</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
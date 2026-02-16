import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import BookingList from '../components/Booking/BookingList';
import BookingForm from '../components/Booking/BookingForm';
import { Booking } from '../types/booking.types';

const Bookings: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setSelectedBooking(null);
    setShowForm(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowForm(true);
  };

  const handleView = (booking: Booking) => {
    // TODO: Implement detail view
    alert(`Detail booking ${booking.id} - Coming soon`);
  };

  const handleStatusChange = (booking: Booking) => {
    // TODO: Implement status change
    alert(`Ubah status booking ${booking.id} - Coming soon`);
  };

  const handleHistory = (booking: Booking) => {
    // TODO: Implement history view
    alert(`Riwayat booking ${booking.id} - Coming soon`);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manajemen Peminjaman</h1>
        <Button variant="primary" onClick={handleAdd}>
          <FaPlus className="me-2" /> Tambah Peminjaman
        </Button>
      </div>

      <BookingList
        key={refreshKey}
        onEdit={handleEdit}
        onView={handleView}
        onStatusChange={handleStatusChange}
        onHistory={handleHistory}
      />

      <BookingForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSuccess={handleSuccess}
        booking={selectedBooking}
      />
    </Container>
  );
};

export default Bookings;
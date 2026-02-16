import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import BookingList from '../components/Booking/BookingList';
import BookingForm from '../components/Booking/BookingForm';
import BookingStatusModal from '../components/Booking/BookingStatusModal';
import BookingHistoryModal from '../components/Booking/BookingHistoryModal';
import { Booking } from '../types/booking.types';

const Bookings: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
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
    alert(`Detail booking ${booking.id} - Coming soon`);
  };

  const handleStatusChange = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const handleHistory = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowHistoryModal(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setShowStatusModal(false);
    setShowHistoryModal(false);
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

      <BookingStatusModal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        onSuccess={handleSuccess}
        booking={selectedBooking}
      />

      <BookingHistoryModal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        booking={selectedBooking}
      />
    </Container>
  );
};

export default Bookings;
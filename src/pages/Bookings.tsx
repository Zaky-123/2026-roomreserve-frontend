import React, { useState } from 'react';
import { Container, Button, Modal } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import BookingList from '../components/Booking/BookingList';
import { Booking } from '../types/booking.types';

const Bookings: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'status' | 'history'>('view');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setSelectedBooking(null);
    setModalType('edit');
    setShowModal(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('edit');
    setShowModal(true);
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('view');
    setShowModal(true);
  };

  const handleStatusChange = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('status');
    setShowModal(true);
  };

  const handleHistory = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType('history');
    setShowModal(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowModal(false);
  };

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'view' && 'Detail Peminjaman'}
            {modalType === 'edit' && (selectedBooking ? 'Edit Peminjaman' : 'Tambah Peminjaman Baru')}
            {modalType === 'status' && 'Ubah Status Peminjaman'}
            {modalType === 'history' && 'Riwayat Perubahan Status'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'view' && selectedBooking && (
            <div>
              <p><strong>ID:</strong> {selectedBooking.id}</p>
              <p><strong>Ruangan:</strong> {selectedBooking.roomName} ({selectedBooking.roomCode})</p>
              <p><strong>Peminjam:</strong> {selectedBooking.borrowerName}</p>
              <p><strong>Email:</strong> {selectedBooking.borrowerEmail}</p>
              <p><strong>Telepon:</strong> {selectedBooking.borrowerPhone}</p>
              <p><strong>Waktu Mulai:</strong> {new Date(selectedBooking.startTime).toLocaleString('id-ID')}</p>
              <p><strong>Waktu Selesai:</strong> {new Date(selectedBooking.endTime).toLocaleString('id-ID')}</p>
              <p><strong>Tujuan:</strong> {selectedBooking.purpose || '-'}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Dibuat:</strong> {new Date(selectedBooking.createdAt).toLocaleString('id-ID')}</p>
            </div>
          )}
          {modalType === 'edit' && (
            <p className="text-muted">Form booking akan dibuat di issue berikutnya</p>
          )}
          {modalType === 'status' && (
            <p className="text-muted">Form status akan dibuat di issue berikutnya</p>
          )}
          {modalType === 'history' && (
            <p className="text-muted">Riwayat akan dibuat di issue berikutnya</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
          {modalType === 'edit' && (
            <Button variant="primary" onClick={handleSuccess}>
              Simpan (Coming Soon)
            </Button>
          )}
          {modalType === 'status' && (
            <Button variant="warning" onClick={handleSuccess}>
              Update Status (Coming Soon)
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
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

      {renderModal()}
    </Container>
  );
};

export default Bookings;
import React, { useState, useEffect } from 'react';
import { Modal, Table, Badge, Spinner, Button } from 'react-bootstrap';
import { bookingService } from '../../services/bookingService';
import { Booking, BookingHistory } from '../../types/booking.types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface BookingHistoryModalProps {
  show: boolean;
  onHide: () => void;
  booking: Booking | null;
}

const BookingHistoryModal: React.FC<BookingHistoryModalProps> = ({ 
  show, 
  onHide, 
  booking 
}) => {
  const [history, setHistory] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!booking || !show) return;

      try {
        setLoading(true);
        const data = await bookingService.getBookingHistory(booking.id);
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Gagal mengambil riwayat perubahan');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [booking, show]);

  const getStatusText = (status: string | null): string => {
    if (!status) return '-';
    
    const texts: Record<string, string> = {
      Pending: 'Menunggu',
      Approved: 'Disetujui',
      Rejected: 'Ditolak',
      Cancelled: 'Dibatalkan',
      Completed: 'Selesai'
    };
    return texts[status] || status;
  };

  const getStatusVariant = (status: string | null): string => {
    if (!status) return 'light';
    
    const variants: Record<string, string> = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
      Cancelled: 'secondary',
      Completed: 'info'
    };
    return variants[status] || 'light';
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm:ss', { locale: id });
    } catch {
      return dateString;
    }
  };

  if (!booking) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-info text-white">
        <Modal.Title>📋 Riwayat Perubahan Status</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {/* Info Booking */}
        <div className="mb-3 p-3 border rounded bg-light">
          <p className="mb-1"><strong>Ruangan:</strong> {booking.roomName} ({booking.roomCode})</p>
          <p className="mb-1"><strong>Peminjam:</strong> {booking.borrowerName}</p>
          <p className="mb-0"><strong>Status Saat Ini:</strong> {booking.status}</p>
        </div>

        {/* Table History */}
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="info" />
            <p className="mt-2">Memuat riwayat...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : history.length === 0 ? (
          <div className="alert alert-info">
            Belum ada riwayat perubahan status
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Status Lama</th>
                <th>Status Baru</th>
                <th>Catatan</th>
                <th>Diubah Oleh</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{formatDateTime(item.changedAt)}</td>
                  <td>
                    {item.oldStatus ? (
                      <Badge bg={getStatusVariant(item.oldStatus)}>
                        {getStatusText(item.oldStatus)}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <Badge bg={getStatusVariant(item.newStatus)}>
                      {getStatusText(item.newStatus)}
                    </Badge>
                  </td>
                  <td>{item.notes || '-'}</td>
                  <td>{item.changedBy || 'System'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingHistoryModal;
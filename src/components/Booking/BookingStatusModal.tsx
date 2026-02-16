import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { bookingService } from '../../services/bookingService';
import { Booking, BookingStatus, UpdateStatusDto } from '../../types/booking.types';

interface BookingStatusModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  booking: Booking | null;
}

interface ApiError {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}

const BookingStatusModal: React.FC<BookingStatusModalProps> = ({ 
  show, 
  onHide, 
  onSuccess, 
  booking 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Reset state ketika modal dibuka
  React.useEffect(() => {
    if (show) {
      setSelectedStatus('');
      setNotes('');
      setError('');
      setValidationError('');
    }
  }, [show]);

  if (!booking) return null;

  // Tentukan status yang tersedia berdasarkan status saat ini
  const getAvailableStatuses = (currentStatus: BookingStatus): BookingStatus[] => {
    const statusMap: Record<BookingStatus, BookingStatus[]> = {
      Pending: ['Approved', 'Rejected', 'Cancelled'],
      Approved: ['Completed', 'Cancelled'],
      Rejected: [],
      Cancelled: [],
      Completed: []
    };
    return statusMap[currentStatus] || [];
  };

  const availableStatuses = getAvailableStatuses(booking.status);

  const getStatusText = (status: BookingStatus): string => {
    const texts: Record<BookingStatus, string> = {
      Pending: 'Menunggu',
      Approved: 'Disetujui',
      Rejected: 'Ditolak',
      Cancelled: 'Dibatalkan',
      Completed: 'Selesai'
    };
    return texts[status] || status;
  };

  const getStatusVariant = (status: BookingStatus): string => {
    const variants: Record<BookingStatus, string> = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
      Cancelled: 'secondary',
      Completed: 'info'
    };
    return variants[status] || 'light';
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as BookingStatus);
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      setValidationError('Silakan pilih status baru');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updateData: UpdateStatusDto = {
        newStatus: selectedStatus as BookingStatus,
        notes: notes.trim() || undefined
      };

      await bookingService.updateStatus(booking.id, updateData);
      
      setTimeout(() => {
        onSuccess();
        onHide();
      }, 500);
      
    } catch (err: any) {
      console.error('Error updating status:', err);
      
      if (err.response) {
        const responseData = err.response.data as ApiError;
        const statusCode = err.response.status;
        
        if (statusCode === 400) {
          if (responseData.errors) {
            // Handle validation errors
            const errorMessages: string[] = [];
            Object.keys(responseData.errors).forEach(key => {
              const messages = responseData.errors?.[key];
              if (messages && messages.length > 0) {
                errorMessages.push(messages[0]);
              }
            });
            setError(errorMessages.join('\n') || 'Tidak dapat mengubah status');
          } else if (responseData.title) {
            setError(responseData.title);
          } else {
            setError('Tidak dapat mengubah status');
          }
        } else {
          setError(responseData?.title || 'Terjadi kesalahan');
        }
      } else if (err.request) {
        setError('Tidak dapat terhubung ke server');
      } else {
        setError(err.message || 'Terjadi kesalahan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-warning">
        <Modal.Title>🔄 Ubah Status Peminjaman</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Info Booking */}
          <div className="mb-3 p-3 border rounded bg-light">
            <p className="mb-1"><strong>Ruangan:</strong> {booking.roomName} ({booking.roomCode})</p>
            <p className="mb-1"><strong>Peminjam:</strong> {booking.borrowerName}</p>
            <p className="mb-1"><strong>Waktu:</strong> {new Date(booking.startTime).toLocaleString('id-ID')} - {new Date(booking.endTime).toLocaleString('id-ID')}</p>
            <p className="mb-0">
              <strong>Status Saat Ini:</strong>{' '}
              <span className={`badge bg-${getStatusVariant(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {/* Status Selection */}
          <Form.Group className="mb-3">
            <Form.Label>
              Pilih Status Baru <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={selectedStatus}
              onChange={handleStatusChange}
              isInvalid={!!validationError}
              disabled={availableStatuses.length === 0}
            >
              <option value="">-- Pilih Status --</option>
              {availableStatuses.map(status => (
                <option key={status} value={status}>
                  {getStatusText(status)}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {validationError}
            </Form.Control.Feedback>
            {availableStatuses.length === 0 && (
              <Form.Text className="text-warning">
                Tidak ada status yang tersedia untuk diubah
              </Form.Text>
            )}
          </Form.Group>

          {/* Notes */}
          <Form.Group className="mb-3">
            <Form.Label>Catatan (Opsional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan atau alasan perubahan status..."
              maxLength={500}
            />
            <Form.Text className="text-muted">
              {notes.length}/500 karakter
            </Form.Text>
          </Form.Group>

          {/* Info Flow */}
          <Alert variant="info" className="mb-0">
            <small>
              <strong>Alur Status yang Valid:</strong><br/>
              • Pending → Approved / Rejected / Cancelled<br/>
              • Approved → Completed / Cancelled<br/>
              • Rejected / Cancelled / Completed (final)
            </small>
          </Alert>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Batal
          </Button>
          <Button 
            variant="warning" 
            type="submit" 
            disabled={loading || availableStatuses.length === 0 || !selectedStatus}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Mengubah...
              </>
            ) : (
              'Ubah Status'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BookingStatusModal;
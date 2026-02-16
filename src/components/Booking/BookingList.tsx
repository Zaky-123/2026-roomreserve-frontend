import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Row, Col, Pagination } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaCheck, FaHistory } from 'react-icons/fa';
import { bookingService } from '../../services/bookingService';
import { Booking, BookingFilter, BookingStatus } from '../../types/booking.types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface BookingListProps {
  onEdit: (booking: Booking) => void;
  onView: (booking: Booking) => void;
  onStatusChange: (booking: Booking) => void;
  onHistory: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

const BookingList: React.FC<BookingListProps> = ({ 
  onEdit, 
  onView, 
  onStatusChange, 
  onHistory,
  onDelete 
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<BookingFilter>({
    page: 1,
    pageSize: 10,
    sortBy: 'startTime',
    sortOrder: 'desc'
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookings(filter);
      setBookings(response.items);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter.page, filter.sortBy, filter.sortOrder]);

  // Fetch rooms for filter dropdown
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { roomService } = await import('../../services/roomService');
        const response = await roomService.getRooms('', 1, 100);
        setRooms(response.items.map(r => ({ id: r.id, name: r.name })));
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value,
      page: 1
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value,
      page: 1
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  }

  const handlePageChange = (newPage: number) => {
    setFilter(prev => ({ ...prev, page: newPage }));
  };

  const getStatusBadge = (status: BookingStatus) => {
    const variants: Record<BookingStatus, string> = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
      Cancelled: 'secondary',
      Completed: 'info'
    };
    return variants[status] || 'light';
  };

  const getStatusText = (status: BookingStatus) => {
    const texts: Record<BookingStatus, string> = {
      Pending: 'Menunggu',
      Approved: 'Disetujui',
      Rejected: 'Ditolak',
      Cancelled: 'Dibatalkan',
      Completed: 'Selesai'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: id });
    } catch {
      return dateString;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Daftar Peminjaman {totalCount > 0 && `(${totalCount} data)`}</h5>
      </div>

      {/* Filter Section */}
      <Form onSubmit={handleSearch} className="mb-4 p-3 border rounded bg-light">
        <Row>
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Cari</Form.Label>
              <Form.Control
                type="text"
                name="search"
                value={filter.search || ''}
                onChange={handleInputChange}
                placeholder="Nama/Email/Tujuan..."
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-2">
              <Form.Label>Ruangan</Form.Label>
              <Form.Select
                name="roomId"
                value={filter.roomId || ''}
                onChange={handleSelectChange}
              >
                <option value="">Semua Ruangan</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={filter.status || ''}
                onChange={handleSelectChange}
              >
                <option value="">Semua Status</option>
                <option value="Pending">Menunggu</option>
                <option value="Approved">Disetujui</option>
                <option value="Rejected">Ditolak</option>
                <option value="Cancelled">Dibatalkan</option>
                <option value="Completed">Selesai</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-2">
              <Form.Label>Tanggal Mulai</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={filter.startDate || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-2">
              <Form.Label>Tanggal Selesai</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={filter.endDate || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={1}>
            <Form.Group className="mb-2">
              <Form.Label>&nbsp;</Form.Label>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-100"
                disabled={loading}
              >
                {loading ? '...' : 'Filter'}
              </Button>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Ruangan</th>
            <th>Peminjam</th>
            <th>Kontak</th>
            <th>Waktu Mulai</th>
            <th>Waktu Selesai</th>
            <th>Tujuan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Memuat data...</p>
              </td>
            </tr>
          ) : bookings.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                <p className="mb-0">Belum ada data peminjaman</p>
                <small className="text-muted">Gunakan tombol "Tambah Peminjaman" untuk menambah data</small>
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <strong>{booking.roomCode}</strong><br />
                  <small className="text-muted">{booking.roomName}</small>
                </td>
                <td>
                  <strong>{booking.borrowerName}</strong><br />
                  <small className="text-muted">{booking.borrowerEmail}</small>
                </td>
                <td>{booking.borrowerPhone}</td>
                <td>{formatDate(booking.startTime)}</td>
                <td>{formatDate(booking.endTime)}</td>
                <td>{booking.purpose || '-'}</td>
                <td>
                  <Badge bg={getStatusBadge(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => onView(booking)}
                      title="Detail"
                    >
                      <FaEye />
                    </Button>
                    
                    {booking.status === 'Pending' && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onEdit(booking)}
                        title="Edit"
                      >
                        <FaEdit />
                      </Button>
                    )}
                    
                    {(booking.status === 'Pending' || booking.status === 'Approved') && (
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => onStatusChange(booking)}
                        title="Ubah Status"
                      >
                        <FaCheck />
                      </Button>
                    )}
                    
                    {booking.status === 'Pending' && (
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(booking)}
                        title="Hapus"
                    >
                        <FaTrash />
                    </Button>
                    )}
                    
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => onHistory(booking)}
                      title="Riwayat"
                    >
                      <FaHistory />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(filter.page! - 1)}
              disabled={filter.page === 1}
            />
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === filter.page}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}
            {totalPages > 5 && <Pagination.Ellipsis />}
            <Pagination.Next
              onClick={() => handlePageChange(filter.page! + 1)}
              disabled={filter.page === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default BookingList;
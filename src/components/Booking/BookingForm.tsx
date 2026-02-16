import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { bookingService } from '../../services/bookingService';
import { roomService } from '../../services/roomService';
import { Booking, CreateBookingDto, UpdateBookingDto } from '../../types/booking.types';
import { Room } from '../../types/room.types';
import { format } from 'date-fns';

// Interface definitions
interface BookingFormProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  booking?: Booking | null;
}

interface FormErrors {
  [key: string]: string;
}

interface ApiError {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ show, onHide, onSuccess, booking }) => {
  const [formData, setFormData] = useState<CreateBookingDto>({
    roomId: 0,
    borrowerName: '',
    borrowerEmail: '',
    borrowerPhone: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Reset form ketika modal dibuka
  useEffect(() => {
    if (booking) {
      // Mode edit
      setFormData({
        roomId: booking.roomId,
        borrowerName: booking.borrowerName,
        borrowerEmail: booking.borrowerEmail,
        borrowerPhone: booking.borrowerPhone,
        startTime: format(new Date(booking.startTime), "yyyy-MM-dd'T'HH:mm"),
        endTime: format(new Date(booking.endTime), "yyyy-MM-dd'T'HH:mm"),
        purpose: booking.purpose || ''
      });
    } else {
      // Mode tambah - set default waktu (besok jam 09:00 - 10:00)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const startDefault = new Date(tomorrow);
      startDefault.setHours(9, 0, 0, 0);
      
      const endDefault = new Date(tomorrow);
      endDefault.setHours(10, 0, 0, 0);
      
      setFormData({
        roomId: 0,
        borrowerName: '',
        borrowerEmail: '',
        borrowerPhone: '',
        startTime: format(startDefault, "yyyy-MM-dd'T'HH:mm"),
        endTime: format(endDefault, "yyyy-MM-dd'T'HH:mm"),
        purpose: ''
      });
    }
    
    // Reset errors
    setErrors({});
    setGeneralError('');
  }, [booking, show]);

  // Fetch rooms untuk dropdown
  useEffect(() => {
    const fetchRooms = async () => {
      if (!show) return;
      
      try {
        setLoadingRooms(true);
        const response = await roomService.getRooms('', 1, 100);
        // Hanya tampilkan ruangan yang Available
        const availableRooms = response.items.filter(room => room.status === 'Available');
        setRooms(availableRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setGeneralError('Gagal mengambil data ruangan');
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roomId' ? parseInt(value) || 0 : value
    }));
    
    // Hapus error untuk field yang diubah
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const now = new Date();
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    // Validasi room
    if (!formData.roomId || formData.roomId === 0) {
      newErrors.roomId = 'Ruangan wajib dipilih';
    }

    // Validasi nama
    if (!formData.borrowerName.trim()) {
      newErrors.borrowerName = 'Nama peminjam wajib diisi';
    } else if (formData.borrowerName.length > 100) {
      newErrors.borrowerName = 'Nama maksimal 100 karakter';
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.borrowerEmail.trim()) {
      newErrors.borrowerEmail = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.borrowerEmail)) {
      newErrors.borrowerEmail = 'Format email tidak valid';
    }

    // Validasi telepon
    const phoneRegex = /^[0-9]{10,13}$/;
    if (!formData.borrowerPhone.trim()) {
      newErrors.borrowerPhone = 'Nomor telepon wajib diisi';
    } else if (!phoneRegex.test(formData.borrowerPhone.replace(/\D/g, ''))) {
      newErrors.borrowerPhone = 'Nomor telepon harus 10-13 digit angka';
    }

    // Validasi waktu
    if (!formData.startTime) {
      newErrors.startTime = 'Waktu mulai wajib diisi';
    } else if (new Date(formData.startTime) < now) {
      newErrors.startTime = 'Waktu mulai tidak boleh di masa lalu';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Waktu selesai wajib diisi';
    } else if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'Waktu selesai harus setelah waktu mulai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrors({});
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (booking) {
        // Mode Update
        const updateData: UpdateBookingDto = {
          id: booking.id,
          ...formData
        };
        await bookingService.updateBooking(booking.id, updateData);
      } else {
        // Mode Create
        await bookingService.createBooking(formData);
      }
      
      setTimeout(() => {
        onSuccess();
        onHide();
      }, 500);
      
    } catch (error: any) {
      console.error('Error saving booking:', error);
      
      if (error.response) {
        const responseData = error.response.data as ApiError;
        const statusCode = error.response.status;
        
        if (statusCode === 400) {
          // Validation errors
          if (responseData.errors) {
            const validationErrors: FormErrors = {};
            Object.keys(responseData.errors).forEach(key => {
              const messages = responseData.errors?.[key];
              if (messages && messages.length > 0) {
                // Map field names dari backend ke frontend
                const fieldMap: Record<string, string> = {
                  'roomId': 'roomId',
                  'borrowerName': 'borrowerName',
                  'borrowerEmail': 'borrowerEmail',
                  'borrowerPhone': 'borrowerPhone',
                  'startTime': 'startTime',
                  'endTime': 'endTime',
                  'purpose': 'purpose'
                };
                const fieldName = fieldMap[key] || key;
                validationErrors[fieldName] = messages[0];
              }
            });
            setErrors(validationErrors);
          } else if (responseData.title) {
            setGeneralError(responseData.title);
          } else {
            setGeneralError('Data yang dimasukkan tidak valid');
          }
        } else if (statusCode === 409) {
          setGeneralError('Ruangan sudah dipesan pada waktu tersebut');
        } else {
          setGeneralError(responseData?.title || 'Terjadi kesalahan');
        }
      } else if (error.request) {
        setGeneralError('Tidak dapat terhubung ke server');
      } else {
        setGeneralError(error.message || 'Terjadi kesalahan');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          {booking ? '✏️ Edit Peminjaman' : '➕ Tambah Peminjaman Baru'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* General Error */}
          {generalError && (
            <Alert variant="danger" onClose={() => setGeneralError('')} dismissible>
              {generalError}
            </Alert>
          )}

          {/* Room Selection */}
          <Form.Group className="mb-3">
            <Form.Label>
              Ruangan <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              isInvalid={!!errors.roomId}
              disabled={loadingRooms}
            >
              <option value={0}>-- Pilih Ruangan --</option>
              {loadingRooms ? (
                <option disabled>Loading ruangan...</option>
              ) : (
                rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.code} - {room.name} (Kap. {room.capacity})
                  </option>
                ))
              )}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.roomId}
            </Form.Control.Feedback>
            {rooms.length === 0 && !loadingRooms && (
              <Form.Text className="text-warning">
                Tidak ada ruangan tersedia saat ini
              </Form.Text>
            )}
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Nama Peminjam <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="borrowerName"
                  value={formData.borrowerName}
                  onChange={handleChange}
                  placeholder="Contoh: John Doe"
                  isInvalid={!!errors.borrowerName}
                  maxLength={100}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.borrowerName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="borrowerEmail"
                  value={formData.borrowerEmail}
                  onChange={handleChange}
                  placeholder="contoh@email.com"
                  isInvalid={!!errors.borrowerEmail}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.borrowerEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              Nomor Telepon <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="tel"
              name="borrowerPhone"
              value={formData.borrowerPhone}
              onChange={handleChange}
              placeholder="08123456789"
              isInvalid={!!errors.borrowerPhone}
              maxLength={13}
            />
            <Form.Control.Feedback type="invalid">
              {errors.borrowerPhone}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Masukkan 10-13 digit angka
            </Form.Text>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Waktu Mulai <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  isInvalid={!!errors.startTime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startTime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Waktu Selesai <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  isInvalid={!!errors.endTime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.endTime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Tujuan Peminjaman</Form.Label>
            <Form.Control
              as="textarea"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Contoh: Rapat tim proyek, Seminar, dll"
              rows={3}
              maxLength={500}
              isInvalid={!!errors.purpose}
            />
            <Form.Control.Feedback type="invalid">
              {errors.purpose}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {formData.purpose?.length || 0}/500 karakter
            </Form.Text>
          </Form.Group>

          {booking && (
            <Alert variant="info">
              <small>
                <strong>Status saat ini:</strong> {booking.status}<br/>
                <strong>Catatan:</strong> Edit hanya bisa dilakukan jika status masih Pending
              </small>
            </Alert>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Menyimpan...
              </>
            ) : (
              booking ? 'Update Peminjaman' : 'Simpan Peminjaman'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BookingForm;
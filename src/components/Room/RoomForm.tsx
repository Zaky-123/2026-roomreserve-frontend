import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { roomService } from '../../services/roomService';
import { Room, CreateRoomDto, UpdateRoomDto } from '../../types/room.types';

// Type untuk error response dari API
interface ApiError {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}

interface ValidationError {
  [key: string]: string;
}

interface RoomFormProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  room?: Room | null;
}

const RoomForm: React.FC<RoomFormProps> = ({ show, onHide, onSuccess, room }) => {
  const [formData, setFormData] = useState<CreateRoomDto>({
    code: '',
    name: '',
    capacity: 0,
    location: '',
    description: ''
  });
  const [status, setStatus] = useState<'Available' | 'UnderMaintenance' | 'Occupied'>('Available');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});
  const [generalError, setGeneralError] = useState<string>('');

  // Reset form ketika modal dibuka atau room berubah
  useEffect(() => {
    console.log('Modal opened, room:', room); // DEBUG
    if (room) {
      // Mode edit: isi dengan data room
      setFormData({
        code: room.code,
        name: room.name,
        capacity: room.capacity,
        location: room.location,
        description: room.description || ''
      });
      setStatus(room.status);
    } else {
      // Mode tambah: reset ke default
      setFormData({
        code: '',
        name: '',
        capacity: 0,
        location: '',
        description: ''
      });
      setStatus('Available');
    }
    // Reset errors ketika modal dibuka
    setErrors({});
    setGeneralError('');
  }, [room, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Field changed:', name, value); // DEBUG
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
    
    // Hapus error untuk field yang sedang diisi
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'Kode ruangan wajib diisi';
    } else if (formData.code.length < 2 || formData.code.length > 10) {
      newErrors.code = 'Kode ruangan harus antara 2-10 karakter';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama ruangan wajib diisi';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Nama ruangan maksimal 100 karakter';
    }
    
    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Kapasitas harus lebih dari 0';
    } else if (formData.capacity > 500) {
      newErrors.capacity = 'Kapasitas maksimal 500 orang';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi wajib diisi';
    } else if (formData.location.length > 200) {
      newErrors.location = 'Lokasi maksimal 200 karakter';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Deskripsi maksimal 500 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FORM SUBMIT ===');
    console.log('Form data:', formData);
    console.log('Room mode:', room ? 'edit' : 'create');
    console.log('Status value:', status);
    
    // Reset errors
    setErrors({});
    setGeneralError('');

    // Validasi form
    if (!validateForm()) {
        console.log('Validation failed');
        return;
    }

    try {
        setLoading(true);
        
        if (room) {
            // Mapping status string ke number
            const statusMap = {
                'Available': 0,
                'UnderMaintenance': 1,
                'Occupied': 2
            };

            // Mode Update - Kirim SEMUA field dengan status sebagai number
            const updateData = {
                id: room.id,
                code: formData.code,                    // Wajib
                name: formData.name,                     // Wajib
                capacity: formData.capacity,              // Wajib
                location: formData.location,               // Wajib
                description: formData.description || '',   // Optional
                status: statusMap[status]                  // ✅ KIRIM ANGKA (0,1,2)
            };
            
            console.log('Sending update data:', updateData);
            console.log('Status as number:', statusMap[status]);
            console.log('ID from room:', room.id);
            console.log('ID in data:', updateData.id);
            
            // Validasi ID match sebelum kirim
            if (room.id !== updateData.id) {
                console.error('ID mismatch in data preparation!');
                setGeneralError('Terjadi kesalahan internal');
                return;
            }
            
            const result = await roomService.updateRoom(room.id, updateData);
            console.log('Update result:', result);
            
        } else {
        // Mode Create
        console.log('Creating new room:', formData);
        const result = await roomService.createRoom(formData);
        console.log('Create result:', result);
        }
        
        console.log('Operation successful');
        
        setTimeout(() => {
        onSuccess();
        onHide();
        }, 500);
        
    } catch (error: any) {
        console.error('=== ERROR CAUGHT ===');
        console.error('Error:', error);
        
        if (error.response) {
        const responseData = error.response.data;
        const statusCode = error.response.status;
        
        console.error('Response data:', responseData);
        console.error('Status code:', statusCode);
        
        if (statusCode === 400) {
            // Handle validation errors
            if (responseData.errors) {
            const validationErrors: ValidationError = {};
            
            // ASP.NET validation errors format
            Object.keys(responseData.errors).forEach(key => {
                const messages = responseData.errors[key];
                if (messages && messages.length > 0) {
                // Map field names
                const fieldName = key.toLowerCase();
                validationErrors[fieldName] = messages[0];
                }
            });
            
            setErrors(validationErrors);
            
            // Jika ada general error
            if (responseData.title) {
                setGeneralError(responseData.title);
            }
            } else if (typeof responseData === 'string') {
            setGeneralError(responseData);
            } else {
            setGeneralError('Data yang dimasukkan tidak valid');
            }
        } else if (statusCode === 409) {
            setGeneralError('Kode ruangan sudah digunakan');
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
          {room ? '✏️ Edit Ruangan' : '➕ Tambah Ruangan Baru'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* General Error Alert */}
          {generalError && (
            <Alert 
              variant="danger" 
              onClose={() => setGeneralError('')} 
              dismissible
              className="mb-3"
            >
              <Alert.Heading>Error</Alert.Heading>
              <p>{generalError}</p>
            </Alert>
          )}
          
          {/* Form Fields */}
          <Form.Group className="mb-3">
            <Form.Label>
              Kode Ruangan <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Contoh: R101, LAB01, A203"
              isInvalid={!!errors.code}
              disabled={!!room} // Tidak bisa edit kode jika mode update
              maxLength={10}
            />
            <Form.Control.Feedback type="invalid">
              {errors.code}
            </Form.Control.Feedback>
            {!room && (
              <Form.Text className="text-muted">
                Kode ruangan unik dan tidak bisa diubah setelah dibuat
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Nama Ruangan <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Ruang Seminar A, Lab Komputer"
              isInvalid={!!errors.name}
              maxLength={100}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Kapasitas <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={formData.capacity || ''}
              onChange={handleChange}
              placeholder="Jumlah orang"
              min="1"
              max="500"
              isInvalid={!!errors.capacity}
            />
            <Form.Control.Feedback type="invalid">
              {errors.capacity}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Maksimal 500 orang
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Lokasi <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Contoh: Gedung A Lantai 1, Ruang 102"
              isInvalid={!!errors.location}
              maxLength={200}
            />
            <Form.Control.Feedback type="invalid">
              {errors.location}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi tambahan (opsional)"
              rows={3}
              maxLength={500}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              {formData.description?.length || 0}/500 karakter
            </Form.Text>
          </Form.Group>

          {room && (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => {
                  console.log('Status changed:', e.target.value); // DEBUG
                  setStatus(e.target.value as any);
                }}
              >
                <option value="Available">✅ Tersedia</option>
                <option value="UnderMaintenance">🔧 Dalam Perawatan</option>
                <option value="Occupied">📌 Sedang Dipakai</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Ubah status ruangan jika diperlukan
              </Form.Text>
            </Form.Group>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={onHide}
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Menyimpan...
              </>
            ) : (
              room ? 'Update Ruangan' : 'Simpan Ruangan'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RoomForm;
import React from 'react';
import { Button, Table, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Bookings: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
      Cancelled: 'secondary',
      Completed: 'info'
    };
    return variants[status] || 'light';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manajemen Peminjaman</h1>
        <Button variant="primary">
          <FaPlus style={{ marginRight: '8px' }} /> Tambah Peminjaman
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ruangan</th>
            <th>Peminjam</th>
            <th>Waktu Mulai</th>
            <th>Waktu Selesai</th>
            <th>Tujuan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={7} className="text-center">
              Belum ada data peminjaman
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Bookings;
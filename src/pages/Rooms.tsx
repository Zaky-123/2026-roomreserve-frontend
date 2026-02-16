import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Rooms: React.FC = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manajemen Ruangan</h1>
        <Button variant="primary">
          <FaPlus style={{ marginRight: '8px' }} /> Tambah Ruangan
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Nama Ruangan</th>
            <th>Kapasitas</th>
            <th>Lokasi</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={6} className="text-center">
              Belum ada data ruangan
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Rooms;
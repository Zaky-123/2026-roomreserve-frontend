import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Form, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { roomService } from '../../services/roomService';
import { Room } from '../../types/room.types';

interface RoomListProps {
  onEdit: (room: Room) => void;
  onAdd: () => void;
}

const RoomList: React.FC<RoomListProps> = ({ onEdit, onAdd }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getRooms(search, page, 10);
      setRooms(response.items);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRooms();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
      try {
        await roomService.deleteRoom(id);
        fetchRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Available: 'success',
      UnderMaintenance: 'warning',
      Occupied: 'danger'
    };
    return variants[status] || 'light';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      Available: 'Tersedia',
      UnderMaintenance: 'Dalam Perawatan',
      Occupied: 'Sedang Dipakai'
    };
    return texts[status] || status;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Daftar Ruangan ({totalCount} ruangan)</h5>
        <Button variant="primary" size="sm" onClick={onAdd}>
          <FaPlus className="me-2" /> Tambah Ruangan
        </Button>
      </div>

      <Form onSubmit={handleSearch} className="mb-3">
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Cari berdasarkan nama, kode, atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="outline-primary">
            <FaSearch />
          </Button>
        </div>
      </Form>

      <Table striped bordered hover responsive>
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
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center">Loading...</td>
            </tr>
          ) : rooms.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                Belum ada data ruangan
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.code}</td>
                <td>{room.name}</td>
                <td>{room.capacity} orang</td>
                <td>{room.location}</td>
                <td>
                  <Badge bg={getStatusBadge(room.status)}>
                    {getStatusText(room.status)}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(room)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(room.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Pagination.Item
                key={p}
                active={p === page}
                onClick={() => setPage(p)}
              >
                {p}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default RoomList;
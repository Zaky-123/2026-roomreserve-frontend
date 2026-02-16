import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import RoomList from '../components/Room/RoomList';
import RoomForm from '../components/Room/RoomForm';
import { Room } from '../types/room.types';

const Rooms: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setSelectedRoom(null);
    setShowModal(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container>
      <h1 className="mb-4">Manajemen Ruangan</h1>
      
      <RoomList
        key={refreshKey}
        onEdit={handleEdit}
        onAdd={handleAdd}
      />

      <RoomForm
        show={showModal}
        onHide={() => setShowModal(false)}
        onSuccess={handleSuccess}
        room={selectedRoom}
      />
    </Container>
  );
};

export default Rooms;
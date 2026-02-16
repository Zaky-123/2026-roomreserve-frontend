import api from './api';
import { Room, CreateRoomDto, UpdateRoomDto, RoomResponse } from '../types/room.types';

export const roomService = {
  // Get all rooms with pagination and search
  getRooms: async (search?: string, page: number = 1, pageSize: number = 10) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    const response = await api.get<RoomResponse>(`/rooms?${params}`);
    return response.data;
  },

  // Get room by ID
  getRoomById: async (id: number) => {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  // Create new room
  createRoom: async (data: CreateRoomDto) => {
    console.log('Creating room with data:', data);
    const response = await api.post<Room>('/rooms', data);
    console.log('Create response:', response.data);
    return response.data;
  },

  // Update room
  updateRoom: async (id: number, data: UpdateRoomDto) => {
    console.log('=== UPDATE REQUEST ===');
    console.log('URL:', `/rooms/${id}`);
    console.log('Data being sent:', JSON.stringify(data, null, 2));
    console.log('ID from URL:', id);
    console.log('ID from body:', data.id);
    
    // Validasi ID match
    if (id !== data.id) {
      console.error('ID mismatch!');
      throw new Error('ID mismatch');
    }
    
    try {
      const response = await api.put(`/rooms/${id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update response status:', response.status);
      console.log('Update response data:', response.data);
      console.log('=== UPDATE SUCCESS ===');
      
      return { success: true, message: 'Room updated successfully' };
      
    } catch (error: any) {
      console.error('=== UPDATE ERROR ===');
      console.error('Error details:', error);
      
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        console.error('Error headers:', error.response.headers);
        
        // Throw dengan format yang bisa ditangkap component
        throw {
          response: {
            status: error.response.status,
            data: error.response.data
          }
        };
      }
      
      throw error;
    }
  },

  // Delete room (soft delete)
  deleteRoom: async (id: number) => {
    console.log('Deleting room:', id);
    const response = await api.delete(`/rooms/${id}`);
    console.log('Delete response:', response);
    return { success: true, message: 'Room deleted successfully' };
  },
};
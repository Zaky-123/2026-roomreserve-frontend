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
    const response = await api.post<Room>('/rooms', data);
    return response.data;
  },

  // Update room
  updateRoom: async (id: number, data: UpdateRoomDto) => {
    const response = await api.put(`/rooms/${id}`, data);
    return response.data;
  },

  // Delete room (soft delete)
  deleteRoom: async (id: number) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
};
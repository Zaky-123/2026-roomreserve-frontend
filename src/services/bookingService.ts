import api from './api';
import { 
  Booking, 
  CreateBookingDto, 
  UpdateBookingDto, 
  UpdateStatusDto,
  BookingHistory,
  BookingResponse,
  BookingFilter 
} from '../types/booking.types';

export const bookingService = {
  // Get all bookings with filters
  getBookings: async (filter: BookingFilter = {}) => {
    const params = new URLSearchParams();
    
    if (filter.roomId) params.append('roomId', filter.roomId.toString());
    if (filter.status) params.append('status', filter.status);
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);
    if (filter.search) params.append('search', filter.search);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());
    
    const response = await api.get<BookingResponse>(`/bookings?${params}`);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (id: number) => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  // Create new booking
  createBooking: async (data: CreateBookingDto) => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  // Update booking
  updateBooking: async (id: number, data: UpdateBookingDto) => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },

  // Delete booking (soft delete)
  deleteBooking: async (id: number) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  // Update booking status
  updateStatus: async (id: number, data: UpdateStatusDto) => {
    const response = await api.patch(`/bookings/${id}/status`, data);
    return response.data;
  },

  // Get booking history
  getBookingHistory: async (id: number) => {
    const response = await api.get<BookingHistory[]>(`/bookings/${id}/history`);
    return response.data;
  },
};
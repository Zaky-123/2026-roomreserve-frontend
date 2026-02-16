export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';

export interface Booking {
  id: number;
  roomId: number;
  roomName: string;
  roomCode: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateBookingDto {
  roomId: number;
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
  startTime: string;
  endTime: string;
  purpose?: string;
}

export interface UpdateBookingDto extends CreateBookingDto {
  id: number;
}

export interface UpdateStatusDto {
  newStatus: BookingStatus;
  notes?: string;
}

export interface BookingHistory {
  id: number;
  oldStatus: string | null;
  newStatus: string;
  notes?: string;
  changedAt: string;
  changedBy: string;
}

export interface BookingResponse {
  items: Booking[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface BookingFilter {
  roomId?: number;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
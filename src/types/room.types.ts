export interface Room {
  id: number;
  code: string;
  name: string;
  capacity: number;
  location: string;
  description?: string;
  status: 'Available' | 'UnderMaintenance' | 'Occupied';
  createdAt: string;
}

export interface CreateRoomDto {
  code: string;
  name: string;
  capacity: number;
  location: string;
  description?: string;
}

export interface UpdateRoomDto {
  id: number;
  code: string;
  name: string;
  capacity: number;
  location: string;
  description?: string;
  status: number;  // ✅ Sekarang number (0,1,2)
}

export interface RoomResponse {
  items: Room[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
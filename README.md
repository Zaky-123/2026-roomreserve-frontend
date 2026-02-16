# Room Reservation Frontend

React + TypeScript frontend untuk Sistem Peminjaman Ruangan Kampus.  
Aplikasi ini mengkonsumsi API dari backend ASP.NET Core yang telah dibangun sebelumnya.

## ✨ Fitur (v1.0.0-frontend)

### ✅ Manajemen Ruangan (Room CRUD)
- **List Ruangan** - Tabel daftar ruangan dengan:
  - Kolom: Kode, Nama, Kapasitas, Lokasi, Status, Aksi
  - Status badge dengan warna (Hijau: Tersedia, Kuning: Perawatan, Merah: Dipakai)
  - Search berdasarkan nama/kode/lokasi
  - Pagination untuk navigasi data
  - Tombol Edit dan Delete

- **Tambah Ruangan** - Form modal dengan:
  - Validasi input (required, min/max length, range)
  - Error handling dari backend
  - Loading state saat submit
  - Auto-refresh list setelah sukses

- **Edit Ruangan** - Form modal dengan:
  - Data terisi otomatis
  - Validasi sama seperti create
  - Status dapat diubah (dikirim sebagai number 0/1/2 ke backend)
  - Kode ruangan tidak bisa diubah (readonly)

- **Hapus Ruangan** - Soft delete dengan:
  - Konfirmasi dialog
  - Feedback setelah sukses
  - Auto-refresh list

## ��� Teknologi

- **React 18** - Library UI
- **TypeScript** - Type safety
- **React Bootstrap** - Komponen UI
- **React Router DOM** - Routing
- **Axios** - HTTP client untuk API
- **React Icons** - Icons
- **Date-fns** - Manipulasi tanggal (untuk booking nanti)

## ��� Struktur Folder
src/
├── components/ # Komponen React
│ ├── Room/ # Komponen untuk manajemen ruangan
│ │ ├── RoomList.tsx # Tabel daftar ruangan
│ │ └── RoomForm.tsx # Form tambah/edit ruangan
│ └── Layout/ # Komponen layout
│ ├── Navbar.tsx # Navigasi atas
│ └── Layout.tsx # Layout wrapper
├── pages/ # Halaman utama
│ ├── Dashboard.tsx # Dashboard (belum diisi)
│ ├── Rooms.tsx # Halaman manajemen ruangan
│ └── Bookings.tsx # Halaman peminjaman (coming soon)
├── services/ # API calls
│ ├── api.ts # Konfigurasi axios
│ └── roomService.ts # Service untuk Room API
├── types/ # TypeScript interfaces
│ ├── room.types.ts # Types untuk Room
│ └── booking.types.ts # Types untuk Booking (coming soon)
├── utils/ # Helper functions
├── assets/ # Gambar, CSS
├── App.tsx # Routing utama
└── index.tsx # Entry point
## ��� Instalasi dan Menjalankan

### Prasyarat
- Node.js 16+
- npm atau yarn
- Backend harus berjalan di `http://localhost:5243`

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/Zaky-123/2026-roomreserve-frontend.git
   cd 2026-roomreserve-frontend
Install dependencies

bash
npm install
Setup environment

bash
cp .env.example .env
# Edit .env jika perlu (default sudah指向 backend)
Jalankan backend (di terminal terpisah)

bash
cd ../backend
dotnet run
# Backend akan berjalan di http://localhost:5243
Jalankan frontend

bash
npm start
Akses aplikasi

text
http://localhost:3000
��� Environment Variables
VariableDescriptionDefault
REACT_APP_API_URLBackend API URLhttp://localhost:5243/api
REACT_APP_APP_NAMENama aplikasiRoom Reservation System
��� API Integration
Frontend terhubung dengan backend melalui service layer:

Room Service (roomService.ts)
MethodFungsiEndpoint
getRooms(search, page, pageSize)List ruanganGET /rooms
getRoomById(id)Detail ruanganGET /rooms/{id}
createRoom(data)Tambah ruanganPOST /rooms
updateRoom(id, data)Update ruanganPUT /rooms/{id}
deleteRoom(id)Hapus ruanganDELETE /rooms/{id}
Catatan Penting
Status ruangan dikirim sebagai number: 0 (Available), 1 (UnderMaintenance), 2 (Occupied)

Response 204 No Content dari backend dihandle dengan baik

Error 400 validation errors ditampilkan per field

��� Testing Manual
Buka halaman Rooms: http://localhost:3000/rooms

Test fitur:

✅ Lihat daftar ruangan (harusnya muncul data dari backend)

✅ Cari ruangan dengan kata kunci

✅ Klik tombol "Tambah Ruangan" → isi form → submit

✅ Klik edit pada salah satu ruangan → ubah data → submit

✅ Klik delete → konfirmasi → hapus

✅ Cek pagination jika data > 10

��� Roadmap
v1.0.0-frontend (Selesai) ✅
Setup project React + TypeScript

Manajemen Ruangan (CRUD)

Integrasi API backend

Error handling dan loading states

v1.1.0-frontend (Coming Soon) ⏳
Manajemen Peminjaman (Booking CRUD)

Filter pencarian peminjaman

Status management (Approve/Reject)

Riwayat perubahan status

Dashboard dengan statistik

��� Lisensi
MIT License

��� Author
Zaky - @Zaky-123

Catatan: Proyek ini adalah tugas individu PBL 2026 - Sistem Peminjaman Ruangan Kampus.

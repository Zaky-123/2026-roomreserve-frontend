# Changelog Frontend

Semua perubahan penting pada frontend akan dicatat di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-frontend] - 2026-02-16

### í¾‰ Rilis Pertama - Room Management UI

#### âœ¨ Fitur Baru

**Setup Proyek**
- Inisialisasi React + TypeScript dengan `create-react-app`
- Struktur folder yang rapi (components, pages, services, types)
- Konfigurasi Axios untuk komunikasi API
- Integrasi React Bootstrap untuk UI components
- Setup React Router untuk navigasi
- Environment variables dengan `.env.example`

**Manajemen Ruangan (Room CRUD)**
- **RoomList Component**
  - Tabel daftar ruangan dengan kolom lengkap
  - Status badge dengan warna berbeda:
    - í¿¢ `Available` (Tersedia) - Hijau
    - í¿¡ `UnderMaintenance` (Dalam Perawatan) - Kuning
    - í´´ `Occupied` (Sedang Dipakai) - Merah
  - Search functionality (cari berdasarkan nama/kode/lokasi)
  - Pagination dengan navigasi halaman
  - Tombol aksi Edit dan Delete
  - Loading state saat mengambil data

- **RoomForm Component**
  - Modal form untuk tambah dan edit ruangan
  - Field: Code, Name, Capacity, Location, Description, Status (untuk edit)
  - Validasi client-side:
    - Required fields
    - Code: 2-10 karakter
    - Name: maksimal 100 karakter
    - Capacity: 1-500 orang
    - Location: maksimal 200 karakter
    - Description: maksimal 500 karakter
  - Disable field Code saat mode edit (tidak bisa diubah)
  - Loading spinner saat submit
  - Auto-refresh list setelah sukses

- **Integrasi API**
  - `roomService.ts` dengan semua method CRUD
  - Error handling untuk response 400 (validation errors)
  - Error handling untuk response 409 (duplicate code)
  - Error handling untuk network errors
  - Logging untuk debugging

#### í°› Perbaikan Bug

- **Error 400 Bad Request saat update ruangan**
  - Penyebab: Status dikirim sebagai string ("Available")
  - Solusi: Mapping status ke number (0,1,2) sebelum dikirim
  - Detail mapping: `Available: 0`, `UnderMaintenance: 1`, `Occupied: 2`

- **TypeScript errors**
  - Perbaikan typing untuk UpdateRoomDto (status sebagai number)
  - Perbaikan error handling dengan type guard

- **ID mismatch validation**
  - Validasi ID di URL dan ID di body sebelum request

#### í³š Dokumentasi

- **README.md** lengkap dengan:
  - Deskripsi proyek dan fitur
  - Teknologi yang digunakan
  - Struktur folder
  - Cara instalasi dan menjalankan
  - Dokumentasi API integration
  - Roadmap pengembangan

- **CHANGELOG.md** dengan:
  - Format Keep a Changelog
  - Catatan detail setiap perubahan
  - Kategorisasi Added, Fixed, Changed

#### í´§ Teknis

- **State Management**: React hooks (useState, useEffect)
- **Styling**: React Bootstrap + custom CSS
- **HTTP Client**: Axios dengan interceptor
- **Type Safety**: TypeScript interfaces untuk semua data
- **Error Handling**: Try-catch dengan user-friendly messages
- **Loading States**: Spinner dan disabled buttons

## [Unreleased]

### Rencana Fitur (v1.1.0-frontend)

#### íº§ Dalam Pengembangan
- [ ] **Manajemen Peminjaman (Booking CRUD)**
  - [ ] Halaman daftar peminjaman dengan filter
  - [ ] Form tambah peminjaman dengan validasi
  - [ ] Conflict detection (double booking prevention)
  - [ ] Edit dan delete peminjaman

- [ ] **Status Management**
  - [ ] Tombol Approve/Reject di list booking
  - [ ] Modal konfirmasi dengan notes
  - [ ] Update status via API

- [ ] **Filter dan Pencarian**
  - [ ] Filter by status
  - [ ] Filter by tanggal
  - [ ] Filter by ruangan
  - [ ] Search by peminjam

- [ ] **Booking History**
  - [ ] Modal timeline perubahan status
  - [ ] Integrasi API history

- [ ] **Dashboard**
  - [ ] Statistik ruangan dan peminjaman
  - [ ] Grafik penggunaan ruangan

## í³Š Riwayat Versi

| Versi | Tanggal | Deskripsi |
|-------|---------|-----------|
| v1.0.0-frontend | 2026-02-16 | Rilis pertama - Manajemen Ruangan |

## í±¤ Kontributor

- **Zaky** - Pengembang utama

---

**Catatan:** Setiap rilis akan di-tag di GitHub dan dibuat release notes.

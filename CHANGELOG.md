# Changelog Frontend

Semua perubahan penting pada frontend akan dicatat di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0-frontend] - 2026-02-16

### 🎉 Rilis Kedua - Complete Booking Management

#### ✨ Fitur Baru

**Booking List (Issue #5)**
- Tabel daftar peminjaman dengan kolom lengkap:
  - Ruangan (kode + nama)
  - Peminjam (nama + email)
  - Kontak (telepon)
  - Waktu Mulai dan Selesai (format dd MMM yyyy HH:mm)
  - Tujuan
  - Status (badge warna)
  - Aksi (tombol dinamis)

- **Filter dan Pencarian:**
  - 🔍 Search by nama/email/tujuan
  - 🏢 Filter by ruangan (dropdown dari API)
  - 📊 Filter by status (Pending/Approved/Rejected/Cancelled/Completed)
  - 📅 Filter by date range (startDate, endDate)
  - 📄 Pagination dengan navigasi halaman (5 halaman + ellipsis)

- **Action Buttons Dinamis:**
  - 👁️ Detail (semua status)
  - ✏️ Edit (hanya Pending)
  - ✅ Ubah Status (Pending & Approved)
  - 🗑️ Hapus (hanya Pending)
  - 📋 Riwayat (semua status)

**Booking Form (Issue #6)**
- Form modal untuk tambah dan edit peminjaman
- Dropdown ruangan dari API (hanya menampilkan ruangan Available)
- Validasi lengkap:
  - ✅ Ruangan wajib dipilih
  - ✅ Nama wajib (max 100 karakter)
  - ✅ Email wajib dengan format valid
  - ✅ Telepon wajib (10-13 digit angka)
  - ✅ Waktu mulai tidak boleh di masa lalu
  - ✅ Waktu selesai harus setelah waktu mulai
- Default waktu otomatis: besok jam 09:00-10:00
- Loading state saat submit
- Error handling untuk 409 conflict (double booking)
- Field notes untuk tujuan peminjaman (max 500 karakter)

**Status Management (Issue #7)**
- Modal `BookingStatusModal` untuk mengubah status
- Dynamic status options berdasarkan status saat ini:
  - **Pending** → Approved / Rejected / Cancelled
  - **Approved** → Completed / Cancelled
  - **Rejected** / **Cancelled** / **Completed** (final - no options)
- Notes field untuk catatan perubahan
- Validasi client-side
- Error handling dari backend
- Info alur status yang valid

**History Tracking (Issue #8)**
- Modal `BookingHistoryModal` untuk melihat riwayat
- Tabel dengan kolom:
  - Waktu (format dd MMM yyyy HH:mm:ss, locale Indonesia)
  - Status Lama (badge warna)
  - Status Baru (badge warna)
  - Catatan
  - Diubah Oleh
- Loading state dengan spinner
- Error state dengan alert
- Empty state jika belum ada riwayat

#### 🐛 Perbaikan Bug
- Perbaiki TypeScript error pada event handler (split input/select handlers)
- Perbaiki module export issues di semua komponen
- Perbaiki error 400 Bad Request (status dikirim sebagai number)
- Perbaiki double booking detection
- Perbaiki format tanggal dengan locale Indonesia

#### 🔧 Teknis
- TypeScript interfaces untuk semua props dan state
- Error handling komprehensif untuk semua API calls
- Loading states untuk semua operasi async
- Format tanggal menggunakan date-fns dengan locale id
- Mapping status ke teks Indonesia
- Integrasi penuh dengan backend API

## [1.0.0-frontend] - 2026-02-16

### 🎉 Rilis Pertama - Room Management UI

#### ✨ Fitur Baru

**Setup Proyek**
- Inisialisasi React + TypeScript
- Struktur folder (components, pages, services, types)
- Konfigurasi Axios untuk API
- React Bootstrap untuk UI
- React Router untuk navigasi
- Environment variables

**Room Management**
- **RoomList Component**
  - Tabel daftar ruangan
  - Status badge dengan warna:
    - 🟢 Available (Tersedia) - Hijau
    - 🟡 UnderMaintenance - Kuning
    - 🔴 Occupied - Merah
  - Search functionality
  - Pagination
  - Tombol Edit dan Delete

- **RoomForm Component**
  - Modal form tambah/edit ruangan
  - Field: Code, Name, Capacity, Location, Description, Status
  - Validasi client-side
  - Disable field Code saat mode edit
  - Loading spinner
  - Auto-refresh list

- **Integrasi API**
  - roomService dengan semua method CRUD
  - Error handling untuk response 400, 409
  - Mapping status string ke number (0,1,2)

#### 🐛 Perbaikan Bug
- Error 400 Bad Request saat update ruangan
- TypeScript errors pada event handler
- ID mismatch validation

## [Unreleased]

### Rencana Fitur (v1.2.0-frontend)
- [ ] **Dashboard** dengan statistik dan grafik
- [ ] **Export data** ke Excel/PDF
- [ ] **Autentikasi** (Login/Register)
- [ ] **Notifikasi** real-time
- [ ] **Dark mode** toggle

## 📊 Riwayat Versi

| Versi | Tanggal | Deskripsi |
|-------|---------|-----------|
| v1.1.0-frontend | 2026-02-16 | Complete Booking Management (List, Form, Status, History) |
| v1.0.0-frontend | 2026-02-16 | Room Management UI |

## 👤 Kontributor

- **Zaky** - Pengembang utama

---

**Catatan:** Setiap rilis akan di-tag di GitHub dan dibuat release notes.
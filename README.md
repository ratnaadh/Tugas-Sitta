# SITTA Vue.js — Tugas Praktik 2 STSI4209

Aplikasi website sederhana **pemesanan / pengelolaan bahan ajar SITTA** Universitas Terbuka berbasis **Vue.js 2**.


> **Catatan beranda:** `dashboard.html` + `js/dashboard.js` **tidak dihapus**.  
> `index.html` hanya pintu masuk (redirect ke dashboard jika sudah login, atau ke login).  
> Buka **dashboard.html** untuk halaman beranda asli (greeting, statistik, menu).

Proyek ini **memenuhi seluruh indikator Soal Tugas 2** sambil **mempertahankan seluruh komponen** yang sudah ada di `Tugas-Sitta3.zip` (tidak ada komponen yang dihapus).

---

## Halaman wajib (sesuai soal)

| File | Fungsi |
|------|--------|
| `index.html` | Navigasi ke 2 halaman utama |
| `stok.html` | Halaman Stok Bahan Ajar |
| `tracking.html` | Halaman Tracking Delivery Order (DO) |

Halaman tambahan (bonus, tidak mengganti fitur inti): `login.html`, `dashboard.html`.

---

## Struktur proyek

```
Tugas-Sitta-Vue/
├─ index.html              ← navigasi (sesuai struktur soal)
├─ stok.html               ← Halaman 1: Stok Bahan Ajar (WAJIB)
├─ tracking.html           ← Halaman 2: Tracking DO (WAJIB)
├─ login.html / dashboard.html
├─ css/style.css
├─ assets/                 ← logo & cover gambar
└─ js/
   ├─ data.js              ← dummy data (acuan dataBahanAjar.js)
   ├─ filters.js           ← Vue.filter (rupiah, statusStok, dll.)
   ├─ stok-app.js          ← logika Vue halaman stok
   ├─ tracking-app.js      ← logika Vue halaman tracking
   ├─ auth.js / dashboard.js
   └─ components/          ← dipertahankan (tidak dihapus)
      ├─ app-navbar.js
      ├─ app-toast.js
      ├─ stock-summary.js
      ├─ stock-filters.js
      ├─ stock-form.js
      ├─ stock-table.js
      ├─ tracking-search.js
      ├─ tracking-form.js
      └─ tracking-result.js
```

> Soal TP2 menyatakan *tidak wajib* Template Component. Di sini komponen **tetap dipakai** sebagai pengorganisasian kode yang rapi (poin 1.1 arsitektur).

---

## Pemetaan ke kriteria penilaian Soal Tugas 2

| Poin | Kriteria | Implementasi |
|------|----------|--------------|
| **1.1** | Arsitektur & struktur proyek | Folder `js/`, `js/components/`, `css/`, `assets/`; penamaan konsisten; pemisahan data / filter / app |
| **1.2** | Data binding & list rendering | `{{ }}`, `v-text`, `v-html` (catatan), `v-bind` / `:`, `v-model`, `v-for` pada tabel & kartu |
| **1.3** | Conditional | `v-if` / `v-else-if` / `v-else` / `v-show` — status stok, form, empty state, filter kategori dependent |
| **1.4** | Computed / methods | `filteredStok`, `kategoriOptions`, `totalHarga`, `nextNomorDO`, validasi form, dll. |
| **1.5** | Watchers (≥ 2) | **Stok:** `filterUpbjj`, `daftarStok` (deep), `filterLowStock`. **Tracking:** `keyword`, `daftarTracking` (deep), `formDO.paketKode`. Panel **Log Watcher** menampilkan aktivitas real-time |
| **1.6** | Form + validasi | Form tambah/edit stok; form tambah DO (NIM, Nama, Ekspedisi, Paket, Tanggal); pesan error per field |
| **1.7** | Kreativitas UI | Toggle tabel/kartu, progress bar, toast, chip, keyboard Enter/Esc, dependent filter, cover gambar |
| **1.8** | Video | Ikuti alur di bawah (maks. 15 menit) |

---

## Fitur Halaman Stok (sesuai soal)

- Kolom: **kode, judul, kategori, upbjj, lokasiRak, qty, safety, status, catatanHTML** (+ harga, cover)
- Status: **Aman** (hijau, qty ≥ safety), **Menipis** (oranye, qty < safety), **Kosong** (merah, qty = 0)
- Filter **UT-Daerah (UPBJJ)** → baru muncul filter **Kategori** (dependent options)
- Filter stok low: `qty < safety` atau `qty = 0` (reorder)
- Sort: judul, kode, qty, harga
- Reset filter
- Filter lewat **computed** (tidak recompute manual)
- Tambah & **edit** data + validasi sederhana

## Fitur Halaman Tracking DO (sesuai soal)

- Nomor DO **otomatis**: `DO{tahun}-{seq}` contoh `DO2026-003`
- Field: NIM, Nama, Ekspedisi (**JNE Regular / JNE Express** + opsi lain), Paket, Tanggal Kirim
- Setelah pilih paket → tampil **detail isi paket** + total harga dari data `paket`
- Cari / tampilkan status perjalanan DO

---



## Watcher (kriteria 1.5) — upgrade

### Halaman Stok
1. **`filterUpbjj`** — reset kategori dependent + toast + log  
2. **`daftarStok` (deep)** — sync data global saat tambah/edit/hapus + log jumlah item  
3. **`filterLowStock`** (bonus) — log saat mode reorder on/off  

### Halaman Tracking
1. **`keyword`** — reset hasil pencarian + log  
2. **`daftarTracking` (deep)** — sync data global saat DO baru + log jumlah DO  
3. **`formDO.paketKode`** (bonus) — log & toast saat paket dipilih  

Panel **👁 Log Watcher** di bawah halaman menampilkan 5 aktivitas terakhir (cocok untuk demo video).

## Cara menjalankan

Buka `index.html` (atau `stok.html` / `tracking.html`) lewat browser, atau:

```bash
npx serve .
# lalu buka http://localhost:3000
```

Tidak perlu build tool — Vue 2 dari CDN.

### Akun demo (login bonus)

| Email | Password |
|-------|----------|
| admin@ut.ac.id | admin123 |
| rina@ut.ac.id | rina123 |

---

## Catatan video penjelasan (maks. ±15 menit)

1. Analisis kebutuhan soal TP2 (stok + tracking)  
2. Struktur folder & pemisahan file (termasuk kenapa komponen dipertahankan)  
3. Data binding, `v-for`, filter formatting  
4. Conditional status & dependent filter UPBJJ → Kategori  
5. Computed (`filteredStok`, `nextNomorDO`) & methods validasi  
6. **Dua watcher** per halaman + demo  
7. Form stok & form DO + validasi  
8. Demo UI lengkap (filter, sort, tambah, tracking)  
9. Penutup: ringkas indikator 1.1–1.7  

---

© 2026 — Tugas Praktik 2 STSI4209 | SITTA Universitas Terbuka  
Komponen dari Tugas-Sitta3 dipertahankan sesuai permintaan.

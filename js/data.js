/**
 * data.js — SITTA STSI4209 (Tugas Praktik 2 + komponen)
 * Dummy data mengikuti dataBahanAjar.js (lampiran soal) + perluasan cover/login.
 * Field stok: kode, judul, kategori, upbjj, lokasiRak, harga, qty, safety, catatanHTML
 */
var dataPengguna = [
  {
    id: 1,
    nama: "Rina Wulandari",
    email: "rina@ut.ac.id",
    password: "041e4e852c36528e050e1d979f30b59870a2353ae6a06a9606f7b353d8a0e8d5",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Jakarta"
  },
  {
    id: 2,
    nama: "Agus Pranoto",
    email: "agus@ut.ac.id",
    password: "1baedd25059490937a8f7a52dbaf5a7c168bc49f5bac0d7bc48bd6b58a84a421",
    role: "UPBJJ-UT",
    lokasi: "UPBJJ Makassar"
  },
  {
    id: 3,
    nama: "Siti Marlina",
    email: "siti@ut.ac.id",
    password: "71c6e47969179c1e831fcf41f4979a3557290a65d7925e6760cfd316389f0729",
    role: "Puslaba",
    lokasi: "Pusat"
  },
  {
    id: 4,
    nama: "Doni Setiawan",
    email: "doni@ut.ac.id",
    password: "1078fa5138d048a2ac36348c7059f88896e4f586caa63162bcc086a8669a3bb4",
    role: "Fakultas",
    lokasi: "FISIP"
  },
  {
    id: 5,
    nama: "Admin SITTA",
    email: "admin@ut.ac.id",
    password: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
    role: "Administrator",
    lokasi: "Pusat"
  }
];

async function hashPassword(plainText) {
  var encoder = new TextEncoder();
  var data = encoder.encode(String(plainText));
  var hashBuffer = await crypto.subtle.digest("SHA-256", data);
  var hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(function (b) {
    return b.toString(16).padStart(2, "0");
  }).join("");
}

var upbjjList = ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"];

var kategoriList = ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"];

var pengirimanList = [
  { kode: "JNE-REG", nama: "JNE Regular", harga: 18000 },
  { kode: "JNE-EXP", nama: "JNE Express", harga: 35000 },
  { kode: "REG", nama: "Reguler (3-5 hari)", harga: 15000 },
  { kode: "EXP", nama: "Ekspres (1-2 hari)", harga: 35000 },
  { kode: "POS", nama: "Pos Indonesia", harga: 12000 }
];

var paket = [
  { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
  { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
];

var stok = [
  {
    kode: "EKMA4116",
    judul: "Pengantar Manajemen",
    kategori: "MK Wajib",
    upbjj: "Jakarta",
    lokasiRak: "R1-A3",
    harga: 65000,
    qty: 28,
    safety: 20,
    catatanHTML: "<em>Edisi 2024, cetak ulang</em>",
    cover: "assets/img/manajemen_keuangan.jpg"
  },
  {
    kode: "EKMA4115",
    judul: "Pengantar Akuntansi",
    kategori: "MK Wajib",
    upbjj: "Jakarta",
    lokasiRak: "R1-A4",
    harga: 60000,
    qty: 7,
    safety: 15,
    catatanHTML: "<strong>Cover baru</strong>",
    cover: "assets/img/kepemimpinan.jpg"
  },
  {
    kode: "BIOL4201",
    judul: "Biologi Umum (Praktikum)",
    kategori: "Praktikum",
    upbjj: "Surabaya",
    lokasiRak: "R3-B2",
    harga: 80000,
    qty: 12,
    safety: 10,
    catatanHTML: "Butuh <u>pendingin</u> untuk kit basah",
    cover: "assets/img/mikrobiologi.jpg"
  },
  {
    kode: "FISIP4001",
    judul: "Dasar-Dasar Sosiologi",
    kategori: "MK Pilihan",
    upbjj: "Makassar",
    lokasiRak: "R2-C1",
    harga: 55000,
    qty: 2,
    safety: 8,
    catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder",
    cover: "assets/img/pengantar_komunikasi.jpg"
  },
  {
    kode: "PAUD4101",
    judul: "Perkembangan Anak Usia Dini",
    kategori: "MK Wajib",
    upbjj: "Denpasar",
    lokasiRak: "R4-A1",
    harga: 70000,
    qty: 0,
    safety: 5,
    catatanHTML: "Stok <strong>habis</strong> — reorder segera",
    cover: "assets/img/paud_perkembangan.jpeg"
  }
];

/* Object keyed by nomor DO — untuk name-based v-for */
var tracking = {
  "DO2026-001": {
    nomorDO: "DO2026-001",
    nim: "123456789",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE-REG",
    tanggalKirim: "2026-08-25",
    paket: "PAKET-UT-001",
    total: 135000,
    perjalanan: [
      { waktu: "2026-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
      { waktu: "2026-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
      { waktu: "2026-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
    ]
  },
  "DO2026-002": {
    nomorDO: "DO2026-002",
    nim: "987654321",
    nama: "Agus Pranoto",
    status: "Dikirim",
    ekspedisi: "POS",
    tanggalKirim: "2026-09-01",
    paket: "PAKET-UT-002",
    total: 152000,
    perjalanan: [
      { waktu: "2026-09-01 09:00:00", keterangan: "Penerimaan di Loket: MAKASSAR" },
      { waktu: "2026-09-01 16:30:00", keterangan: "Dalam perjalanan ke tujuan" },
      { waktu: "2026-09-02 11:15:00", keterangan: "Tiba di kantor pos tujuan" },
      { waktu: "2026-09-02 14:00:00", keterangan: "Diserahkan ke penerima" }
    ]
  }
};

var dataBahanAjar = stok.map(function (s) {
  return {
    kodeBarang: s.kode,
    namaBarang: s.judul,
    jenisBarang: s.kategori,
    edisi: "-",
    stok: s.qty,
    kodeLokasi: s.lokasiRak,
    cover: s.cover || "",
    safety: s.safety,
    upbjj: s.upbjj,
    harga: s.harga,
    catatanHTML: s.catatanHTML
  };
});

var dataTracking = tracking;

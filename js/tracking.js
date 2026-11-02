/**
 * tracking.js — Vue.js App untuk Halaman Tracking DO (Tugas Praktik 2)
 * Fitur: cari DO, tampilkan timeline, form tambah DO baru (auto nomor),
 * select paket + detail isi, computed total, watcher, validasi
 */
(function () {
  "use strict";

  if (typeof tracking === "undefined") {
    console.error("Data tracking tidak ditemukan.");
    return;
  }

  new Vue({
    el: "#app",
    data: {
      // Data
      daftarTracking: JSON.parse(JSON.stringify(tracking)),
      paketList: paket.slice(),
      pengirimanList: pengirimanList.slice(),
      stokList: (typeof stok !== "undefined" ? stok.slice() : []),

      // Pencarian
      keyword: "",
      hasil: null,
      notFound: false,
      sudahCari: false,

      // Form tambah DO
      showFormDO: false,
      formDO: {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: new Date().toISOString().slice(0, 10)
      },
      formDOError: {},

      // Toast
      toastMsg: "",
      toastType: "info",
      showToast: false
    },

    computed: {
      // Daftar nomor DO untuk datalist
      daftarNomorDO: function () {
        return Object.keys(this.daftarTracking);
      },

      // Paket yang dipilih
      selectedPaket: function () {
        if (!this.formDO.paketKode) return null;
        var kode = this.formDO.paketKode;
        return this.paketList.find(function (p) {
          return p.kode === kode;
        }) || null;
      },

      // Ekspedisi yang dipilih (untuk ambil ongkir)
      selectedEkspedisi: function () {
        if (!this.formDO.ekspedisi) return null;
        var nama = this.formDO.ekspedisi;
        return this.pengirimanList.find(function (p) {
          return p.nama === nama;
        }) || null;
      },

      // Ongkir sesuai ekspedisi
      ongkir: function () {
        return this.selectedEkspedisi && this.selectedEkspedisi.harga
          ? this.selectedEkspedisi.harga
          : 0;
      },

      // Total = harga paket + ongkir
      totalHarga: function () {
        var hargaPaket = this.selectedPaket ? this.selectedPaket.harga : 0;
        return hargaPaket + this.ongkir;
      },

      // Generate nomor DO berikutnya
      nextNomorDO: function () {
        // Format: DO + tahun berjalan + sequence (001, 002, ...)
        // Sequence otomatis mengikuti nomor terbesar yang sudah ada di tahun yang sama
        var tahun = new Date().getFullYear();
        var prefix = "DO" + tahun + "-";
        var maxSeq = 0;
        Object.keys(this.daftarTracking).forEach(function (key) {
          // cocokkan DO2026-001, DO2026-002, dst
          if (String(key).toUpperCase().indexOf(prefix) === 0) {
            var parts = String(key).split("-");
            var seq = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
          }
        });
        var next = maxSeq + 1;
        return prefix + String(next).padStart(3, "0");
      },

      // Progress persen berdasarkan status
      progressPersen: function () {
        if (!this.hasil) return 0;
        var s = (this.hasil.status || "").toLowerCase();
        if (s.indexOf("selesai") !== -1 || s.indexOf("dikirim") !== -1) return 100;
        if (s.indexOf("perjalanan") !== -1) return 60;
        if (s.indexOf("proses") !== -1) return 30;
        return 15;
      }
    },

    watch: {
      // Watcher 1: saat keyword berubah, reset hasil
      keyword: function () {
        this.hasil = null;
        this.notFound = false;
        this.sudahCari = false;
      },

      // Watcher 2: sinkronkan perubahan daftarTracking ke global
      daftarTracking: {
        handler: function (newVal) {
          if (typeof window !== "undefined") {
            window.tracking = newVal;
            window.dataTracking = newVal;
          }
        },
        deep: true
      }
    },

    methods: {
      formatRupiah: function (n) {
        return "Rp " + Number(n || 0).toLocaleString("id-ID");
      },

      statusClass: function (status) {
        var s = String(status || "").toLowerCase();
        if (s.indexOf("dikirim") !== -1 || s.indexOf("selesai") !== -1) return "terkirim";
        if (s.indexOf("perjalanan") !== -1) return "perjalanan";
        if (s.indexOf("batal") !== -1) return "batal";
        return "proses";
      },

      cariDO: function () {
        var key = (this.keyword || "").trim().toUpperCase();
        this.sudahCari = true;
        if (!key) {
          this.hasil = null;
          this.notFound = false;
          this.showToastMsg("Harap isi nomor DO terlebih dahulu", "warning");
          return;
        }
        // cari case-insensitive
        var found = null;
        var keys = Object.keys(this.daftarTracking);
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].toUpperCase() === key) {
            found = this.daftarTracking[keys[i]];
            break;
          }
        }
        if (found) {
          this.hasil = found;
          this.notFound = false;
        } else {
          this.hasil = null;
          this.notFound = true;
        }
      },

      resetCari: function () {
        this.keyword = "";
        this.hasil = null;
        this.notFound = false;
        this.sudahCari = false;
      },

      toggleFormDO: function () {
        this.showFormDO = !this.showFormDO;
        if (!this.showFormDO) this.resetFormDO();
      },

      resetFormDO: function () {
        this.formDO = {
          nim: "",
          nama: "",
          ekspedisi: "",
          paketKode: "",
          tanggalKirim: new Date().toISOString().slice(0, 10)
        };
        this.formDOError = {};
      },

      validateFormDO: function () {
        var err = {};
        if (!this.formDO.nim || !this.formDO.nim.trim()) err.nim = "NIM wajib diisi";
        if (!this.formDO.nama || !this.formDO.nama.trim()) err.nama = "Nama wajib diisi";
        if (!this.formDO.ekspedisi) err.ekspedisi = "Pilih ekspedisi";
        if (!this.formDO.paketKode) err.paketKode = "Pilih paket";
        if (!this.formDO.tanggalKirim) err.tanggalKirim = "Tanggal wajib diisi";
        this.formDOError = err;
        return Object.keys(err).length === 0;
      },

      tambahDO: function () {
        if (!this.validateFormDO()) {
          this.showToastMsg("Periksa kembali form DO", "error");
          return;
        }
        var nomor = this.nextNomorDO;
        var now = new Date();
        var waktuStr = now.toISOString().slice(0, 19).replace("T", " ");

        var newDO = {
          nomorDO: nomor,
          nim: this.formDO.nim.trim(),
          nama: this.formDO.nama.trim(),
          status: "Proses",
          ekspedisi: this.formDO.ekspedisi,
          tanggalKirim: this.formDO.tanggalKirim,
          paket: this.formDO.paketKode,
          total: this.totalHarga,
          perjalanan: [
            {
              waktu: waktuStr,
              keterangan: "Penerimaan di Loket: Sistem SITTA (baru dibuat)"
            }
          ]
        };

        // Vue 2 reactivity: gunakan $set
        this.$set(this.daftarTracking, nomor, newDO);

        this.showToastMsg("DO " + nomor + " berhasil ditambahkan", "success");
        this.resetFormDO();
        this.showFormDO = false;

        // Auto tampilkan hasil
        this.keyword = nomor;
        this.cariDO();
      },

      showToastMsg: function (msg, type) {
        this.toastMsg = msg;
        this.toastType = type || "info";
        this.showToast = true;
        var self = this;
        setTimeout(function () {
          self.showToast = false;
        }, 2800);
      },

      // Helper: judul mata kuliah dari kode
      getJudulMk: function (kodeMk) {
        var item = this.stokList.find(function (s) {
          return s.kode === kodeMk;
        });
        return item ? item.judul : kodeMk;
      },

      // Helper: nama paket dari kode
      getNamaPaket: function (kode) {
        var p = this.paketList.find(function (x) { return x.kode === kode; });
        return p ? p.nama : kode;
      }
    }
  });
})();

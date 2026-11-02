/**
 * tracking-app.js — Root Vue instance halaman Tracking DO
 * Memenuhi Soal Tugas 2: nomor DO otomatis DO{tahun}-{seq}, form NIM/Nama/
 * Ekspedisi/Paket/Tanggal, detail isi paket, total harga, search DO,
 * computed, methods, minimal 2 watcher. Komponen dipertahankan.
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
      daftarTracking: JSON.parse(JSON.stringify(tracking)),
      paketList: paket.slice(),
      pengirimanList: pengirimanList.slice(),
      stokList: typeof stok !== "undefined" ? stok.slice() : [],

      keyword: "",
      hasil: null,
      notFound: false,
      sudahCari: false,

      showFormDO: false,
      formDO: {
        nim: "",
        nama: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: new Date().toISOString().slice(0, 10)
      },
      formDOError: {},

      toastMsg: "",
      toastType: "info",
      showToast: false,

      /* Log aktivitas watcher (untuk demo & video penjelasan) */
      watcherLog: [],
      lastWatcherAt: null
    },

    computed: {
      /* Name-based: daftar nomor DO dari object keys */
      daftarNomorDO: function () {
        return Object.keys(this.daftarTracking);
      },

      selectedPaket: function () {
        var kode = this.formDO.paketKode;
        if (!kode) return null;
        return this.paketList.find(function (p) {
          return p.kode === kode;
        }) || null;
      },

      selectedEkspedisi: function () {
        var kode = this.formDO.ekspedisi;
        if (!kode) return null;
        return this.pengirimanList.find(function (e) {
          return e.kode === kode;
        }) || null;
      },

      ongkir: function () {
        return this.selectedEkspedisi ? Number(this.selectedEkspedisi.harga || 0) : 0;
      },

      totalHarga: function () {
        var paketHarga = this.selectedPaket ? Number(this.selectedPaket.harga || 0) : 0;
        return paketHarga + this.ongkir;
      },

      /* Format sesuai soal: DO + Tahun Berjalan + Sequence (DO2025-001, dst.) */
      nextNomorDO: function () {
        var year = new Date().getFullYear();
        var prefix = "DO" + year + "-";
        var keys = Object.keys(this.daftarTracking);
        var max = 0;
        keys.forEach(function (k) {
          var m = String(k).match(/(\d+)$/);
          if (m) {
            var n = parseInt(m[1], 10);
            if (n > max) max = n;
          }
        });
        var next = max + 1;
        return prefix + String(next).padStart(3, "0");
      },

      progressPersen: function () {
        if (!this.hasil || !this.hasil.perjalanan) return 0;
        var len = this.hasil.perjalanan.length;
        var status = String(this.hasil.status || "").toLowerCase();
        if (status.indexOf("dikirim") !== -1 || status.indexOf("selesai") !== -1) return 100;
        if (status.indexOf("perjalanan") !== -1) return Math.min(90, 30 + len * 20);
        return Math.min(40, len * 15);
      }
    },

    watch: {
      /**
       * Watcher 1 — memantau keyword pencarian DO
       * Saat keyword berubah: reset hasil & flag not-found
       */
      keyword: function (newVal, oldVal) {
        this.hasil = null;
        this.notFound = false;
        this.sudahCari = false;
        var key = String(newVal || "").trim();
        var pesan = key
          ? ("Keyword diubah → \"" + key + "\" (hasil direset)")
          : "Keyword dikosongkan";
        this.pushWatcherLog("keyword", pesan);
      },

      /**
       * Watcher 2 — memantau daftarTracking secara deep
       * Setiap DO baru ditambah: sync ke window + log jumlah DO
       */
      daftarTracking: {
        handler: function (newVal) {
          var jumlah = newVal ? Object.keys(newVal).length : 0;
          if (typeof window !== "undefined") {
            window.tracking = newVal;
            window.dataTracking = newVal;
          }
          this.pushWatcherLog("daftarTracking", "Data DO berubah — total " + jumlah + " DO");
        },
        deep: true
      },

      /**
       * Watcher 3 (bonus) — memantau pilihan paket di form DO
       * Saat paket dipilih: tampilkan info harga (demonstrasi reactive form)
       */
      "formDO.paketKode": function (newVal) {
        if (!newVal) {
          this.pushWatcherLog("paket", "Paket dibatalkan");
          return;
        }
        var pkt = (this.paketList || []).find(function (p) {
          return p.kode === newVal;
        });
        var info = pkt
          ? (pkt.nama + " — Rp " + Number(pkt.harga || 0).toLocaleString("id-ID"))
          : newVal;
        this.pushWatcherLog("paket", "Paket dipilih: " + info);
        this.showToastMsg("Paket: " + info, "info");
      }
    },

    mounted: function () {
      var self = this;
      document.addEventListener("keyup", function (e) {
        if (e.key === "Escape" && self.showFormDO) {
          self.showFormDO = false;
          self.resetFormDO();
        }
      });
    },

    methods: {
      formatRupiah: function (n) {
        return "Rp " + Number(n || 0).toLocaleString("id-ID");
      },

      cariDO: function () {
        var key = String(this.keyword || "").trim().toUpperCase();
        this.sudahCari = true;
        if (!key) {
          this.hasil = null;
          this.notFound = true;
          this.showToastMsg("Masukkan nomor DO", "warning");
          return;
        }

        /* Cari by key object (name-based) atau by nomorDO field */
        var found = null;
        if (this.daftarTracking[key]) {
          found = this.daftarTracking[key];
        } else {
          var keys = Object.keys(this.daftarTracking);
          for (var i = 0; i < keys.length; i++) {
            var item = this.daftarTracking[keys[i]];
            if (String(item.nomorDO || keys[i]).toUpperCase() === key) {
              found = item;
              break;
            }
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

      bukaFormDO: function () {
        this.showFormDO = true;
        this.resetFormDO();
      },

      tutupFormDO: function () {
        this.showFormDO = false;
        this.resetFormDO();
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

        this.$set(this.daftarTracking, nomor, newDO);
        this.showToastMsg("DO " + nomor + " berhasil ditambahkan", "success");
        this.tutupFormDO();
        this.keyword = nomor;
        this.cariDO();
      },

      pushWatcherLog: function (nama, pesan) {
        var now = new Date();
        var jam = String(now.getHours()).padStart(2, "0") + ":" +
                  String(now.getMinutes()).padStart(2, "0") + ":" +
                  String(now.getSeconds()).padStart(2, "0");
        this.watcherLog.unshift({
          waktu: jam,
          nama: nama,
          pesan: pesan
        });
        if (this.watcherLog.length > 5) {
          this.watcherLog = this.watcherLog.slice(0, 5);
        }
        this.lastWatcherAt = jam;
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

      getJudulMk: function (kodeMk) {
        var item = this.stokList.find(function (s) {
          return s.kode === kodeMk;
        });
        return item ? item.judul : kodeMk;
      },

      getNamaPaket: function (kode) {
        var p = this.paketList.find(function (x) {
          return x.kode === kode;
        });
        return p ? p.nama : kode;
      }
    }
  });
})();

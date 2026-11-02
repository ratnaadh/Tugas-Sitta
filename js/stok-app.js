/**
 * stok-app.js — Root Vue instance halaman Stok Bahan Ajar
 * Memenuhi Soal Tugas 2 STSI4209: list, filter dependent, sort, status,
 * form tambah/edit + validasi, computed, methods, minimal 2 watcher.
 * Komponen (stock-*) dipertahankan — tidak dihapus.
 */
(function () {
  "use strict";

  if (typeof stok === "undefined") {
    console.error("Data stok tidak ditemukan. Pastikan data.js dimuat lebih dulu.");
    return;
  }

  new Vue({
    el: "#app",
    data: {
      daftarStok: JSON.parse(JSON.stringify(stok)),
      upbjjList: upbjjList.slice(),
      kategoriList: kategoriList.slice(),

      filterUpbjj: "",
      filterKategori: "",
      filterLowStock: false,
      sortBy: "",
      sortAsc: true,
      viewMode: "table",

      formMode: null,
      form: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: null,
        qty: null,
        safety: null,
        catatanHTML: "",
        cover: ""
      },
      formError: {},
      editKodeAsli: "",

      toastMsg: "",
      toastType: "info",
      showToast: false,

      /* Log aktivitas watcher (untuk demo & video penjelasan) */
      watcherLog: [],
      lastWatcherAt: null
    },

    computed: {
      /* Dependent options: kategori baru muncul setelah pilih UPBJJ,
         dan hanya kategori yang ada di stok UPBJJ tersebut */
      kategoriOptions: function () {
        if (!this.filterUpbjj) return [];
        var set = {};
        var upbjj = this.filterUpbjj;
        this.daftarStok.forEach(function (item) {
          if (item.upbjj === upbjj && item.kategori) {
            set[item.kategori] = true;
          }
        });
        var keys = Object.keys(set);
        /* Jika belum ada data untuk UPBJJ itu, sediakan seluruh kategoriList */
        return keys.length ? keys : this.kategoriList.slice();
      },

      filteredStok: function () {
        var list = this.daftarStok.slice();
        var self = this;

        if (this.filterUpbjj) {
          list = list.filter(function (item) {
            return item.upbjj === self.filterUpbjj;
          });
        }
        if (this.filterUpbjj && this.filterKategori) {
          list = list.filter(function (item) {
            return item.kategori === self.filterKategori;
          });
        }
        if (this.filterLowStock) {
          list = list.filter(function (item) {
            return item.qty < item.safety || item.qty === 0;
          });
        }
        if (this.sortBy) {
          var key = this.sortBy;
          var asc = this.sortAsc;
          list.sort(function (a, b) {
            var va = a[key];
            var vb = b[key];
            if (typeof va === "string") {
              va = (va || "").toLowerCase();
              vb = (vb || "").toLowerCase();
            }
            if (va < vb) return asc ? -1 : 1;
            if (va > vb) return asc ? 1 : -1;
            return 0;
          });
        }
        return list;
      },

      totalItem: function () {
        return this.daftarStok.length;
      },
      totalQty: function () {
        return this.daftarStok.reduce(function (sum, s) {
          return sum + Number(s.qty || 0);
        }, 0);
      },
      jumlahMenipis: function () {
        return this.daftarStok.filter(function (s) {
          return s.qty > 0 && s.qty < s.safety;
        }).length;
      },
      jumlahKosong: function () {
        return this.daftarStok.filter(function (s) {
          return s.qty === 0;
        }).length;
      },
      judulForm: function () {
        return this.formMode === "edit" ? "Edit Bahan Ajar" : "Tambah Bahan Ajar Baru";
      },
      hasActiveFilter: function () {
        return !!(this.filterUpbjj || this.filterKategori || this.filterLowStock);
      }
    },

    watch: {
      /**
       * Watcher 1 — memantau filter UPBJJ
       * Saat UPBJJ berubah: reset kategori (dependent options) + catat log
       */
      filterUpbjj: function (newVal, oldVal) {
        this.filterKategori = "";
        var label = newVal ? ("Filter UPBJJ → " + newVal) : "Filter UPBJJ direset (semua daerah)";
        this.pushWatcherLog("filter", label);
        if (newVal && newVal !== oldVal) {
          this.showToastMsg("Filter UPBJJ: " + newVal, "info");
        }
      },

      /**
       * Watcher 2 — memantau daftarStok secara deep
       * Setiap tambah / edit / hapus stok: sync ke window + log jumlah item
       */
      daftarStok: {
        handler: function (newVal) {
          var jumlah = (newVal && newVal.length) || 0;
          if (typeof window !== "undefined") {
            window.stok = newVal;
            window.dataBahanAjar = (newVal || []).map(function (s) {
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
          }
          this.pushWatcherLog("stok", "Data stok berubah — total " + jumlah + " item");
        },
        deep: true
      },

      /**
       * Watcher 3 (bonus) — memantau filter low-stock
       * Memberi umpan balik saat mode reorder diaktifkan/nonaktifkan
       */
      filterLowStock: function (newVal) {
        var msg = newVal
          ? "Mode reorder aktif (qty < safety atau qty = 0)"
          : "Mode reorder nonaktif";
        this.pushWatcherLog("reorder", msg);
      }
    },

    mounted: function () {
      var self = this;
      document.addEventListener("keyup", function (e) {
        if (e.key === "Escape" && self.formMode) {
          self.tutupForm();
        }
      });
    },

    methods: {
      resetFilter: function () {
        this.filterUpbjj = "";
        this.filterKategori = "";
        this.filterLowStock = false;
        this.sortBy = "";
      },

      bukaTambah: function () {
        this.formMode = "tambah";
        this.resetForm();
        this.$nextTick(function () {
          var el = document.querySelector(".form-tambah");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      },

      bukaEdit: function (item) {
        this.formMode = "edit";
        this.editKodeAsli = item.kode;
        this.form = {
          kode: item.kode,
          judul: item.judul,
          kategori: item.kategori,
          upbjj: item.upbjj,
          lokasiRak: item.lokasiRak,
          harga: item.harga,
          qty: item.qty,
          safety: item.safety,
          catatanHTML: item.catatanHTML || "",
          cover: item.cover || ""
        };
        this.formError = {};
        this.$nextTick(function () {
          var el = document.querySelector(".form-tambah");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      },

      tutupForm: function () {
        this.formMode = null;
        this.resetForm();
      },

      resetForm: function () {
        this.form = {
          kode: "",
          judul: "",
          kategori: "",
          upbjj: "",
          lokasiRak: "",
          harga: null,
          qty: null,
          safety: null,
          catatanHTML: "",
          cover: ""
        };
        this.formError = {};
        this.editKodeAsli = "";
      },

      validateForm: function () {
        var err = {};
        if (!this.form.kode || !String(this.form.kode).trim()) err.kode = "Kode wajib diisi";
        if (!this.form.judul || !String(this.form.judul).trim()) err.judul = "Judul wajib diisi";
        if (!this.form.kategori) err.kategori = "Pilih kategori";
        if (!this.form.upbjj) err.upbjj = "Pilih UPBJJ";
        if (!this.form.lokasiRak || !String(this.form.lokasiRak).trim()) err.lokasiRak = "Lokasi rak wajib";
        if (this.form.harga === null || this.form.harga === "" || Number(this.form.harga) < 0) {
          err.harga = "Harga tidak valid";
        }
        if (this.form.qty === null || this.form.qty === "" || Number(this.form.qty) < 0) {
          err.qty = "Qty tidak valid";
        }
        if (this.form.safety === null || this.form.safety === "" || Number(this.form.safety) < 0) {
          err.safety = "Safety stock tidak valid";
        }

        var kodeBaru = String(this.form.kode).toUpperCase().trim();
        var self = this;
        var kodeExist = this.daftarStok.some(function (s) {
          if (self.formMode === "edit" && s.kode === self.editKodeAsli) return false;
          return s.kode.toUpperCase() === kodeBaru;
        });
        if (kodeExist) err.kode = "Kode sudah digunakan";

        this.formError = err;
        return Object.keys(err).length === 0;
      },

      simpanForm: function () {
        if (!this.validateForm()) {
          this.showToastMsg("Periksa kembali form", "error");
          return;
        }

        var payload = {
          kode: String(this.form.kode).toUpperCase().trim(),
          judul: String(this.form.judul).trim(),
          kategori: this.form.kategori,
          upbjj: this.form.upbjj,
          lokasiRak: String(this.form.lokasiRak).trim(),
          harga: Number(this.form.harga),
          qty: Number(this.form.qty),
          safety: Number(this.form.safety),
          catatanHTML: this.form.catatanHTML || "",
          cover: this.form.cover || ""
        };

        if (this.formMode === "edit") {
          var idx = this.daftarStok.findIndex(function (s) {
            return s.kode === this.editKodeAsli;
          }.bind(this));
          if (idx !== -1) {
            this.$set(this.daftarStok, idx, payload);
            this.showToastMsg("Data " + payload.kode + " berhasil diperbarui", "success");
          }
        } else {
          this.daftarStok.push(payload);
          this.showToastMsg("Data " + payload.kode + " berhasil ditambahkan", "success");
        }

        this.tutupForm();
      },

      hapusItem: function (item) {
        if (!confirm("Hapus bahan ajar " + item.kode + " — " + item.judul + "?")) return;
        var idx = this.daftarStok.findIndex(function (s) {
          return s.kode === item.kode;
        });
        if (idx !== -1) {
          this.daftarStok.splice(idx, 1);
          this.showToastMsg("Data " + item.kode + " dihapus", "warning");
        }
      },

      /* Catat aktivitas watcher (maks 5 baris, untuk demo kriteria 1.5) */
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
      }
    }
  });
})();

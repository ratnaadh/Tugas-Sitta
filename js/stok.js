/**
 * stok.js — Vue.js App untuk Halaman Stok Bahan Ajar (Tugas Praktik 2)
 * Memenuhi: mustaches, v-text, v-html, v-bind, v-model,
 * v-if / v-else-if / v-else / v-show, computed, methods,
 * minimal 2 watcher, form tambah + edit lengkap + validasi,
 * filter / sort / dependent options
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

      // Filter & sort
      filterUpbjj: "",
      filterKategori: "",
      filterLowStock: false,
      sortBy: "",
      sortAsc: true,

      // Mode form: 'tambah' | 'edit' | null
      formMode: null, // null = form tertutup
      form: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: null,
        qty: null,
        safety: null,
        catatanHTML: ""
      },
      formError: {},
      editKodeAsli: "", // untuk identifikasi saat edit

      // Notifikasi
      toastMsg: "",
      toastType: "info",
      showToast: false
    },

    computed: {
      kategoriOptions: function () {
        if (!this.filterUpbjj) return [];
        return this.kategoriList;
      },

      filteredStok: function () {
        var list = this.daftarStok.slice();

        if (this.filterUpbjj) {
          list = list.filter(function (item) {
            return item.upbjj === this.filterUpbjj;
          }.bind(this));
        }

        if (this.filterUpbjj && this.filterKategori) {
          list = list.filter(function (item) {
            return item.kategori === this.filterKategori;
          }.bind(this));
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
              va = va.toLowerCase();
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
        return this.filteredStok.length;
      },

      totalQty: function () {
        return this.filteredStok.reduce(function (sum, i) {
          return sum + Number(i.qty || 0);
        }, 0);
      },

      jumlahMenipis: function () {
        return this.daftarStok.filter(function (i) {
          return i.qty > 0 && i.qty < i.safety;
        }).length;
      },

      jumlahKosong: function () {
        return this.daftarStok.filter(function (i) {
          return i.qty === 0;
        }).length;
      },

      isFormOpen: function () {
        return this.formMode === "tambah" || this.formMode === "edit";
      },

      judulForm: function () {
        if (this.formMode === "edit") return "Edit Data Bahan Ajar";
        if (this.formMode === "tambah") return "Tambah Bahan Ajar Baru";
        return "";
      }
    },

    watch: {
      // Watcher 1: saat filter UPBJJ berubah → reset kategori
      filterUpbjj: function (newVal) {
        if (!newVal) {
          this.filterKategori = "";
        }
      },

      // Watcher 2: sinkronkan daftarStok ke global (agar rekap dashboard ikut)
      daftarStok: {
        handler: function (newVal) {
          if (typeof window !== "undefined") {
            window.stok = newVal;
            window.dataBahanAjar = newVal.map(function (s) {
              return {
                kodeBarang: s.kode,
                namaBarang: s.judul,
                jenisBarang: s.kategori,
                edisi: "-",
                stok: s.qty,
                kodeLokasi: s.lokasiRak,
                cover: "",
                safety: s.safety,
                upbjj: s.upbjj,
                harga: s.harga,
                catatanHTML: s.catatanHTML
              };
            });
          }
        },
        deep: true
      }
    },

    methods: {
      getStatus: function (item) {
        if (item.qty === 0) return "Kosong";
        if (item.qty < item.safety) return "Menipis";
        return "Aman";
      },

      statusClass: function (item) {
        var s = this.getStatus(item);
        if (s === "Aman") return "status-aman";
        if (s === "Menipis") return "status-menipis";
        return "status-kosong";
      },

      statusIcon: function (item) {
        var s = this.getStatus(item);
        if (s === "Aman") return "✅";
        if (s === "Menipis") return "⚠️";
        return "🔴";
      },

      formatRupiah: function (angka) {
        return "Rp " + Number(angka || 0).toLocaleString("id-ID");
      },

      resetFilter: function () {
        this.filterUpbjj = "";
        this.filterKategori = "";
        this.filterLowStock = false;
        this.sortBy = "";
        this.sortAsc = true;
        this.showToastMsg("Filter direset", "info");
      },

      toggleSort: function (field) {
        if (this.sortBy === field) {
          this.sortAsc = !this.sortAsc;
        } else {
          this.sortBy = field;
          this.sortAsc = true;
        }
      },

      // ---- Form Tambah / Edit ----
      bukaTambah: function () {
        this.resetForm();
        this.formMode = "tambah";
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
          catatanHTML: item.catatanHTML || ""
        };
        this.formError = {};
        // scroll ke form
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
          catatanHTML: ""
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
        if (this.form.harga === null || this.form.harga === "" || Number(this.form.harga) < 0) err.harga = "Harga tidak valid";
        if (this.form.qty === null || this.form.qty === "" || Number(this.form.qty) < 0) err.qty = "Qty tidak valid";
        if (this.form.safety === null || this.form.safety === "" || Number(this.form.safety) < 0) err.safety = "Safety stock tidak valid";

        // Cek kode unik (kecuali saat edit kode yang sama)
        var kodeBaru = String(this.form.kode).toUpperCase().trim();
        var kodeExist = this.daftarStok.some(function (s) {
          if (this.formMode === "edit" && s.kode === this.editKodeAsli) return false;
          return s.kode.toUpperCase() === kodeBaru;
        }.bind(this));
        if (kodeExist) err.kode = "Kode sudah digunakan";

        this.formError = err;
        return Object.keys(err).length === 0;
      },

      simpanForm: function () {
        if (!this.validateForm()) {
          this.showToastMsg("Periksa kembali form", "error");
          return;
        }

        var dataBaru = {
          kode: String(this.form.kode).trim().toUpperCase(),
          judul: String(this.form.judul).trim(),
          kategori: this.form.kategori,
          upbjj: this.form.upbjj,
          lokasiRak: String(this.form.lokasiRak).trim(),
          harga: Number(this.form.harga),
          qty: Number(this.form.qty),
          safety: Number(this.form.safety),
          catatanHTML: this.form.catatanHTML || ""
        };

        if (this.formMode === "tambah") {
          this.daftarStok.push(dataBaru);
          this.showToastMsg("Data stok berhasil ditambahkan", "success");
        } else if (this.formMode === "edit") {
          var idx = this.daftarStok.findIndex(function (s) {
            return s.kode === this.editKodeAsli;
          }.bind(this));
          if (idx !== -1) {
            // Vue 2 reactivity
            this.$set(this.daftarStok, idx, dataBaru);
            this.showToastMsg("Data stok berhasil diperbarui", "success");
          }
        }

        this.tutupForm();
      },

      hapusStok: function (item) {
        if (!confirm("Yakin ingin menghapus \"" + item.judul + "\" (" + item.kode + ")?")) return;
        var idx = this.daftarStok.findIndex(function (s) {
          return s.kode === item.kode;
        });
        if (idx !== -1) {
          this.daftarStok.splice(idx, 1);
          this.showToastMsg("Data berhasil dihapus", "success");
        }
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

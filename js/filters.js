/**
 * filters.js — Vue Filters untuk formatting data teks (Indikator 7)
 * Dipakai: {{ nilai | namaFilter }}
 */
(function () {
  "use strict";

  /* Format angka menjadi Rupiah: 65000 → Rp 65.000 */
  Vue.filter("rupiah", function (value) {
    var n = Number(value);
    if (isNaN(n)) return "Rp 0";
    return "Rp " + n.toLocaleString("id-ID");
  });

  /* Uppercase teks */
  Vue.filter("uppercase", function (value) {
    if (!value && value !== 0) return "";
    return String(value).toUpperCase();
  });

  /* Kapitalisasi kata pertama */
  Vue.filter("capitalize", function (value) {
    if (!value) return "";
    var s = String(value);
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  });

  /* Format tanggal ISO → DD/MM/YYYY */
  Vue.filter("formatDate", function (value) {
    if (!value) return "—";
    var d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    var dd = String(d.getDate()).padStart(2, "0");
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var yyyy = d.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  });

  /* Status stok teks singkat */
  Vue.filter("statusStok", function (item) {
    if (!item) return "—";
    if (item.qty === 0) return "KOSONG";
    if (item.qty < item.safety) return "MENIPIS";
    return "AMAN";
  });

  /* Potong teks panjang */
  Vue.filter("truncate", function (value, length) {
    length = length || 40;
    if (!value) return "";
    var s = String(value);
    return s.length > length ? s.slice(0, length) + "…" : s;
  });
})();

/**
 * dashboard.js
 * Greeting berdasarkan waktu lokal, navigasi, proteksi session,
 * dan konten dinamis untuk fitur Laporan & Histori
 */

(function () {
  "use strict";

  // ---------- Proteksi: harus login dulu ----------
  const userRaw = sessionStorage.getItem("sittaUser");
  if (!userRaw) {
    alert("Anda harus login terlebih dahulu untuk mengakses dashboard");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(userRaw);

  // ---------- Tampilkan info user ----------
  document.getElementById("userName").textContent = user.nama || "User";
  document.getElementById("roleBadge").textContent = user.role || "Operator";

  // ---------- Greeting berdasarkan local time ----------
  function getGreeting() {
    const jam = new Date().getHours();
    if (jam >= 4 && jam < 11) return "Selamat Pagi";
    if (jam >= 11 && jam < 15) return "Selamat Siang";
    if (jam >= 15 && jam < 18) return "Selamat Sore";
    return "Selamat Malam";
  }

  function formatTanggal() {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date().toLocaleDateString("id-ID", options);
  }

  const greetingEl = document.getElementById("greetingText");
  const timeEl = document.getElementById("timeInfo");

  greetingEl.textContent = `${getGreeting()}, ${user.nama}!`;
  timeEl.textContent = formatTanggal();

  // Update jam setiap menit
  setInterval(() => {
    timeEl.textContent = formatTanggal();
  }, 60000);

  // ---------- Toast helper ----------
  function showToast(msg, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
    toast.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ---------- Logout ----------
  document.getElementById("btnLogout").addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Apakah Anda yakin ingin logout?")) {
      sessionStorage.removeItem("sittaUser");
      showToast("Anda telah logout", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 600);
    }
  });

  // ---------- Dropdown Laporan (klik juga mendukung mobile) ----------
  const btnLaporan = document.getElementById("btnLaporan");
  const dropdown = btnLaporan.closest(".dropdown");

  btnLaporan.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });

  // ---------- Konten dinamis (Monitoring, Rekap, Histori) ----------
  const kontenDinamis = document.getElementById("kontenDinamis");
  const kontenJudul = document.getElementById("kontenJudul");
  const kontenBody = document.getElementById("kontenBody");

  function tampilkanKonten(judul, html) {
    kontenJudul.textContent = judul;
    kontenBody.innerHTML = html;
    kontenDinamis.style.display = "block";
    kontenDinamis.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function statusClass(status) {
    const s = String(status || "").toLowerCase();
    if (s.indexOf("dikirim") !== -1 || s.indexOf("selesai") !== -1) return "terkirim";
    if (s.indexOf("perjalanan") !== -1) return "perjalanan";
    if (s.indexOf("batal") !== -1) return "batal";
    return "proses";
  }

  function statusStok(item) {
    // Support both old shape (stok number) and new shape (qty + safety)
    var qty = typeof item === "object" ? Number(item.stok != null ? item.stok : item.qty) : Number(item);
    var safety = typeof item === "object" ? Number(item.safety || 0) : 0;
    if (qty === 0) return "Kosong";
    if (safety > 0 && qty < safety) return "Menipis";
    if (qty <= 50 && safety === 0) return "Menipis";
    return "Aman";
  }

  function renderMonitoring() {
    const list = typeof dataTracking === "object" ? Object.values(dataTracking) : [];
    const rows = list
      .map(function (d) {
        const badgeClass = statusClass(d.status);
        const n = (d.perjalanan && d.perjalanan.length) || 0;
        let progress = 55;
        const s = String(d.status || "").toLowerCase();
        if (s.indexOf("dikirim") !== -1) progress = 100;
        else if (n <= 1) progress = 25;
        else if (n <= 3) progress = 55;
        else progress = 75;
        return (
          "<tr><td><strong>" + d.nomorDO + "</strong></td><td>" + d.nama +
          '</td><td><span class="status-badge ' + badgeClass + '">' + d.status +
          '</span></td><td><div class="progress-bar-bg" style="height:8px;width:100px;display:inline-block;vertical-align:middle;">' +
          '<div class="progress-bar-fill" style="width:' + progress + '%"></div></div> <small>' +
          progress + "%</small></td></tr>"
        );
      })
      .join("");

    tampilkanKonten(
      "Monitoring Pengiriman Bahan Ajar",
      '<div class="table-wrapper"><table><thead><tr><th>No. DO</th><th>Nama</th><th>Status</th><th>Progress</th></tr></thead><tbody>' +
        rows +
        "</tbody></table></div>"
    );
  }

  function renderRekap() {
    const totalStok = dataBahanAjar.reduce(function (s, b) { return s + Number(b.stok); }, 0);
    const tersedia = dataBahanAjar.filter(function (b) { return statusStok(b) === "Aman"; }).length;
    const hampir = dataBahanAjar.filter(function (b) { return statusStok(b) === "Menipis"; }).length;
    const habis = dataBahanAjar.filter(function (b) { return statusStok(b) === "Kosong"; }).length;

    const rows = dataBahanAjar
      .map(function (b) {
        const st = statusStok(b);
        const cls =
          st === "Aman" ? "stok-tersedia" : st === "Menipis" ? "stok-hampir" : "stok-habis";
        return (
          "<tr><td>" + b.kodeBarang + "</td><td>" + b.namaBarang + "</td><td>" +
          (b.jenisBarang || "-") + (b.upbjj ? " · " + b.upbjj : "") + "</td><td>" +
          Number(b.stok).toLocaleString("id-ID") + '</td><td class="' + cls + '">' + st +
          "</td></tr>"
        );
      })
      .join("");

    tampilkanKonten(
      "Rekap Stok Bahan Ajar",
      '<div class="stat-row" style="margin-bottom:1.25rem;">' +
        '<div class="stat-card"><div class="angka">' + totalStok.toLocaleString("id-ID") + '</div><div class="label">Total Stok</div></div>' +
        '<div class="stat-card"><div class="angka" style="color:#10b981">' + tersedia + '</div><div class="label">Aman</div></div>' +
        '<div class="stat-card"><div class="angka" style="color:#f59e0b">' + hampir + '</div><div class="label">Menipis</div></div>' +
        '<div class="stat-card"><div class="angka" style="color:#ef4444">' + habis + '</div><div class="label">Kosong</div></div>' +
        "</div>" +
        '<div class="table-wrapper"><table><thead><tr><th>Kode</th><th>Nama</th><th>Jenis</th><th>Stok</th><th>Status</th></tr></thead><tbody>' +
        rows +
        "</tbody></table></div>"
    );
  }

  function renderHistori() {
    const list = typeof dataTracking === "object" ? Object.values(dataTracking) : [];
    const rows = list
      .map(function (d) {
        const badge = statusClass(d.status);
        return (
          "<tr><td>" + d.nomorDO + "</td><td>" + d.tanggalKirim + "</td><td>" +
          d.nama + " — " + d.ekspedisi + "</td><td>Rp " + Number(d.total || 0).toLocaleString("id-ID") +
          '</td><td><span class="status-badge ' + badge + '">' + d.status +
          "</span></td></tr>"
        );
      })
      .join("");

    tampilkanKonten(
      "Histori Pengiriman Bahan Ajar",
      '<div class="table-wrapper"><table><thead><tr><th>No. DO</th><th>Tanggal</th><th>Deskripsi</th><th>Total</th><th>Status</th></tr></thead><tbody>' +
        rows +
        "</tbody></table></div>"
    );
  }

  document.querySelectorAll("[data-fitur]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const fitur = el.getAttribute("data-fitur");
      if (fitur === "monitoring") renderMonitoring();
      else if (fitur === "rekap") renderRekap();
    });
  });

  document.getElementById("btnHistori").addEventListener("click", function (e) {
    e.preventDefault();
    renderHistori();
  });
  document.getElementById("cardHistori").addEventListener("click", function (e) {
    e.preventDefault();
    renderHistori();
  });

  document.getElementById("statStok").textContent = dataBahanAjar.length;
  document.getElementById("statDO").textContent =
    typeof dataTracking === "object" ? Object.keys(dataTracking).length : 0;
})();

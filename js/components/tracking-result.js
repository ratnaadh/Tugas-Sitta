/**
 * Component: tracking-result
 * Hasil pencarian DO + timeline + progress
 * Name-based index: perjalanan sebagai array
 */
Vue.component("tracking-result", {
  props: {
    hasil: { type: Object, default: null },
    notFound: { type: Boolean, default: false },
    sudahCari: { type: Boolean, default: false },
    progressPersen: { type: Number, default: 0 },
    getNamaPaket: { type: Function, required: true }
  },
  methods: {
    statusClass: function (status) {
      var s = String(status || "").toLowerCase();
      if (s.indexOf("dikirim") !== -1 || s.indexOf("selesai") !== -1) return "terkirim";
      if (s.indexOf("perjalanan") !== -1) return "perjalanan";
      return "proses";
    }
  },
  template: `
    <div>
      <!-- Hasil ditemukan -->
      <section v-if="hasil" class="tracking-result card">
        <div class="card-header tracking-header">
          <span>Hasil Tracking — {{ hasil.nomorDO | uppercase }}</span>
          <span class="status-badge" :class="statusClass(hasil.status)">{{ hasil.status }}</span>
        </div>
        <div class="card-body">
          <div class="tracking-meta">
            <div><strong>NIM</strong><br><span v-text="hasil.nim || '—'"></span></div>
            <div><strong>Nama</strong><br>{{ hasil.nama }}</div>
            <div><strong>Ekspedisi</strong><br>{{ hasil.ekspedisi }}</div>
            <div><strong>Tanggal Kirim</strong><br>{{ hasil.tanggalKirim | formatDate }}</div>
            <div><strong>Paket</strong><br>{{ getNamaPaket(hasil.paket) }} ({{ hasil.paket }})</div>
            <div><strong>Total</strong><br>{{ hasil.total | rupiah }}</div>
          </div>

          <div class="progress-section">
            <div class="progress-label">
              <span>Progress Pengiriman</span>
              <span>{{ progressPersen }}%</span>
            </div>
            <div class="progress-bar large">
              <div class="progress-fill" :style="{ width: progressPersen + '%' }"
                   :class="statusClass(hasil.status)"></div>
            </div>
          </div>

          <h4 class="timeline-title">Riwayat Perjalanan</h4>
          <div class="timeline">
            <div class="timeline-item" v-for="(p, i) in hasil.perjalanan" :key="i">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-time">{{ p.waktu }}</div>
                <div>{{ p.keterangan }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Tidak ditemukan -->
      <section v-if="notFound && sudahCari" class="empty-state card">
        <div class="card-body">
          <p>❌ Nomor DO tidak ditemukan.</p>
          <p class="text-muted">Periksa kembali nomor DO atau buat DO baru.</p>
        </div>
      </section>
    </div>
  `
});

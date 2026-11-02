/**
 * Component: stock-table
 * List rendering v-for + conditional status + kolom cover
 */
Vue.component("stock-table", {
  props: {
    items: { type: Array, default: function () { return []; } },
    viewMode: { type: String, default: "table" },
    hasFilter: { type: Boolean, default: false }
  },
  methods: {
    statusClass: function (item) {
      if (item.qty === 0) return "status-kosong";
      if (item.qty < item.safety) return "status-menipis";
      return "status-aman";
    },
    progressPct: function (item) {
      if (!item.safety || item.safety <= 0) return 100;
      var p = Math.round((item.qty / (item.safety * 2)) * 100);
      return Math.min(100, Math.max(0, p));
    },
    onEdit: function (item) {
      this.$emit("edit", item);
    },
    onDelete: function (item) {
      this.$emit("delete", item);
    },
    onCoverError: function (e) {
      e.target.style.display = "none";
      if (e.target.nextElementSibling) {
        e.target.nextElementSibling.style.display = "flex";
      }
    }
  },
  template: `
    <div>
      <!-- MODE TABEL -->
      <section class="card" v-if="viewMode === 'table'">
        <div class="card-header">Daftar Stok Bahan Ajar</div>
        <div class="table-wrapper">
          <table aria-label="Tabel stok bahan ajar">
            <thead>
              <tr>
                <th>#</th>
                <th>Cover</th>
                <th>Kode</th>
                <th>Judul</th>
                <th>Kategori</th>
                <th>UPBJJ</th>
                <th>Rak</th>
                <th>Harga</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="items.length === 0">
                <td colspan="12" class="empty-cell">
                  <div class="empty-state-inner">
                    <template v-if="hasFilter">
                      <p>Tidak ada data yang cocok dengan filter.</p>
                      <p class="text-muted">Coba reset filter atau ubah kriteria.</p>
                    </template>
                    <template v-else>
                      <p>Belum ada data stok.</p>
                      <p class="text-muted">Klik tombol Tambah untuk menambah bahan ajar.</p>
                    </template>
                  </div>
                </td>
              </tr>

              <tr v-else v-for="(item, idx) in items" :key="item.kode">
                <td v-text="idx + 1"></td>
                <td class="cover-cell">
                  <div class="table-cover">
                    <img v-if="item.cover"
                         :src="item.cover"
                         :alt="item.judul"
                         class="table-cover-img"
                         @error="onCoverError">
                    <span class="table-cover-fallback" v-show="!item.cover">{{ item.kode }}</span>
                  </div>
                </td>
                <td><strong v-text="item.kode"></strong></td>
                <td>{{ item.judul }}</td>
                <td>{{ item.kategori }}</td>
                <td>{{ item.upbjj }}</td>
                <td>{{ item.lokasiRak }}</td>
                <td>{{ item.harga | rupiah }}</td>
                <td>
                  <strong>{{ item.qty }}</strong>
                  <small class="text-muted"> / {{ item.safety }}</small>
                </td>
                <td>
                  <span v-if="item.qty === 0" class="status-badge status-kosong">
                    {{ item | statusStok }}
                  </span>
                  <span v-else-if="item.qty < item.safety" class="status-badge status-menipis">
                    {{ item | statusStok }}
                  </span>
                  <span v-else class="status-badge status-aman">
                    {{ item | statusStok }}
                  </span>
                </td>
                <td>
                  <span v-html="item.catatanHTML || '—'"></span>
                </td>
                <td class="aksi-cell">
                  <button type="button" class="btn btn-sm btn-outline" @click="onEdit(item)" title="Edit">✏️</button>
                  <button type="button" class="btn btn-sm btn-danger-outline" @click="onDelete(item)" title="Hapus">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- MODE KARTU -->
      <section v-else class="card-grid">
        <div v-if="items.length === 0" class="empty-state">
          <p v-if="hasFilter">Tidak ada data yang cocok dengan filter.</p>
          <p v-else>Belum ada data stok.</p>
        </div>

        <article v-for="(item, idx) in items" :key="item.kode" class="stock-card">
          <div class="stock-card-cover">
            <img v-if="item.cover" :src="item.cover" :alt="item.judul" @error="onCoverError">
            <div class="cover-fallback" v-show="!item.cover">{{ item.kode | uppercase }}</div>
            <span class="status-badge" :class="statusClass(item)">{{ item | statusStok }}</span>
          </div>
          <div class="stock-card-body">
            <div class="stock-card-kode" v-text="item.kode"></div>
            <h3 class="stock-card-title">{{ item.judul }}</h3>
            <p class="stock-card-meta">
              {{ item.kategori }} · {{ item.upbjj }} · Rak {{ item.lokasiRak }}
            </p>
            <div class="stock-card-harga">{{ item.harga | rupiah }}</div>
            <div class="stock-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPct(item) + '%' }"
                     :class="statusClass(item)"></div>
              </div>
              <small>Qty {{ item.qty }} / safety {{ item.safety }}</small>
            </div>
            <div class="stock-card-catatan" v-html="item.catatanHTML || ''"></div>
            <div class="stock-card-actions">
              <button type="button" class="btn btn-sm btn-outline" @click="onEdit(item)">Edit</button>
              <button type="button" class="btn btn-sm btn-danger-outline" @click="onDelete(item)">Hapus</button>
            </div>
          </div>
        </article>
      </section>
    </div>
  `
});

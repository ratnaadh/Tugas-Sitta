/**
 * Component: stock-filters
 * Event pakai kebab-case agar kompatibel Vue 2 in-DOM template
 */
Vue.component("stock-filters", {
  props: {
    upbjjList: { type: Array, default: function () { return []; } },
    kategoriOptions: { type: Array, default: function () { return []; } },
    filterUpbjj: { type: String, default: "" },
    filterKategori: { type: String, default: "" },
    filterLowStock: { type: Boolean, default: false },
    sortBy: { type: String, default: "" },
    viewMode: { type: String, default: "table" },
    resultCount: { type: Number, default: 0 }
  },
  methods: {
    onUpbjj: function (e) {
      this.$emit("change-upbjj", e.target.value);
    },
    onKategori: function (e) {
      this.$emit("change-kategori", e.target.value);
    },
    onSort: function (e) {
      this.$emit("change-sort", e.target.value);
    },
    onLowStock: function (e) {
      this.$emit("change-lowstock", e.target.checked);
    },
    onReset: function () {
      this.$emit("reset");
    },
    setView: function (mode) {
      this.$emit("change-view", mode);
    }
  },
  template: `
    <div class="card mb-1">
      <div class="card-body">
        <div class="filter-bar">
          <div class="form-group mb-0">
            <label>Filter UPBJJ</label>
            <select class="form-control" :value="filterUpbjj" @change="onUpbjj">
              <option value="">— Semua UPBJJ —</option>
              <option v-for="u in upbjjList" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>

          <div class="form-group mb-0" v-show="filterUpbjj">
            <label>Kategori</label>
            <select class="form-control" :value="filterKategori" @change="onKategori">
              <option value="">— Semua Kategori —</option>
              <option v-for="k in kategoriOptions" :key="k" :value="k">{{ k }}</option>
            </select>
          </div>

          <div class="form-group mb-0">
            <label>Urutkan</label>
            <select class="form-control" :value="sortBy" @change="onSort">
              <option value="">— Default —</option>
              <option value="judul">Judul</option>
              <option value="kode">Kode</option>
              <option value="qty">Qty</option>
              <option value="harga">Harga</option>
            </select>
          </div>

          <div class="form-group mb-0 flex-align-end">
            <label class="checkbox-label">
              <input type="checkbox" :checked="filterLowStock" @change="onLowStock">
              Hanya stok menipis/kosong
            </label>
          </div>
        </div>

        <div class="filter-actions" style="margin-top:0.75rem;display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
          <button type="button" class="btn btn-outline btn-sm" @click="onReset">
            Reset Filter
          </button>
          <button type="button" class="btn btn-sm"
                  :class="viewMode === 'table' ? 'btn-orange' : 'btn-outline'"
                  @click="setView('table')">
            ☰ Tabel
          </button>
          <button type="button" class="btn btn-sm"
                  :class="viewMode === 'card' ? 'btn-orange' : 'btn-outline'"
                  @click="setView('card')">
            ▦ Kartu
          </button>
          <span class="badge-hasil">{{ resultCount }} hasil</span>
        </div>
      </div>
    </div>
  `
});

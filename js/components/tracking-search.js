/**
 * Component: tracking-search
 * Event kebab-case agar Vue 2 in-DOM template menangkap dengan benar
 */
Vue.component("tracking-search", {
  props: {
    keyword: { type: String, default: "" }
  },
  methods: {
    onInput: function (e) {
      this.$emit("change-keyword", e.target.value);
    },
    onSearch: function () {
      this.$emit("search");
    }
  },
  template: `
    <div class="card mb-1">
      <div class="card-header">Cari Nomor DO</div>
      <div class="card-body search-row">
        <div class="form-group mb-0 grow">
          <label for="keywordDO">Nomor DO</label>
          <input id="keywordDO" type="text" class="form-control"
                 :value="keyword"
                 @input="onInput"
                 @keyup.enter="onSearch"
                 placeholder="Contoh: DO2026-001"
                 autocomplete="off">
          <small class="text-muted">Tekan <kbd>Enter</kbd> untuk mencari</small>
        </div>
        <div class="search-actions">
          <button type="button" class="btn btn-orange" @click="onSearch">
            🔍 Cari
          </button>
        </div>
      </div>
    </div>
  `
});

/**
 * Component: stock-form
 * Form tambah / edit bahan ajar + validasi
 * Keyboard: Enter submit (via form), Esc ditangani parent
 */
Vue.component("stock-form", {
  props: {
    formMode: { type: String, default: null },
    form: { type: Object, required: true },
    formError: { type: Object, default: function () { return {}; } },
    kategoriList: { type: Array, default: function () { return []; } },
    upbjjList: { type: Array, default: function () { return []; } },
    judulForm: { type: String, default: "Form Bahan Ajar" }
  },
  methods: {
    onSubmit: function () {
      this.$emit("submit");
    },
    onCancel: function () {
      this.$emit("cancel");
    }
  },
  template: `
    <section class="card mb-1 form-tambah" v-if="formMode">
      <div class="card-header">{{ judulForm }}</div>
      <div class="card-body">
        <form @submit.prevent="onSubmit">
          <div class="form-grid">
            <div class="form-group">
              <label>Kode MK <span class="req">*</span></label>
              <input type="text" class="form-control" v-model.trim="form.kode"
                     :class="{ 'is-invalid': formError.kode }"
                     placeholder="Contoh: EKMA4116"
                     @keyup.esc="onCancel">
              <small class="error-text" v-if="formError.kode">{{ formError.kode }}</small>
            </div>

            <div class="form-group">
              <label>Judul <span class="req">*</span></label>
              <input type="text" class="form-control" v-model.trim="form.judul"
                     :class="{ 'is-invalid': formError.judul }"
                     placeholder="Nama mata kuliah"
                     @keyup.esc="onCancel">
              <small class="error-text" v-if="formError.judul">{{ formError.judul }}</small>
            </div>

            <div class="form-group">
              <label>Kategori <span class="req">*</span></label>
              <select class="form-control" v-model="form.kategori"
                      :class="{ 'is-invalid': formError.kategori }">
                <option value="">— Pilih —</option>
                <option v-for="k in kategoriList" :key="k" :value="k">{{ k }}</option>
              </select>
              <small class="error-text" v-if="formError.kategori">{{ formError.kategori }}</small>
            </div>

            <div class="form-group">
              <label>UPBJJ <span class="req">*</span></label>
              <select class="form-control" v-model="form.upbjj"
                      :class="{ 'is-invalid': formError.upbjj }">
                <option value="">— Pilih —</option>
                <option v-for="u in upbjjList" :key="u" :value="u">{{ u }}</option>
              </select>
              <small class="error-text" v-if="formError.upbjj">{{ formError.upbjj }}</small>
            </div>

            <div class="form-group">
              <label>Lokasi Rak <span class="req">*</span></label>
              <input type="text" class="form-control" v-model.trim="form.lokasiRak"
                     :class="{ 'is-invalid': formError.lokasiRak }"
                     placeholder="R1-A3">
              <small class="error-text" v-if="formError.lokasiRak">{{ formError.lokasiRak }}</small>
            </div>

            <div class="form-group">
              <label>Harga (Rp) <span class="req">*</span></label>
              <input type="number" class="form-control" v-model.number="form.harga" min="0"
                     :class="{ 'is-invalid': formError.harga }" placeholder="65000">
              <small class="error-text" v-if="formError.harga">{{ formError.harga }}</small>
            </div>

            <div class="form-group">
              <label>Qty <span class="req">*</span></label>
              <input type="number" class="form-control" v-model.number="form.qty" min="0"
                     :class="{ 'is-invalid': formError.qty }" placeholder="10">
              <small class="error-text" v-if="formError.qty">{{ formError.qty }}</small>
            </div>

            <div class="form-group">
              <label>Safety Stock <span class="req">*</span></label>
              <input type="number" class="form-control" v-model.number="form.safety" min="0"
                     :class="{ 'is-invalid': formError.safety }" placeholder="5">
              <small class="error-text" v-if="formError.safety">{{ formError.safety }}</small>
            </div>

            <div class="form-group full">
              <label>Catatan (boleh HTML)</label>
              <input type="text" class="form-control" v-model="form.catatanHTML"
                     placeholder='Contoh: <em>Edisi 2024</em>'>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-orange">
              <span v-if="formMode === 'edit'">Simpan Perubahan</span>
              <span v-else>Simpan Data Baru</span>
            </button>
            <button type="button" class="btn btn-outline" @click="onCancel">Batal (Esc)</button>
          </div>
          <p class="hint-keyboard">Tips: tekan <kbd>Esc</kbd> untuk membatalkan</p>
        </form>
      </div>
    </section>
  `
});

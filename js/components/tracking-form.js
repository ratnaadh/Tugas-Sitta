/**
 * Component: tracking-form
 * Form tambah DO baru + nomor DO otomatis (read-only) + detail paket
 */
Vue.component("tracking-form", {
  props: {
    show: { type: Boolean, default: false },
    form: { type: Object, required: true },
    errors: { type: Object, default: function () { return {}; } },
    paketList: { type: Array, default: function () { return []; } },
    pengirimanList: { type: Array, default: function () { return []; } },
    selectedPaket: { type: Object, default: null },
    selectedEkspedisi: { type: Object, default: null },
    ongkir: { type: Number, default: 0 },
    totalHarga: { type: Number, default: 0 },
    nextNomorDo: { type: String, default: "" },
    getJudulMk: { type: Function, required: true }
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
    <section class="card mb-1" v-if="show">
      <div class="card-header">Tambah Delivery Order Baru</div>
      <div class="card-body">
        <form @submit.prevent="onSubmit">
          <div class="form-grid">
            <div class="form-group form-group-full">
              <label>Masukkan nomor DO</label>
              <input type="text"
                     class="form-control form-control-readonly"
                     :value="nextNomorDo"
                     readonly
                     disabled
                     tabindex="-1"
                     aria-readonly="true"
                     title="Nomor DO digenerate otomatis mengikuti urutan sebelumnya">
              <small class="text-muted">
                *tidak bisa diisi karena mengikuti nomor DO sebelumnya (otomatis)
              </small>
            </div>

            <div class="form-group">
              <label>NIM <span class="req">*</span></label>
              <input type="text" class="form-control" v-model.trim="form.nim"
                     :class="{ 'is-invalid': errors.nim }"
                     placeholder="123456789"
                     @keyup.esc="onCancel">
              <small class="error-text" v-if="errors.nim">{{ errors.nim }}</small>
            </div>

            <div class="form-group">
              <label>Nama Mahasiswa <span class="req">*</span></label>
              <input type="text" class="form-control" v-model.trim="form.nama"
                     :class="{ 'is-invalid': errors.nama }"
                     placeholder="Nama lengkap"
                     @keyup.esc="onCancel">
              <small class="error-text" v-if="errors.nama">{{ errors.nama }}</small>
            </div>

            <div class="form-group">
              <label>Ekspedisi <span class="req">*</span></label>
              <select class="form-control" v-model="form.ekspedisi"
                      :class="{ 'is-invalid': errors.ekspedisi }">
                <option value="">— Pilih —</option>
                <option v-for="e in pengirimanList" :key="e.kode" :value="e.kode">
                  {{ e.nama }} ({{ e.harga | rupiah }})
                </option>
              </select>
              <small class="error-text" v-if="errors.ekspedisi">{{ errors.ekspedisi }}</small>
            </div>

            <div class="form-group">
              <label>Paket Bahan Ajar <span class="req">*</span></label>
              <select class="form-control" v-model="form.paketKode"
                      :class="{ 'is-invalid': errors.paketKode }">
                <option value="">— Pilih paket —</option>
                <option v-for="p in paketList" :key="p.kode" :value="p.kode">
                  {{ p.nama }} — {{ p.harga | rupiah }}
                </option>
              </select>
              <small class="error-text" v-if="errors.paketKode">{{ errors.paketKode }}</small>
            </div>

            <div class="form-group">
              <label>Tanggal Kirim <span class="req">*</span></label>
              <input type="date" class="form-control" v-model="form.tanggalKirim"
                     :class="{ 'is-invalid': errors.tanggalKirim }">
              <small class="error-text" v-if="errors.tanggalKirim">{{ errors.tanggalKirim }}</small>
            </div>
          </div>

          <div class="paket-detail" v-if="selectedPaket">
            <strong>Isi Paket {{ selectedPaket.kode | uppercase }}:</strong>
            <ul>
              <li v-for="(kodeMk, i) in selectedPaket.isi" :key="i">
                <strong v-text="kodeMk"></strong> — {{ getJudulMk(kodeMk) }}
              </li>
            </ul>
            <p>
              Harga paket: <strong>{{ selectedPaket.harga | rupiah }}</strong>
              <span v-if="selectedEkspedisi">
                · Ongkir {{ selectedEkspedisi.nama }}: <strong>{{ ongkir | rupiah }}</strong>
              </span>
              <span v-if="selectedPaket">
                · <strong>Total {{ totalHarga | rupiah }}</strong>
              </span>
            </p>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-orange">Simpan DO</button>
            <button type="button" class="btn btn-outline" @click="onCancel">Batal (Esc)</button>
          </div>
          <p class="hint-keyboard">Tips: <kbd>Enter</kbd> simpan · <kbd>Esc</kbd> batal</p>
        </form>
      </div>
    </section>
  `
});

/**
 * Component: stock-summary
 * Ringkasan statistik stok — class stat-row / stat-card dari style.css
 */
Vue.component("stock-summary", {
  props: {
    totalItem: { type: Number, default: 0 },
    totalQty: { type: Number, default: 0 },
    jumlahMenipis: { type: Number, default: 0 },
    jumlahKosong: { type: Number, default: 0 }
  },
  template: `
    <div class="stat-row mb-1" aria-label="Ringkasan stok">
      <div class="stat-card">
        <div class="angka">{{ totalItem }}</div>
        <div class="label">Total Item</div>
      </div>
      <div class="stat-card">
        <div class="angka">{{ totalQty }}</div>
        <div class="label">Total Qty</div>
      </div>
      <div class="stat-card">
        <div class="angka" style="color:#f59e0b">{{ jumlahMenipis }}</div>
        <div class="label">Menipis</div>
      </div>
      <div class="stat-card">
        <div class="angka" style="color:#ef4444">{{ jumlahKosong }}</div>
        <div class="label">Kosong</div>
      </div>
    </div>
  `
});

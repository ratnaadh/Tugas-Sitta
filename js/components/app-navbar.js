/**
 * Component: app-navbar
 * Beranda = index.html (isi sama dengan dashboard)
 */
Vue.component("app-navbar", {
  props: {
    active: { type: String, default: "" }
  },
  template: `
    <nav class="navbar" role="navigation" aria-label="Menu utama">
      <div class="container">
        <a href="index.html" class="navbar-brand">
          <img src="assets/LOGO-WHITE.png" alt="Logo UT" width="55" height="40">
          <span>SITTA</span>UNIVERSITAS TERBUKA
        </a>
        <ul class="navbar-nav">
          <li>
            <a href="index.html" class="nav-link" :class="{ active: active === 'dashboard' || active === 'home' }">Beranda</a>
          </li>
          <li>
            <a href="stok.html" class="nav-link" :class="{ active: active === 'stok' }">Informasi Bahan Ajar</a>
          </li>
          <li>
            <a href="tracking.html" class="nav-link" :class="{ active: active === 'tracking' }">Tracking Pengiriman</a>
          </li>
        </ul>
      </div>
    </nav>
  `
});

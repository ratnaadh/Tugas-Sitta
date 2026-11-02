/**
 * Component: app-toast
 * Custom element <app-toast> — notifikasi sukses/error
 */
Vue.component("app-toast", {
  props: {
    show: { type: Boolean, default: false },
    message: { type: String, default: "" },
    type: { type: String, default: "info" }
  },
  template: `
    <transition name="toast-fade">
      <div v-show="show" class="toast" :class="type" role="alert">
        <span v-if="type === 'success'">✅</span>
        <span v-else-if="type === 'error'">❌</span>
        <span v-else-if="type === 'warning'">⚠️</span>
        <span v-else>ℹ️</span>
        <span v-text="message"></span>
      </div>
    </transition>
  `
});

/**
 * auth.js — Login memakai dataPengguna + verifikasi password ter-hash (SHA-256)
 */
(function () {
  "use strict";

  const formLogin = document.getElementById("formLogin");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const btnTogglePassword = document.getElementById("btnTogglePassword");
  const btnLupaPassword = document.getElementById("btnLupaPassword");
  const btnDaftar = document.getElementById("btnDaftar");
  const modalLupa = document.getElementById("modalLupaPassword");
  const modalDaftar = document.getElementById("modalDaftar");
  const toastContainer = document.getElementById("toastContainer");
  const btnKirimReset = document.getElementById("btnKirimReset");
  const btnSubmitDaftar = document.getElementById("btnSubmitDaftar");

  if (!formLogin || !emailInput || !passwordInput) {
    console.error("auth.js: elemen form/email/password tidak ditemukan.");
    return;
  }

  function showToast(message, type) {
    type = type || "info";
    if (!toastContainer) { alert(message); return; }
    const toast = document.createElement("div");
    toast.className = "toast " + type;
    const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
    toast.innerHTML = "<span>" + (icons[type] || icons.info) + "</span><span>" + message + "</span>";
    toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(40px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(function () { toast.remove(); }, 300);
    }, 3200);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const modal = btn.closest(".modal-overlay");
      if (modal) closeModal(modal);
    });
  });
  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal(overlay);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.show").forEach(closeModal);
    }
  });

  if (btnTogglePassword) {
    btnTogglePassword.addEventListener("click", function () {
      const isPassword = passwordInput.type === "password";
      const icon = btnTogglePassword.querySelector("i");
      passwordInput.type = isPassword ? "text" : "password";
      if (icon) {
        icon.className = isPassword
          ? "fa-sharp fa-solid fa-eye-slash"
          : "fa-sharp fa-solid fa-eye";
      }
      btnTogglePassword.setAttribute(
        "aria-label",
        isPassword ? "Sembunyikan password" : "Tampilkan password"
      );
    });
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }
  function setFieldState(input, isValid) {
    if (!input) return;
    input.classList.remove("is-valid", "is-invalid");
    input.classList.add(isValid ? "is-valid" : "is-invalid");
  }

  emailInput.addEventListener("blur", function () {
    setFieldState(emailInput, validateEmail(emailInput.value));
  });
  passwordInput.addEventListener("blur", function () {
    setFieldState(passwordInput, passwordInput.value.trim().length > 0);
  });

  /**
   * Hash password (SHA-256). Fallback jika hashPassword global belum ada.
   */
  async function hashPwd(plain) {
    if (typeof hashPassword === "function") {
      return hashPassword(plain);
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(String(plain));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  // ---------- Login: bandingkan hash, bukan plaintext ----------
  formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let valid = true;

    if (!validateEmail(email)) { setFieldState(emailInput, false); valid = false; }
    else { setFieldState(emailInput, true); }
    if (!password) { setFieldState(passwordInput, false); valid = false; }
    else { setFieldState(passwordInput, true); }
    if (!valid) { showToast("Mohon lengkapi form dengan benar", "warning"); return; }

    if (typeof dataPengguna === "undefined" || !Array.isArray(dataPengguna)) {
      alert("Data Pengguna tidak tersedia. Tidak dapat memverifikasi login");
      return;
    }

    const btnLogin = document.getElementById("btnLogin");
    if (btnLogin) {
      btnLogin.disabled = true;
      btnLogin.textContent = "Memeriksa...";
    }

    try {
      const passwordHash = await hashPwd(password);

      const user = dataPengguna.find(function (u) {
        return (
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === passwordHash
        );
      });

      if (user) {
        sessionStorage.setItem("sittaUser", JSON.stringify({
          id: user.id,
          email: user.email,
          nama: user.nama,
          role: user.role,
          lokasi: user.lokasi,
          loginAt: new Date().toISOString()
        }));
        showToast("Login berhasil! Selamat datang, " + user.nama, "success");
        setTimeout(function () { window.location.href = "dashboard.html"; }, 900);
      } else {
        alert("Email atau password tidak sesuai");
        showToast("Email atau password tidak sesuai", "error");
        passwordInput.value = "";
        passwordInput.focus();
        setFieldState(passwordInput, false);
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan saat memverifikasi login", "error");
    } finally {
      if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.textContent = "Login";
      }
    }
  });

  if (btnLupaPassword) {
    btnLupaPassword.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(modalLupa);
    });
  }
  if (btnKirimReset) {
    btnKirimReset.addEventListener("click", function () {
      const el = document.getElementById("emailLupa");
      const emailLupa = el ? el.value.trim() : "";
      if (!validateEmail(emailLupa)) { showToast("Masukkan email yang valid", "warning"); return; }
      closeModal(modalLupa);
      showToast("Tautan reset password telah dikirim ke " + emailLupa + " (simulasi).", "success");
      if (el) el.value = "";
    });
  }
  if (btnDaftar) {
    btnDaftar.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(modalDaftar);
    });
  }

  // Pendaftaran: simpan password dalam bentuk hash
  if (btnSubmitDaftar) {
    btnSubmitDaftar.addEventListener("click", async function () {
      const nama = ((document.getElementById("namaDaftar") || {}).value || "").trim();
      const email = ((document.getElementById("emailDaftar") || {}).value || "").trim();
      const pass = (document.getElementById("passwordDaftar") || {}).value || "";
      const konfirmasi = (document.getElementById("konfirmasiPassword") || {}).value || "";

      if (!nama || !validateEmail(email) || pass.length < 6) {
        showToast("Mohon lengkapi password dengan benar", "warning");
        return;
      }
      if (pass !== konfirmasi) {
        showToast("Konfirmasi password tidak cocok", "error");
        return;
      }

      try {
        const passwordHash = await hashPwd(pass);
        if (typeof dataPengguna !== "undefined") {
          dataPengguna.push({
            id: dataPengguna.length + 1,
            nama: nama,
            email: email,
            password: passwordHash,
            role: "UPBJJ-UT",
            lokasi: "Baru"
          });
        }
        closeModal(modalDaftar);
        showToast("Akun " + nama + " berhasil didaftarkan", "success");
        const f = document.getElementById("formDaftar");
        if (f) f.reset();
      } catch (err) {
        console.error(err);
        showToast("Terjadi kesalahan saat mendaftarkan akun", "error");
      }
    });
  }
})();

/* =========================================================
   AgroGest Distribuciones - Lógica de autenticación (auth.js)
   Aplica a: inicio-sesion.html, Recupera-tu-acceso.html, codigo-de-verificacion.html
   ========================================================= */

(function () {
    "use strict";

    function maskEmail(email) {
        const parts = email.split("@");
        if (parts.length !== 2) return email;
        const local = parts[0];
        const visible = local.slice(0, Math.min(2, local.length));
        return visible + "****@" + parts[1];
    }

    function initLogin() {
        const form = document.getElementById("formLogin");
        if (!form) return;

        const emailInput = document.getElementById("email");
        const passInput = document.getElementById("contrasena");
        const rememberCheck = document.getElementById("recordar");
        const togglePassBtn = document.getElementById("togglePassword");
        const errorLogin = document.getElementById("errorLogin");

        const savedEmail = localStorage.getItem("agrogest_recordar_correo");
        if (savedEmail && emailInput) {
            emailInput.value = savedEmail;
            if (rememberCheck) rememberCheck.checked = true;
        }

        if (togglePassBtn && passInput) {
            togglePassBtn.addEventListener("click", function () {
                const isPassword = passInput.type === "password";
                passInput.type = isPassword ? "text" : "password";
                const icon = togglePassBtn.querySelector("i");
                if (icon) {
                    icon.className = isPassword ? "bi bi-eye-slash" : "bi bi-eye";
                }
            });
        }

        [emailInput, passInput].forEach(function (input) {
            if (!input) return;
            input.addEventListener("input", function () {
                input.setCustomValidity("");
                if (errorLogin) errorLogin.hidden = true;
            });
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const emailVal = emailInput ? emailInput.value.trim() : "";
            const passVal = passInput ? passInput.value : "";

            if (errorLogin) errorLogin.hidden = true;

            if (emailInput) {
                const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
                emailInput.setCustomValidity(emailValid ? "" : "Correo inválido");
            }
            if (passInput) {
                passInput.setCustomValidity(passVal.length > 0 ? "" : "Ingresa tu contraseña");
            }

            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                window.AgroGest.showToast("Ingresa tu correo electrónico y contraseña.", "error");
                return;
            }

            const usuario = typeof autenticarUsuario === "function"
                ? autenticarUsuario(emailVal, passVal)
                : null;

            if (!usuario) {
                if (errorLogin) {
                    errorLogin.textContent = "Correo o contraseña incorrectos. Verifica con los datos registrados en Mi perfil.";
                    errorLogin.hidden = false;
                }
                window.AgroGest.showToast("Correo o contraseña incorrectos.", "error");
                return;
            }

            if (rememberCheck && rememberCheck.checked) {
                localStorage.setItem("agrogest_recordar_correo", usuario.correo);
            } else {
                localStorage.removeItem("agrogest_recordar_correo");
            }

            sessionStorage.setItem("agrogest_usuario_id", String(usuario.id));
            sessionStorage.setItem("agrogest_usuario_activo", usuario.correo);
            sessionStorage.setItem("agrogest_usuario_nombre", (usuario.nombres + " " + usuario.apellidos).trim());
            sessionStorage.setItem("agrogest_usuario_rol", typeof nombreRol === "function" ? nombreRol(usuario.rol) : usuario.rol);
            window.location.href = "index.html";
        });
    }

    function initRecovery() {
        const form = document.getElementById("formRecuperar");
        if (!form) return;

        const emailInput = document.getElementById("correo");

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const emailVal = emailInput ? emailInput.value.trim() : "";
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

            if (emailInput) {
                emailInput.setCustomValidity(emailValid ? "" : "Correo inválido");
            }

            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                window.AgroGest.showToast("Ingresa un correo electrónico válido.", "error");
                return;
            }

            sessionStorage.setItem("agrogest_recovery_email", emailVal);
            window.location.href = "codigo-de-verificacion.html";
        });
    }

    function initVerification() {
        const form = document.getElementById("formVerificacion");
        if (!form) return;

        const inputs = Array.from(form.querySelectorAll(".otp-input"));
        const maskedEl = document.getElementById("correoEnmascarado");
        const resendBtn = document.getElementById("btnReenviar");
        const errorEl = document.getElementById("errorCodigo");

        const recoveryEmail = sessionStorage.getItem("agrogest_recovery_email");
        if (maskedEl && recoveryEmail) {
            maskedEl.textContent = maskEmail(recoveryEmail);
        }

        inputs.forEach(function (input, idx) {
            input.addEventListener("input", function () {
                input.value = input.value.replace(/\D/g, "").slice(0, 1);
                if (errorEl) errorEl.hidden = true;
                if (input.value && idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                }
            });

            input.addEventListener("keydown", function (event) {
                if (event.key === "Backspace" && !input.value && idx > 0) {
                    inputs[idx - 1].focus();
                }
            });

            input.addEventListener("paste", function (event) {
                event.preventDefault();
                const text = (event.clipboardData || window.clipboardData).getData("text");
                const digits = text.replace(/\D/g, "").slice(0, inputs.length);
                digits.split("").forEach(function (digit, i) {
                    if (inputs[i]) inputs[i].value = digit;
                });
                const nextIdx = Math.min(digits.length, inputs.length - 1);
                if (inputs[nextIdx]) inputs[nextIdx].focus();
                if (errorEl) errorEl.hidden = true;
            });
        });

        if (resendBtn) {
            resendBtn.addEventListener("click", function (event) {
                event.preventDefault();
                inputs.forEach(function (inp) {
                    inp.value = "";
                });
                if (inputs[0]) inputs[0].focus();
                if (errorEl) errorEl.hidden = true;
                window.AgroGest.showToast("Se ha reenviado un nuevo código a tu correo.", "success");
            });
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const code = inputs.map(function (inp) { return inp.value.trim(); }).join("");
            if (code.length < inputs.length) {
                if (errorEl) errorEl.hidden = false;
                const firstEmpty = inputs.find(function (inp) { return !inp.value; });
                if (firstEmpty) firstEmpty.focus();
                window.AgroGest.showToast("Ingresa los 4 dígitos del código.", "error");
                return;
            }
            window.location.href = "index.html";
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initLogin();
        initRecovery();
        initVerification();
    });
})();

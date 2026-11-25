/* =========================================================
   AgroGest Distribuciones - Utilidades compartidas (common.js)
   ========================================================= */

(function () {
    "use strict";

    let toastTimer = null;

    function getOrCreateToast() {
        let el = document.getElementById("agroToast");
        if (!el) {
            el = document.createElement("div");
            el.id = "agroToast";
            el.className = "agro-toast";
            el.setAttribute("role", "status");
            el.setAttribute("aria-live", "polite");
            document.body.appendChild(el);
        }
        return el;
    }

    function showToast(message, type) {
        const el = getOrCreateToast();
        el.textContent = message;
        el.classList.remove("is-error", "is-success", "is-visible");
        if (type === "error") {
            el.classList.add("is-error");
        } else if (type === "success") {
            el.classList.add("is-success");
        }
        // Force reflow for repeated triggers
        void el.offsetWidth;
        el.classList.add("is-visible");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            el.classList.remove("is-visible");
        }, 2800);
    }

    function formatCOP(value) {
        const num = Math.round(Number(value) || 0);
        return "$" + num.toLocaleString("es-CO") + " COP";
    }

    function formatShortCOP(value) {
        const num = Math.round(Number(value) || 0);
        return "$" + num.toLocaleString("es-CO");
    }

    function getStore(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
            return fallback;
        }
    }

    function setStore(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            // Ignora errores de almacenamiento en modo privado
        }
    }

    function initSessionMenu() {
        const savedName = sessionStorage.getItem("agrogest_usuario_nombre");
        const savedEmail = sessionStorage.getItem("agrogest_usuario_activo");
        const savedRol = sessionStorage.getItem("agrogest_usuario_rol");

        const btnSesion = document.querySelector(".btn-sesion");
        const header = document.querySelector(".dropdown-menu-agrogest .dropdown-header");

        if (btnSesion && savedName) {
            btnSesion.textContent = savedName;
        }
        if (header && savedEmail) {
            header.textContent = savedRol ? savedRol + " • " + savedEmail : savedEmail;
        }

        const logoutLink = document.querySelector('.dropdown-menu-agrogest a[href="inicio-sesion.html"]');
        if (logoutLink) {
            logoutLink.addEventListener("click", function () {
                sessionStorage.removeItem("agrogest_usuario_id");
                sessionStorage.removeItem("agrogest_usuario_activo");
                sessionStorage.removeItem("agrogest_usuario_nombre");
                sessionStorage.removeItem("agrogest_usuario_rol");
            });
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        initSessionMenu();
    });

    window.AgroGest = {
        showToast: showToast,
        formatCOP: formatCOP,
        formatShortCOP: formatShortCOP,
        getStore: getStore,
        setStore: setStore
    };
})();

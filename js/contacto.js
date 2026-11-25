/* =========================================================
   AgroGest Distribuciones - Contacto (contacto.js)
   ========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("formContacto");
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                window.AgroGest.showToast("Por favor completa todos los campos obligatorios.", "error");
                return;
            }

            form.reset();
            form.classList.remove("was-validated");
            window.AgroGest.showToast("Mensaje enviado correctamente. Te responderemos pronto.", "success");
        });
    });
})();

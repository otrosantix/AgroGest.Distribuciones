/* =========================================================
   AgroGest Distribuciones - Nuevo Proveedor (nuevo-proveedor.js)
   ========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("formNuevoProveedor");
        if (!form) return;

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                window.AgroGest.showToast("Completa los campos obligatorios del proveedor.", "error");
                return;
            }

            const proveedores = window.AgroGest.getStore("agrogest_proveedores", []);
            proveedores.push({
                empresa: document.getElementById("nombre-empresa").value.trim(),
                nit: document.getElementById("nit").value.trim(),
                telefono: document.getElementById("telefono").value.trim(),
                correo: document.getElementById("correo").value.trim(),
                direccion: document.getElementById("direccion").value.trim(),
                observaciones: document.getElementById("observaciones").value.trim()
            });

            window.AgroGest.setStore("agrogest_proveedores", proveedores);
            window.location.href = "control-pedidos.html";
        });
    });
})();

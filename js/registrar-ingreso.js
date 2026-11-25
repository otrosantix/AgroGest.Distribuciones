/* =========================================================
   AgroGest Distribuciones - Nuevo Ingreso (registrar-ingreso.js)
   ========================================================= */

(function () {
    "use strict";

    const DEFAULT_STOCK = {
        "PRO-0001": 120,
        "PRO-0103": 25,
        "PRO-0052": 8
    };

    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("formNuevoIngreso");
        if (!form) return;

        const proveedorSelect = document.getElementById("ingresoProveedor");
        const facturaInput = document.getElementById("ingresoFactura");
        const productoSelect = document.getElementById("ingresoProducto");
        const cantidadInput = document.getElementById("ingresoCantidad");

        // Carga proveedores registrados desde nuevo-proveedor.html si existen
        const extraProviders = window.AgroGest.getStore("agrogest_proveedores", []);
        if (proveedorSelect && Array.isArray(extraProviders)) {
            extraProviders.forEach(function (p) {
                const opt = document.createElement("option");
                opt.value = p.empresa;
                opt.textContent = p.empresa;
                proveedorSelect.appendChild(opt);
            });
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const qty = Number(cantidadInput ? cantidadInput.value : 0);
            if (cantidadInput) {
                cantidadInput.setCustomValidity(qty > 0 ? "" : "Cantidad debe ser mayor a 0");
            }

            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                window.AgroGest.showToast("Completa todos los campos obligatorios del ingreso.", "error");
                return;
            }

            const prodCode = productoSelect.value;
            const stored = window.AgroGest.getStore("agrogest_inventario_stock", {});
            const current = stored[prodCode] !== undefined ? Number(stored[prodCode]) : (DEFAULT_STOCK[prodCode] || 0);
            stored[prodCode] = current + qty;
            window.AgroGest.setStore("agrogest_inventario_stock", stored);

            window.location.href = "Inventario-admin.html";
        });
    });
})();

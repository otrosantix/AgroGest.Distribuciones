/* =========================================================
   AgroGest Distribuciones - Inventario (inventario-modal-configurar-stock.js)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    let filaActual = null;
    let stockActual = 0;

    const elementoModal = document.getElementById("modalStock");
    const inputCantidad = document.getElementById("cantidad");
    const tipoAjuste = document.getElementById("tipoAjuste");
    const errorModal = document.getElementById("errorModalStock");
    const btnExportar = document.getElementById("btnExportarInventario");

    function updateRowStatus(fila, nuevoStock) {
        const minStock = parseInt(fila.dataset.min || "0", 10);
        const estadoEl = fila.querySelector(".estado-texto");
        if (!estadoEl) return;

        estadoEl.classList.remove("verde", "rojo", "naranja");

        if (nuevoStock < minStock) {
            estadoEl.classList.add("rojo");
            estadoEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Bajo stock';
        } else if (nuevoStock <= Math.round(minStock * 1.6)) {
            estadoEl.classList.add("naranja");
            estadoEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Próximo a agotar';
        } else {
            estadoEl.classList.add("verde");
            estadoEl.innerHTML = '<i class="fa-solid fa-check-circle"></i> Estable';
        }
    }

    function applyStoredStock() {
        const stored = window.AgroGest.getStore("agrogest_inventario_stock", {});
        document.querySelectorAll("#tablaInventario tbody tr").forEach(function (fila) {
            const code = fila.dataset.codigo;
            if (code && stored[code] !== undefined) {
                const stockSpan = fila.querySelector(".stock-valor");
                if (stockSpan) {
                    stockSpan.textContent = stored[code];
                }
                updateRowStatus(fila, Number(stored[code]));
            }
        });
    }

    applyStoredStock();

    document.querySelectorAll(".btn-config").forEach(function (boton) {
        boton.addEventListener("click", function (evento) {
            evento.preventDefault();

            filaActual = boton.closest("tr");
            const nombre = filaActual.querySelector(".producto-nombre").textContent;
            const codigo = filaActual.dataset.codigo || "";
            const unidad = filaActual.dataset.unidad || "";
            const stockSpan = filaActual.querySelector(".stock-valor");
            stockActual = parseInt(stockSpan.textContent, 10) || 0;

            document.getElementById("modalNombre").textContent = nombre;
            document.getElementById("modalDetalle").textContent = "Código: " + codigo + " | Unidad: " + unidad;
            document.getElementById("modalStockActual").textContent = stockActual;

            inputCantidad.value = 0;
            tipoAjuste.selectedIndex = 0;
            if (errorModal) errorModal.hidden = true;

            bootstrap.Modal.getOrCreateInstance(elementoModal).show();
        });
    });

    const btnSumar = document.getElementById("btnSumar");
    const btnRestar = document.getElementById("btnRestar");
    const btnGuardar = document.getElementById("btnGuardar");

    if (btnSumar) {
        btnSumar.addEventListener("click", function () {
            inputCantidad.value = (Number(inputCantidad.value) || 0) + 1;
        });
    }

    if (btnRestar) {
        btnRestar.addEventListener("click", function () {
            const nuevo = Math.max(0, (Number(inputCantidad.value) || 0) - 1);
            inputCantidad.value = nuevo;
        });
    }

    if (btnGuardar) {
        btnGuardar.addEventListener("click", function () {
            const cantidad = Number(inputCantidad.value);

            function fail(msg) {
                if (errorModal) {
                    errorModal.textContent = msg;
                    errorModal.hidden = false;
                } else {
                    window.AgroGest.showToast(msg, "error");
                }
            }

            if (tipoAjuste.value === "") {
                return fail("Selecciona el tipo de ajuste.");
            }
            if (inputCantidad.value === "" || Number.isNaN(cantidad) || cantidad < 0) {
                return fail("Escribe una cantidad válida.");
            }
            if (cantidad === 0 && tipoAjuste.value !== "correccion") {
                return fail("La cantidad debe ser mayor a 0.");
            }

            let nuevoStock = stockActual;
            if (tipoAjuste.value === "entrada") {
                nuevoStock = stockActual + cantidad;
            } else if (tipoAjuste.value === "salida") {
                nuevoStock = stockActual - cantidad;
            } else {
                nuevoStock = cantidad;
            }

            if (nuevoStock < 0) {
                return fail("El stock no puede quedar negativo.");
            }

            const stockSpan = filaActual.querySelector(".stock-valor");
            if (stockSpan) stockSpan.textContent = nuevoStock;
            updateRowStatus(filaActual, nuevoStock);

            const code = filaActual.dataset.codigo;
            if (code) {
                const stored = window.AgroGest.getStore("agrogest_inventario_stock", {});
                stored[code] = nuevoStock;
                window.AgroGest.setStore("agrogest_inventario_stock", stored);
            }

            bootstrap.Modal.getInstance(elementoModal).hide();
            window.AgroGest.showToast("Stock actualizado correctamente.", "success");
        });
    }

    if (btnExportar) {
        btnExportar.addEventListener("click", function () {
            const rows = [["Codigo", "Producto", "Categoria", "Stock Actual", "Unidad", "Stock Minimo", "Estado"]];
            document.querySelectorAll("#tablaInventario tbody tr").forEach(function (tr) {
                const codigo = tr.dataset.codigo || "";
                const nombre = tr.querySelector(".producto-nombre").textContent.trim();
                const categoria = tr.cells[1].textContent.trim();
                const stock = tr.querySelector(".stock-valor").textContent.trim();
                const unidad = tr.dataset.unidad || "";
                const min = tr.dataset.min || "";
                const estado = tr.querySelector(".estado-texto").textContent.trim();
                rows.push([codigo, nombre, categoria, stock, unidad, min, estado]);
            });

            const csv = rows.map(function (r) {
                return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(",");
            }).join("\n");

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "inventario-agrogest.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            window.AgroGest.showToast("Reporte de inventario descargado.", "success");
        });
    }
});

/* =========================================================
   AgroGest Distribuciones - Formulario de Producto (producto-form.js)
   Aplica a: nuevo-producto.html y editar-producto.html
   ========================================================= */

(function () {
    "use strict";

    function parsePrice(value) {
        const digits = String(value || "").replace(/[^\d]/g, "");
        return digits ? Number(digits) : 0;
    }

    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("formProducto");
        if (!form) return;

        const isEdit = form.dataset.mode === "edit";
        const params = new URLSearchParams(window.location.search);
        const editId = params.get("id");

        const codigoEl = document.getElementById("prodCodigo");
        const nombreEl = document.getElementById("prodNombre");
        const marcaEl = document.getElementById("prodMarca");
        const categoriaEl = document.getElementById("prodCategoria");
        const proveedorEl = document.getElementById("prodProveedor");
        const nitEl = document.getElementById("prodNit");
        const presentacionEl = document.getElementById("prodPresentacion");
        const unidadEl = document.getElementById("prodUnidad");
        const estadoEl = document.getElementById("prodEstado");
        const compraEl = document.getElementById("prodPrecioCompra");
        const ventaEl = document.getElementById("prodPrecioVenta");
        const stockMinEl = document.getElementById("prodStockMin");
        const descEl = document.getElementById("prodDescripcion");

        const btnSelectImg = document.getElementById("btnSeleccionarImagen");
        const inputImg = document.getElementById("inputImagenProducto");
        const previewImg = document.getElementById("previewImagenProducto");
        const iconDefault = document.getElementById("iconoImagenDefecto");

        const products = window.AgroGest.getStore("agrogest_productos", []);
        let currentProduct = null;

        if (isEdit && editId && Array.isArray(products)) {
            currentProduct = products.find(function (p) { return String(p.id) === String(editId); });
            if (currentProduct) {
                if (codigoEl) codigoEl.value = currentProduct.codigo || "";
                if (nombreEl) nombreEl.value = currentProduct.nombre || "";
                if (marcaEl) marcaEl.value = currentProduct.marca || "";
                if (categoriaEl) {
                    const targetCat = (currentProduct.categoria || "").toLowerCase();
                    Array.from(categoriaEl.options).forEach(function (opt) {
                        if (opt.value.toLowerCase() === targetCat || opt.textContent.toLowerCase() === targetCat) {
                            categoriaEl.value = opt.value;
                        }
                    });
                }
                if (proveedorEl && currentProduct.proveedor) proveedorEl.value = currentProduct.proveedor;
                if (nitEl) nitEl.value = currentProduct.nit || "";
                if (presentacionEl) presentacionEl.value = currentProduct.presentacion || "";
                if (unidadEl && currentProduct.unidad) unidadEl.value = currentProduct.unidad;
                if (estadoEl && currentProduct.estado) estadoEl.value = currentProduct.estado;
                if (compraEl) compraEl.value = currentProduct.precioCompra || 0;
                if (ventaEl) ventaEl.value = currentProduct.precioVenta || 0;
                if (stockMinEl) stockMinEl.value = currentProduct.stockMinimo || 0;
                if (descEl) descEl.value = currentProduct.descripcion || "";
            }
        }

        if (btnSelectImg && inputImg) {
            btnSelectImg.addEventListener("click", function () {
                inputImg.click();
            });

            inputImg.addEventListener("change", function () {
                const file = inputImg.files && inputImg.files[0];
                if (!file) return;

                if (file.size > 2 * 1024 * 1024) {
                    window.AgroGest.showToast("La imagen supera el máximo de 2 MB.", "error");
                    inputImg.value = "";
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    if (previewImg) {
                        previewImg.src = e.target.result;
                        previewImg.hidden = false;
                    }
                    if (iconDefault) iconDefault.hidden = true;
                };
                reader.readAsDataURL(file);
            });
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const precioCompra = parsePrice(compraEl ? compraEl.value : 0);
            const precioVenta = parsePrice(ventaEl ? ventaEl.value : 0);

            if (compraEl) compraEl.setCustomValidity(precioCompra > 0 ? "" : "Inválido");
            if (ventaEl) ventaEl.setCustomValidity(precioVenta > 0 ? "" : "Inválido");

            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                window.AgroGest.showToast("Completa los campos obligatorios del producto.", "error");
                return;
            }

            const catVal = categoriaEl ? categoriaEl.value.toUpperCase() : "SEMILLAS";
            const iconMap = {
                SEMILLAS: "bi-flower1",
                FERTILIZANTES: "bi-droplet-fill",
                HERRAMIENTAS: "bi-tools"
            };

            const payload = {
                id: currentProduct ? currentProduct.id : Date.now(),
                codigo: codigoEl.value.trim(),
                nombre: nombreEl.value.trim(),
                marca: marcaEl ? marcaEl.value.trim() : "",
                categoria: catVal,
                proveedor: proveedorEl ? proveedorEl.value : "",
                nit: nitEl ? nitEl.value.trim() : "",
                presentacion: presentacionEl ? presentacionEl.value.trim() : "",
                unidad: unidadEl ? unidadEl.value : "",
                estado: estadoEl ? estadoEl.value : "Activo",
                precioCompra: precioCompra,
                precioVenta: precioVenta,
                stockMinimo: Number(stockMinEl ? stockMinEl.value : 0) || 0,
                icono: iconMap[catVal] || "bi-box-seam",
                descripcion: descEl ? descEl.value.trim() : ""
            };

            const list = Array.isArray(products) ? products.slice() : [];
            if (currentProduct) {
                const idx = list.findIndex(function (p) { return String(p.id) === String(currentProduct.id); });
                if (idx >= 0) list[idx] = payload;
                else list.push(payload);
            } else {
                list.push(payload);
            }

            window.AgroGest.setStore("agrogest_productos", list);
            window.location.href = "productos.html";
        });
    });
})();

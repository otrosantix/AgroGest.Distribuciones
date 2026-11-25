/* =========================================================
   AgroGest Distribuciones - Nueva Venta (nueva-venta.js)
   ========================================================= */

(function () {
    "use strict";

    const DEFAULT_CLIENTS = [
        { nombre: "Carlos Rodríguez", documento: "CC 1.234.567.890", telefono: "300 123 4567", correo: "carlos.rodriguez@gmail.com" },
        { nombre: "María González", documento: "CC 1.098.765.432", telefono: "310 456 7890", correo: "maria.gonzalez@gmail.com" },
        { nombre: "Pedro Martínez", documento: "CC 1.112.223.334", telefono: "312 789 0123", correo: "pedro.martinez@gmail.com" },
        { nombre: "Laura Hernández", documento: "CC 1.024.568.789", telefono: "315 321 6549", correo: "laura.hernandez@gmail.com" },
        { nombre: "Jorge Ramírez", documento: "CC 1.045.667.889", telefono: "320 654 9871", correo: "jorge.ramirez@gmail.com" }
    ];

    const CATALOG = [
        { codigo: "PRO-0101", nombre: "Semilla de Maíz Híbrido", categoria: "Semillas", precio: 45000, disponibles: 120, unidad: "kg", icono: "bi-bag" },
        { codigo: "PRO-0103", nombre: "Fertilizante Líquido", categoria: "Fertilizantes", precio: 32500, disponibles: 25, unidad: "L", icono: "bi-droplet" },
        { codigo: "PRO-0202", nombre: "Pulverizadora Manual", categoria: "Herramientas", precio: 120000, disponibles: 8, unidad: "Unidad", icono: "bi-box-seam" },
        { codigo: "PRO-0084", nombre: "Semilla de Trigo", categoria: "Semillas", precio: 28000, disponibles: 60, unidad: "kg", icono: "bi-tree" }
    ];

    document.addEventListener("DOMContentLoaded", function () {
        const selectCliente = document.getElementById("selectCliente");
        const tarjetaCliente = document.getElementById("clienteElegido");
        const btnQuitarCliente = document.getElementById("btnQuitarCliente");
        const tbody = document.getElementById("tablaProductosVenta");
        const inputBuscarProd = document.getElementById("buscarProductoVenta");
        const selectCat = document.getElementById("categoriaProductoVenta");
        const btnAgregarProd = document.getElementById("btnAgregarProducto");
        const inputDescuento = document.getElementById("descuento");
        const btnGuardarTop = document.getElementById("btnGuardarVentaTop");
        const btnConfirmar = document.getElementById("btnConfirmarVenta");

        if (!tbody) return;

        // Cargar clientes (predeterminados + registrados en nuevo-cliente.html)
        const extraClients = window.AgroGest.getStore("agrogest_clientes", []);
        const clients = DEFAULT_CLIENTS.concat(Array.isArray(extraClients) ? extraClients : []);
        let selectedClient = clients[0];

        if (selectCliente) {
            selectCliente.innerHTML = '<option value="">Buscar cliente por nombre o documento...</option>';
            clients.forEach(function (c, idx) {
                const opt = document.createElement("option");
                opt.value = String(idx);
                opt.textContent = c.nombre + " - " + c.documento;
                if (idx === 0) opt.selected = true;
                selectCliente.appendChild(opt);
            });

            selectCliente.addEventListener("change", function () {
                if (selectCliente.value === "") {
                    selectedClient = null;
                } else {
                    selectedClient = clients[Number(selectCliente.value)] || null;
                }
                renderSelectedClient();
            });
        }

        function renderSelectedClient() {
            if (!tarjetaCliente) return;
            if (!selectedClient) {
                tarjetaCliente.hidden = true;
                return;
            }
            tarjetaCliente.hidden = false;
            document.getElementById("clienteNombre").textContent = selectedClient.nombre;
            document.getElementById("clienteDoc").textContent = selectedClient.documento;
            document.getElementById("clienteTel").innerHTML = '<i class="bi bi-telephone me-1"></i> ' + (selectedClient.telefono || "Sin teléfono");
            document.getElementById("clienteCorreo").innerHTML = '<i class="bi bi-envelope me-1"></i> ' + (selectedClient.correo || "Sin correo");
        }

        if (btnQuitarCliente) {
            btnQuitarCliente.addEventListener("click", function () {
                selectedClient = null;
                if (selectCliente) selectCliente.value = "";
                renderSelectedClient();
            });
        }

        renderSelectedClient();

        function recalcTotals() {
            const rows = tbody.querySelectorAll("tr");
            let subtotal = 0;

            rows.forEach(function (row) {
                const price = Number(row.dataset.precio || 0);
                const qty = Number(row.querySelector(".stepper-valor").textContent || 1);
                const rowSub = price * qty;
                row.querySelector(".celda-subtotal").textContent = window.AgroGest.formatShortCOP(rowSub);
                subtotal += rowSub;
            });

            let pct = Number(inputDescuento ? inputDescuento.value : 0);
            if (Number.isNaN(pct) || pct < 0) pct = 0;
            if (pct > 100) pct = 100;

            const discountAmt = Math.round(subtotal * (pct / 100));
            const finalTotal = Math.max(0, subtotal - discountAmt);

            document.getElementById("totalProductosTexto").textContent = "Total de productos: " + rows.length;
            document.getElementById("resumenSubtotal").textContent = window.AgroGest.formatCOP(subtotal);
            document.getElementById("resumenDescuento").textContent = "-" + window.AgroGest.formatCOP(discountAmt);
            document.getElementById("resumenTotal").textContent = window.AgroGest.formatCOP(finalTotal);
        }

        function wireRow(row) {
            const btnMinus = row.querySelector(".btn-restar-prod");
            const btnPlus = row.querySelector(".btn-sumar-prod");
            const btnDel = row.querySelector(".btn-eliminar");
            const qtyEl = row.querySelector(".stepper-valor");
            const maxStock = Number(row.dataset.max || 99);

            btnMinus.addEventListener("click", function () {
                const current = Number(qtyEl.textContent) || 1;
                if (current > 1) {
                    qtyEl.textContent = current - 1;
                    recalcTotals();
                }
            });

            btnPlus.addEventListener("click", function () {
                const current = Number(qtyEl.textContent) || 1;
                if (current < maxStock) {
                    qtyEl.textContent = current + 1;
                    recalcTotals();
                } else {
                    window.AgroGest.showToast("No hay más unidades disponibles en stock.", "error");
                }
            });

            btnDel.addEventListener("click", function () {
                row.remove();
                recalcTotals();
            });
        }

        function appendProductRow(prod, initialQty) {
            const existing = tbody.querySelector('tr[data-codigo="' + prod.codigo + '"]');
            if (existing) {
                const qtyEl = existing.querySelector(".stepper-valor");
                const max = Number(existing.dataset.max || 99);
                const next = Math.min(max, (Number(qtyEl.textContent) || 1) + (initialQty || 1));
                qtyEl.textContent = next;
                recalcTotals();
                return;
            }

            const tr = document.createElement("tr");
            tr.dataset.codigo = prod.codigo;
            tr.dataset.precio = prod.precio;
            tr.dataset.max = prod.disponibles;

            tr.innerHTML =
                '<td>' +
                    '<div class="d-flex align-items-center gap-3">' +
                        '<span class="icono-producto"><i class="bi ' + prod.icono + '"></i></span>' +
                        '<div>' +
                            '<span class="nombre-producto d-block">' + prod.nombre + '</span>' +
                            '<span class="detalle-producto">Código: ' + prod.codigo + '</span>' +
                            '<span class="disponibles ms-1">Disponibles: ' + prod.disponibles + ' ' + prod.unidad + '</span>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                    '<span class="fw-bold d-block">' + window.AgroGest.formatShortCOP(prod.precio) + '</span>' +
                    '<span class="por-unidad">por ' + prod.unidad + '</span>' +
                '</td>' +
                '<td>' +
                    '<div class="d-flex align-items-center gap-2">' +
                        '<div class="stepper">' +
                            '<button type="button" class="stepper-btn btn-restar-prod" aria-label="Disminuir cantidad"><i class="bi bi-dash"></i></button>' +
                            '<span class="stepper-valor">' + (initialQty || 1) + '</span>' +
                            '<button type="button" class="stepper-btn btn-sumar-prod" aria-label="Aumentar cantidad"><i class="bi bi-plus"></i></button>' +
                        '</div>' +
                        '<span class="unidad">' + prod.unidad + '</span>' +
                    '</div>' +
                '</td>' +
                '<td class="fw-bold celda-subtotal">' + window.AgroGest.formatShortCOP(prod.precio * (initialQty || 1)) + '</td>' +
                '<td class="text-center">' +
                    '<button type="button" class="btn-eliminar" aria-label="Eliminar ' + prod.nombre + '"><i class="bi bi-trash3"></i></button>' +
                '</td>';

            tbody.appendChild(tr);
            wireRow(tr);
            recalcTotals();
        }

        tbody.querySelectorAll("tr").forEach(wireRow);

        if (btnAgregarProd) {
            btnAgregarProd.addEventListener("click", function () {
                const query = inputBuscarProd ? inputBuscarProd.value.trim().toLowerCase() : "";
                const cat = selectCat ? selectCat.value : "";

                const match = CATALOG.find(function (p) {
                    const matchCat = !cat || cat === "Seleccionar categoría" || p.categoria === cat;
                    const matchText = !query || p.nombre.toLowerCase().includes(query) || p.codigo.toLowerCase().includes(query);
                    return matchCat && matchText;
                });

                if (!match) {
                    window.AgroGest.showToast("No se encontró un producto con ese criterio.", "error");
                    return;
                }

                appendProductRow(match, 1);
                if (inputBuscarProd) inputBuscarProd.value = "";
                window.AgroGest.showToast("Producto agregado: " + match.nombre, "success");
            });
        }

        if (inputDescuento) {
            inputDescuento.addEventListener("input", recalcTotals);
        }

        function saveSale() {
            if (!selectedClient) {
                window.AgroGest.showToast("Selecciona un cliente antes de guardar la venta.", "error");
                return;
            }

            const rows = Array.from(tbody.querySelectorAll("tr"));
            if (rows.length === 0) {
                window.AgroGest.showToast("Agrega al menos un producto a la venta.", "error");
                return;
            }

            const items = rows.map(function (row) {
                return {
                    codigo: row.dataset.codigo,
                    nombre: row.querySelector(".nombre-producto").textContent.trim(),
                    cantidad: Number(row.querySelector(".stepper-valor").textContent) || 1,
                    precio: Number(row.dataset.precio) || 0
                };
            });

            const subtotal = items.reduce(function (s, it) { return s + it.cantidad * it.precio; }, 0);
            const pct = Math.min(100, Math.max(0, Number(inputDescuento ? inputDescuento.value : 0) || 0));
            const descuento = Math.round(subtotal * (pct / 100));
            const total = Math.max(0, subtotal - descuento);

            const methodRadio = document.querySelector('input[name="metodo-pago"]:checked');
            const pagoMap = { "pago-efectivo": "Efectivo", "pago-nequi": "Nequi", "pago-transferencia": "Transferencia" };
            const pago = methodRadio ? (pagoMap[methodRadio.id] || "Efectivo") : "Efectivo";

            const extraSales = window.AgroGest.getStore("agrogest_ventas_extra", []);
            const nextNum = 126 + extraSales.length;
            const now = new Date();
            const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
            const fechaStr = String(now.getDate()).padStart(2, "0") + " " + months[now.getMonth()] + " " + now.getFullYear();

            extraSales.push({
                id: "VEN-00" + nextNum,
                cliente: selectedClient.nombre,
                documento: selectedClient.documento,
                correo: selectedClient.correo || "cliente@agrogest.com",
                telefono: selectedClient.telefono || "300 000 0000",
                fecha: fechaStr,
                hora: now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
                pago: pago,
                estado: "Completada",
                subtotal: subtotal,
                descuento: descuento,
                total: total,
                productos: items
            });

            window.AgroGest.setStore("agrogest_ventas_extra", extraSales);
            window.AgroGest.setStore("agrogest_carrito", []);
            window.location.href = "ventas.html";
        }

        if (btnGuardarTop) btnGuardarTop.addEventListener("click", saveSale);
        if (btnConfirmar) btnConfirmar.addEventListener("click", saveSale);

        recalcTotals();
    });
})();

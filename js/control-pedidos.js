/* =========================================================
   AgroGest Distribuciones - Control de Pedidos (control-pedidos.js)
   ========================================================= */

(function () {
    "use strict";

    const STATUS_META = {
        cotizado:    { label: "Cotizado",    cls: "cotizado",    icon: "fa-regular fa-file" },
        transito:    { label: "En tránsito", cls: "en-transito", icon: "fa-solid fa-truck" },
        entregado:   { label: "Recibido",    cls: "recibido",    icon: "fa-solid fa-check" },
        cancelado:   { label: "Cancelado",   cls: "cancelado",   icon: "fa-regular fa-circle-xmark" }
    };

    function statusKeyFromClass(span) {
        if (!span) return "cotizado";
        if (span.classList.contains("en-transito")) return "transito";
        if (span.classList.contains("recibido")) return "entregado";
        if (span.classList.contains("cancelado")) return "cancelado";
        return "cotizado";
    }

    function createExtraOrderRow(order) {
        const meta = STATUS_META[order.estado] || STATUS_META.cotizado;
        const tr = document.createElement("tr");
        tr.dataset.id = order.id;
        tr.dataset.estado = meta.cls;

        tr.innerHTML =
            '<td class="num-pedido">#' + order.id + '</td>' +
            '<td>' +
                '<span class="dato-fuerte">' + order.proveedor + '</span>' +
                '<span class="dato-suave">NIT: ' + (order.nit || "900.000.000-1") + '</span>' +
            '</td>' +
            '<td>' +
                '<span class="dato-fuerte">' + order.fecha + '</span>' +
                '<span class="dato-suave">' + order.hora + '</span>' +
            '</td>' +
            '<td>' +
                '<span class="dato-fuerte">' + order.insumos.length + (order.insumos.length === 1 ? ' insumo' : ' insumos') + '</span>' +
                '<a href="detalle-pedido.html?id=' + encodeURIComponent(order.id) + '" class="ver-detalle">Ver detalle</a>' +
            '</td>' +
            '<td class="total">' + window.AgroGest.formatCOP(order.total) + '</td>' +
            '<td><span class="estado-pedido ' + meta.cls + '"><i class="' + meta.icon + '"></i> ' + meta.label + '</span></td>' +
            '<td class="col-acciones"><a href="detalle-pedido.html?id=' + encodeURIComponent(order.id) + '" class="btn-ver"><i class="fa-regular fa-eye"></i> Ver</a></td>';

        return tr;
    }

    document.addEventListener("DOMContentLoaded", function () {
        const campoBusqueda = document.getElementById("campo-busqueda");
        const botonesFiltro = document.querySelectorAll(".chip-filtro");
        const mensajeVacio = document.getElementById("sin-resultados");
        const tbody = document.querySelector("#tabla-pedidos tbody");
        const formulario = campoBusqueda ? campoBusqueda.closest("form") : null;

        if (!tbody) return;

        // Cargar pedidos adicionales guardados en localStorage
        const extraOrders = window.AgroGest.getStore("agrogest_pedidos_extra", []);
        if (Array.isArray(extraOrders)) {
            extraOrders.slice().reverse().forEach(function (order) {
                tbody.insertBefore(createExtraOrderRow(order), tbody.firstChild);
            });
        }

        // Aplicar cambios de estado guardados desde detalle-pedido.html
        const savedStates = window.AgroGest.getStore("agrogest_pedidos_estados", {});
        tbody.querySelectorAll("tr").forEach(function (tr) {
            const id = tr.dataset.id;
            if (id && savedStates[id] && STATUS_META[savedStates[id]]) {
                const meta = STATUS_META[savedStates[id]];
                const span = tr.querySelector(".estado-pedido");
                if (span) {
                    span.className = "estado-pedido " + meta.cls;
                    span.innerHTML = '<i class="' + meta.icon + '"></i> ' + meta.label;
                    tr.dataset.estado = meta.cls;
                }
            }
        });

        let activeFilter = "todos";

        function updateCounters() {
            const rows = Array.from(tbody.querySelectorAll("tr"));
            let pendientes = 0;
            let transito = 0;
            let recibidos = 0;

            rows.forEach(function (row) {
                const key = statusKeyFromClass(row.querySelector(".estado-pedido"));
                if (key === "cotizado") pendientes += 1;
                else if (key === "transito") transito += 1;
                else if (key === "entregado") recibidos += 1;
            });

            const elPend = document.getElementById("statPendientes");
            const elTran = document.getElementById("statTransito");
            const elReci = document.getElementById("statRecibidos");
            const elTotal = document.getElementById("statTotal");

            if (elPend) elPend.textContent = pendientes;
            if (elTran) elTran.textContent = transito;
            if (elReci) elReci.textContent = recibidos;
            if (elTotal) elTotal.textContent = rows.length;
        }

        function filtrarPedidos() {
            const texto = campoBusqueda ? campoBusqueda.value.toLowerCase().trim() : "";
            const filas = tbody.querySelectorAll("tr");
            let visibles = 0;

            filas.forEach(function (fila) {
                const matchText = !texto || fila.textContent.toLowerCase().includes(texto);
                const rowEstado = fila.dataset.estado || "";
                const matchEstado = activeFilter === "todos" || rowEstado === activeFilter;
                const coincide = matchText && matchEstado;

                fila.style.display = coincide ? "" : "none";
                if (coincide) visibles += 1;
            });

            if (mensajeVacio) {
                mensajeVacio.hidden = visibles > 0;
            }
        }

        if (formulario) {
            formulario.addEventListener("submit", function (evento) {
                evento.preventDefault();
                filtrarPedidos();
            });
        }

        if (campoBusqueda) {
            campoBusqueda.addEventListener("input", filtrarPedidos);
        }

        botonesFiltro.forEach(function (btn) {
            btn.addEventListener("click", function () {
                botonesFiltro.forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
                activeFilter = btn.dataset.filtro || "todos";
                if (activeFilter === "todos" && campoBusqueda) {
                    campoBusqueda.value = "";
                }
                filtrarPedidos();
            });
        });

        // Modal Nuevo Pedido
        const formNuevoPedido = document.getElementById("formNuevoPedido");
        const modalEl = document.getElementById("modalNuevoPedido");
        const selectProv = document.getElementById("pedidoProveedor");

        const extraProviders = window.AgroGest.getStore("agrogest_proveedores", []);
        if (selectProv && Array.isArray(extraProviders)) {
            extraProviders.forEach(function (p) {
                const opt = document.createElement("option");
                opt.value = p.empresa + "|" + (p.nit || "900.000.000-1");
                opt.textContent = p.empresa;
                selectProv.appendChild(opt);
            });
        }

        if (formNuevoPedido && modalEl) {
            formNuevoPedido.addEventListener("submit", function (event) {
                event.preventDefault();
                if (!formNuevoPedido.checkValidity()) {
                    formNuevoPedido.classList.add("was-validated");
                    return;
                }

                const provParts = selectProv.value.split("|");
                const insumoNombre = document.getElementById("pedidoInsumo").value.trim();
                const cantidad = Number(document.getElementById("pedidoCantidad").value) || 1;
                const precio = Number(document.getElementById("pedidoPrecio").value) || 0;
                const total = cantidad * precio;

                const currentExtra = window.AgroGest.getStore("agrogest_pedidos_extra", []);
                const nextId = "PED-00" + (53 + currentExtra.length);
                const now = new Date();
                const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                const fecha = String(now.getDate()).padStart(2, "0") + " " + months[now.getMonth()] + " " + now.getFullYear();

                const newOrder = {
                    id: nextId,
                    proveedor: provParts[0],
                    nit: provParts[1] || "900.123.456-7",
                    correo: "ventas@proveedor.com",
                    telefono: "+57 601 555 0101",
                    fecha: fecha,
                    hora: now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
                    entrega: "Por confirmar",
                    estado: "cotizado",
                    insumos: [{ nombre: insumoNombre, codigo: "INS-001", cantidad: cantidad, unidad: "Unidades", precio: precio }],
                    total: total
                };

                currentExtra.push(newOrder);
                window.AgroGest.setStore("agrogest_pedidos_extra", currentExtra);

                tbody.insertBefore(createExtraOrderRow(newOrder), tbody.firstChild);
                updateCounters();
                filtrarPedidos();

                formNuevoPedido.reset();
                formNuevoPedido.classList.remove("was-validated");
                bootstrap.Modal.getInstance(modalEl).hide();
                window.AgroGest.showToast("Pedido #" + nextId + " creado correctamente.", "success");
            });
        }

        updateCounters();
    });
})();

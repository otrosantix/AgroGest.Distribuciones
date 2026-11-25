/* =========================================================
   AgroGest Distribuciones - Detalle de Pedido (detalle-pedido.js)
   ========================================================= */

(function () {
    "use strict";

    const DEFAULT_ORDERS = {
        "PED-0052": {
            id: "PED-0052",
            proveedor: "AgroPro S.A.S.",
            nit: "901.234.567-8",
            correo: "compras@agropro.com",
            telefono: "+57 601 555 2020",
            fecha: "15 Ago 2026",
            hora: "10:20 AM",
            entrega: "22 Ago 2026",
            estado: "pendiente",
            insumos: [
                { nombre: "Fertilizante NPK 15-15-15", codigo: "PRO-010", cantidad: 50, unidad: "Kg", precio: 25000, icono: "fa-droplet" },
                { nombre: "Semilla de Maíz Híbrida", codigo: "PRO-001", cantidad: 240, unidad: "Kg", precio: 5000, icono: "fa-seedling" }
            ]
        },
        "PED-0051": {
            id: "PED-0051",
            proveedor: "Semillas del Campo",
            nit: "800.123.456-3",
            correo: "ventas@semillascampo.com",
            telefono: "+57 601 555 1212",
            fecha: "12 Ago 2026",
            hora: "04:15 PM",
            entrega: "19 Ago 2026",
            estado: "transito",
            insumos: [
                { nombre: "Semilla de Maíz Híbrida", codigo: "PRO-001", cantidad: 150, unidad: "Kg", precio: 5000, icono: "fa-seedling" },
                { nombre: "Abono Orgánico", codigo: "PRO-002", cantidad: 40, unidad: "Kg", precio: 2500, icono: "fa-leaf" }
            ]
        },
        "PED-0049": {
            id: "PED-0049",
            proveedor: "Fertilizantes Nacionales",
            nit: "903.987.654-3",
            correo: "contacto@fertinacionales.com",
            telefono: "+57 601 555 9090",
            fecha: "08 Ago 2026",
            hora: "09:00 AM",
            entrega: "12 Ago 2026",
            estado: "entregado",
            insumos: [
                { nombre: "Fertilizante Líquido", codigo: "PRO-013", cantidad: 100, unidad: "L", precio: 24500, icono: "fa-droplet" },
                { nombre: "Urea Agrícola", codigo: "PRO-018", cantidad: 70, unidad: "Kg", precio: 10000, icono: "fa-box" }
            ]
        },
        "PED-0047": {
            id: "PED-0047",
            proveedor: "AgroPro S.A.S.",
            nit: "901.234.567-8",
            correo: "compras@agropro.com",
            telefono: "+57 601 555 2020",
            fecha: "28 Jul 2026",
            hora: "11:30 AM",
            entrega: "Cancelado",
            estado: "cancelado",
            insumos: [
                { nombre: "Pulverizadora Manual", codigo: "PRO-052", cantidad: 10, unidad: "Unidades", precio: 92000, icono: "fa-spray-can" },
                { nombre: "Kit de Boquillas", codigo: "PRO-055", cantidad: 35, unidad: "Unidades", precio: 10000, icono: "fa-toolbox" }
            ]
        }
    };

    const STATUS_BADGE = {
        pendiente: { cls: "estado-pendiente", icon: "fa-regular fa-clock",        text: "Pendiente" },
        cotizado:  { cls: "estado-pendiente", icon: "fa-regular fa-file",         text: "Cotizado" },
        transito:  { cls: "estado-transito",  icon: "fa-solid fa-truck-fast",     text: "En tránsito" },
        entregado: { cls: "estado-entregado", icon: "fa-solid fa-check",          text: "Entregado" },
        cancelado: { cls: "estado-cancelado", icon: "fa-regular fa-circle-xmark", text: "Cancelado" }
    };

    function applyStatusBadge(statusKey) {
        const meta = STATUS_BADGE[statusKey] || STATUS_BADGE.transito;
        const badge = document.getElementById("badge-estado");
        const icon = document.getElementById("badge-icono");
        const text = document.getElementById("badge-texto");

        if (badge) badge.className = "badge-estado " + meta.cls;
        if (icon) icon.className = meta.icon;
        if (text) text.textContent = meta.text;
    }

    document.addEventListener("DOMContentLoaded", function () {
        const params = new URLSearchParams(window.location.search);
        const requestedId = (params.get("id") || "PED-0051").replace("#", "");

        const extraOrders = window.AgroGest.getStore("agrogest_pedidos_extra", []);
        const extraMatch = Array.isArray(extraOrders)
            ? extraOrders.find(function (o) { return o.id === requestedId; })
            : null;

        const order = extraMatch || DEFAULT_ORDERS[requestedId] || DEFAULT_ORDERS["PED-0051"];

        const savedStates = window.AgroGest.getStore("agrogest_pedidos_estados", {});
        const currentStatus = savedStates[order.id] || order.estado || "transito";
        const normalizedSelectStatus = currentStatus === "cotizado" ? "pendiente" : currentStatus;

        document.title = "Detalle del pedido #" + order.id + " - AgroGest";
        document.getElementById("migaPedido").textContent = "Detalle de pedido #" + order.id;
        document.getElementById("tituloPedidoCodigo").textContent = "#" + order.id;
        document.getElementById("pedidoFecha").textContent = order.fecha;
        document.getElementById("pedidoHora").textContent = order.hora;
        document.getElementById("pedidoEntrega").textContent = order.entrega;
        document.getElementById("proveedorNombre").innerHTML = '<i class="fa-regular fa-building icono-dorado"></i> ' + order.proveedor;
        document.getElementById("proveedorNit").textContent = "NIT: " + order.nit;
        document.getElementById("proveedorCorreo").textContent = order.correo;
        document.getElementById("proveedorTelefono").textContent = order.telefono;

        const tbody = document.querySelector("#tabla-insumos tbody");
        tbody.innerHTML = "";

        let total = 0;
        order.insumos.forEach(function (item) {
            const sub = (item.cantidad || 0) * (item.precio || 0);
            total += sub;

            const tr = document.createElement("tr");
            tr.dataset.cantidad = item.cantidad;
            tr.dataset.precio = item.precio;

            tr.innerHTML =
                '<td>' +
                    '<div class="insumo">' +
                        '<div class="icono-insumo"><i class="fa-solid ' + (item.icono || "fa-box") + '"></i></div>' +
                        '<div>' +
                            '<strong>' + item.nombre + '</strong>' +
                            '<small>Cód: ' + (item.codigo || "PRO-001") + '</small>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td class="num">' + item.cantidad + ' ' + (item.unidad || "Unidades") + '</td>' +
                '<td class="num">' + window.AgroGest.formatShortCOP(item.precio) + '</td>' +
                '<td class="num subtotal"><strong>' + window.AgroGest.formatShortCOP(sub) + '</strong></td>';

            tbody.appendChild(tr);
        });

        document.getElementById("total-productos").textContent = order.insumos.length + (order.insumos.length === 1 ? " producto" : " productos");
        document.getElementById("total-tarjeta").textContent = window.AgroGest.formatCOP(total);
        document.getElementById("subtotal-general").textContent = window.AgroGest.formatShortCOP(total);
        document.getElementById("total-final").textContent = window.AgroGest.formatCOP(total);

        const selectEstado = document.getElementById("estado-pedido");
        if (selectEstado) {
            selectEstado.value = normalizedSelectStatus;
        }
        applyStatusBadge(currentStatus);

        const btnVolver = document.getElementById("btn-volver");
        const btnExportar = document.getElementById("btn-exportar");
        const btnGuardar = document.getElementById("btn-guardar");

        if (btnVolver) {
            btnVolver.addEventListener("click", function () {
                window.location.href = "control-pedidos.html";
            });
        }

        if (btnExportar) {
            btnExportar.addEventListener("click", function () {
                window.print();
            });
        }

        if (btnGuardar && selectEstado) {
            btnGuardar.addEventListener("click", function () {
                const chosen = selectEstado.value;
                applyStatusBadge(chosen);
                const map = window.AgroGest.getStore("agrogest_pedidos_estados", {});
                map[order.id] = chosen;
                window.AgroGest.setStore("agrogest_pedidos_estados", map);
                window.AgroGest.showToast("Estado del pedido actualizado a: " + STATUS_BADGE[chosen].text, "success");
            });
        }
    });
})();

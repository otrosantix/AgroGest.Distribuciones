/* =========================================================
   AgroGest Distribuciones - Detalle de Venta (detalle-venta.js)
   ========================================================= */

(function () {
    "use strict";

    const DEFAULT_SALES = {
        "VEN-00125": {
            id: "VEN-00125",
            cliente: "Carlos Rodríguez",
            documento: "1.234.567.890",
            correo: "carlos.r@gmail.com",
            telefono: "+57 320 123 4567",
            fecha: "14 Ago 2026",
            hora: "10:35 AM",
            pago: "Efectivo",
            transaccion: "#ST-132",
            estado: "Completada",
            subtotal: 165000,
            descuento: 0,
            total: 165000,
            productos: [
                { nombre: "Semilla de Maíz Híbrido", codigo: "PRO-005", cantidad: 2, precio: 45000, icono: "bi-flower1" },
                { nombre: "Fertilizante Líquido", codigo: "PRO-002", cantidad: 1, precio: 32500, icono: "bi-droplet" },
                { nombre: "Pulverizador Manual", codigo: "PRO-023", cantidad: 1, precio: 42500, icono: "bi-box" }
            ]
        },
        "VEN-00124": {
            id: "VEN-00124",
            cliente: "María González",
            documento: "1.098.765.432",
            correo: "maria.g@gmail.com",
            telefono: "+57 310 456 7890",
            fecha: "14 Ago 2026",
            hora: "09:15 AM",
            pago: "Nequi",
            transaccion: "#NQ-884",
            estado: "Completada",
            subtotal: 78500,
            descuento: 0,
            total: 78500,
            productos: [
                { nombre: "Semilla de Trigo", codigo: "PRO-008", cantidad: 2, precio: 28000, icono: "bi-tree" },
                { nombre: "Fertilizante Foliar", codigo: "PRO-014", cantidad: 1, precio: 22500, icono: "bi-droplet" }
            ]
        },
        "VEN-00123": {
            id: "VEN-00123",
            cliente: "Pedro Martínez",
            documento: "1.112.223.334",
            correo: "pedro.m@gmail.com",
            telefono: "+57 312 789 0123",
            fecha: "13 Ago 2026",
            hora: "05:45 PM",
            pago: "Transferencia",
            transaccion: "#TR-419",
            estado: "Completada",
            subtotal: 250000,
            descuento: 0,
            total: 250000,
            productos: [
                { nombre: "Pulverizadora Manual", codigo: "PRO-023", cantidad: 2, precio: 120000, icono: "bi-box" },
                { nombre: "Guantes Agrícolas", codigo: "PRO-031", cantidad: 1, precio: 10000, icono: "bi-shield-check" }
            ]
        },
        "VEN-00122": {
            id: "VEN-00122",
            cliente: "Laura Hernández",
            documento: "1.024.568.789",
            correo: "laura.h@gmail.com",
            telefono: "+57 315 321 6549",
            fecha: "13 Ago 2026",
            hora: "03:20 PM",
            pago: "Efectivo",
            transaccion: "#ST-119",
            estado: "Pendiente",
            subtotal: 34000,
            descuento: 0,
            total: 34000,
            productos: [
                { nombre: "Fertilizante Líquido", codigo: "PRO-002", cantidad: 1, precio: 34000, icono: "bi-droplet" }
            ]
        },
        "VEN-00121": {
            id: "VEN-00121",
            cliente: "Jorge Ramírez",
            documento: "1.045.667.889",
            correo: "jorge.r@gmail.com",
            telefono: "+57 320 654 9871",
            fecha: "12 Ago 2026",
            hora: "11:10 AM",
            pago: "Efectivo",
            transaccion: "#ST-105",
            estado: "Completada",
            subtotal: 312500,
            descuento: 0,
            total: 312500,
            productos: [
                { nombre: "Semilla de Maíz Híbrido", codigo: "PRO-005", cantidad: 5, precio: 45000, icono: "bi-flower1" },
                { nombre: "Fertilizante Líquido", codigo: "PRO-002", cantidad: 2, precio: 32500, icono: "bi-droplet" },
                { nombre: "Boquilla Aspersora", codigo: "PRO-019", cantidad: 1, precio: 22500, icono: "bi-tools" }
            ]
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        const params = new URLSearchParams(window.location.search);
        const requestedId = (params.get("id") || "VEN-00125").replace("#", "");

        const extraSales = window.AgroGest.getStore("agrogest_ventas_extra", []);
        const extraMatch = Array.isArray(extraSales)
            ? extraSales.find(function (s) { return s.id === requestedId; })
            : null;

        const sale = extraMatch || DEFAULT_SALES[requestedId] || DEFAULT_SALES["VEN-00125"];

        document.title = "AgroGest - Detalle de Venta #" + sale.id;
        document.getElementById("migaVentaId").textContent = "Detalle de venta: #" + sale.id;
        document.getElementById("tituloVentaId").textContent = "#" + sale.id;

        const badge = document.getElementById("badgeEstadoVenta");
        const isPending = sale.estado === "Pendiente";
        badge.className = "etiqueta " + (isPending ? "etiqueta-amarillo" : "etiqueta-verde");
        badge.innerHTML = '<i class="bi bi-circle-fill"></i> ' + sale.estado;

        document.getElementById("ventaFecha").textContent = sale.fecha;
        document.getElementById("ventaHora").textContent = sale.hora;
        document.getElementById("ventaPago").textContent = sale.pago;
        document.getElementById("ventaTransaccion").textContent = "Transacción " + (sale.transaccion || "#AG-2026");

        const totalUnits = sale.productos.reduce(function (s, p) { return s + (p.cantidad || 1); }, 0);
        document.getElementById("ventaTotalProductos").textContent = sale.productos.length + (sale.productos.length === 1 ? " producto" : " productos");
        document.getElementById("ventaTotalUnidades").textContent = totalUnits + " unidades en total";
        document.getElementById("ventaEstadoCard").textContent = sale.estado;
        document.getElementById("ventaEstadoNota").textContent = isPending ? "Pendiente de pago" : "Entregado al cliente";

        document.getElementById("ventaClienteNombre").textContent = sale.cliente;
        document.getElementById("ventaClienteDoc").textContent = String(sale.documento).replace(/^CC\s*/i, "");
        document.getElementById("ventaClienteCorreo").textContent = sale.correo;
        document.getElementById("ventaClienteTel").textContent = sale.telefono;
        document.getElementById("ventaTotalCancelado").textContent = isPending ? "$0 COP" : window.AgroGest.formatCOP(sale.total);
        document.getElementById("ventaPendiente").textContent = isPending ? window.AgroGest.formatCOP(sale.total) : "$0 COP";

        const tbody = document.getElementById("ventaProductosBody");
        tbody.innerHTML = "";
        sale.productos.forEach(function (p) {
            const tr = document.createElement("tr");
            const sub = (p.cantidad || 1) * (p.precio || 0);
            tr.innerHTML =
                '<td>' +
                    '<div class="d-flex align-items-center gap-3">' +
                        '<span class="icono-producto"><i class="bi ' + (p.icono || "bi-box") + '"></i></span>' +
                        '<div>' +
                            '<span class="nombre-producto d-block">' + p.nombre + '</span>' +
                            '<span class="codigo-producto">COD: ' + (p.codigo || "PRO-001") + '</span>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td class="text-center fw-bold">' + p.cantidad + '</td>' +
                '<td class="text-end">' + window.AgroGest.formatShortCOP(p.precio) + '</td>' +
                '<td class="text-end fw-bold">' + window.AgroGest.formatShortCOP(sub) + '</td>';
            tbody.appendChild(tr);
        });

        document.getElementById("ventaSubtotal").textContent = window.AgroGest.formatShortCOP(sale.subtotal);
        document.getElementById("ventaDescuento").textContent = "-" + window.AgroGest.formatShortCOP(sale.descuento || 0);
        document.getElementById("ventaTotalFinal").textContent = window.AgroGest.formatCOP(sale.total);

        const btnImprimir = document.getElementById("btnImprimirFactura");
        const btnDescargar = document.getElementById("btnDescargarComprobante");

        if (btnImprimir) {
            btnImprimir.addEventListener("click", function () {
                window.print();
            });
        }

        if (btnDescargar) {
            btnDescargar.addEventListener("click", function (event) {
                event.preventDefault();
                const lines = [
                    "AGROGEST DISTRIBUCIONES - COMPROBANTE DE VENTA",
                    "NIT: 900.123.456-1",
                    "----------------------------------------------",
                    "Venta: #" + sale.id,
                    "Fecha: " + sale.fecha + " " + sale.hora,
                    "Cliente: " + sale.cliente + " (CC " + sale.documento + ")",
                    "Metodo de pago: " + sale.pago + " | Estado: " + sale.estado,
                    "----------------------------------------------",
                    "Productos:"
                ];
                sale.productos.forEach(function (p) {
                    lines.push("- " + p.nombre + " x" + p.cantidad + " = " + window.AgroGest.formatShortCOP(p.cantidad * p.precio));
                });
                lines.push("----------------------------------------------");
                lines.push("Total final: " + window.AgroGest.formatCOP(sale.total));

                const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "comprobante-" + sale.id + ".txt";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                window.AgroGest.showToast("Comprobante descargado.", "success");
            });
        }
    });
})();

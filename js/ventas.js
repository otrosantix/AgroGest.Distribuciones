/* =========================================================
   AgroGest Distribuciones - Control de Ventas (ventas.js)
   ========================================================= */

(function () {
    "use strict";

    function createExtraRow(v) {
        const tr = document.createElement("tr");
        tr.dataset.estado = (v.estado || "Completada").toLowerCase();
        tr.dataset.fechaGrupo = "hoy";

        const pagoClass = v.pago === "Nequi" ? "etiqueta-morado" : (v.pago === "Transferencia" ? "etiqueta-azul" : "etiqueta-verde");
        const pagoIcon = v.pago === "Nequi" ? "bi-phone" : (v.pago === "Transferencia" ? "bi-bank" : "bi-cash-stack");
        const estadoClass = v.estado === "Pendiente" ? "etiqueta-amarillo" : "etiqueta-verde";
        const estadoIcon = v.estado === "Pendiente" ? "bi-clock" : "bi-check-circle";

        tr.innerHTML =
            '<td>' +
                '<div class="d-flex align-items-center gap-3">' +
                    '<span class="icono-doc"><i class="bi bi-file-earmark-text"></i></span>' +
                    '<span class="fw-bold">' + v.id + '</span>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<span class="fw-bold d-block">' + v.cliente + '</span>' +
                '<span class="cedula">' + v.documento + '</span>' +
            '</td>' +
            '<td>' +
                '<span class="d-block texto-suave">' + v.fecha + '</span>' +
                '<span class="hora">' + v.hora + '</span>' +
            '</td>' +
            '<td>' +
                '<span class="d-block">' + v.productos.length + (v.productos.length === 1 ? ' producto' : ' productos') + '</span>' +
                '<a href="detalle-venta.html?id=' + encodeURIComponent(v.id) + '" class="ver-detalle">Ver detalle</a>' +
            '</td>' +
            '<td class="fw-bold">' + window.AgroGest.formatCOP(v.total) + '</td>' +
            '<td><span class="etiqueta ' + pagoClass + '"><i class="bi ' + pagoIcon + '"></i> ' + v.pago + '</span></td>' +
            '<td><span class="etiqueta ' + estadoClass + '"><i class="bi ' + estadoIcon + '"></i> ' + v.estado + '</span></td>' +
            '<td class="text-center"><a href="detalle-venta.html?id=' + encodeURIComponent(v.id) + '" class="btn btn-ver"><i class="bi bi-eye me-1"></i> Ver</a></td>';

        return tr;
    }

    document.addEventListener("DOMContentLoaded", function () {
        const tbody = document.getElementById("tablaVentasBody");
        const searchInput = document.getElementById("buscarVenta");
        const emptyMsg = document.getElementById("sinVentas");
        const statusBtns = document.querySelectorAll(".btn-filtro-venta");
        const dateLinks = document.querySelectorAll(".filtro-fecha-opcion");
        const dateLabel = document.getElementById("labelFiltroFecha");

        if (!tbody) return;

        const extraSales = window.AgroGest.getStore("agrogest_ventas_extra", []);
        if (Array.isArray(extraSales) && extraSales.length > 0) {
            extraSales.slice().reverse().forEach(function (venta) {
                tbody.insertBefore(createExtraRow(venta), tbody.firstChild);
            });
        }

        let activeStatus = "todos";
        let activeDate = "todas";

        function applyFilters() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
            const rows = tbody.querySelectorAll("tr");
            let visible = 0;

            rows.forEach(function (row) {
                const matchText = !query || row.textContent.toLowerCase().includes(query);
                const rowEstado = (row.dataset.estado || "").toLowerCase();
                const rowFecha = (row.dataset.fechaGrupo || "mes").toLowerCase();

                const matchStatus = activeStatus === "todos" || rowEstado === activeStatus;
                let matchDate = true;
                if (activeDate === "hoy") matchDate = rowFecha === "hoy";
                else if (activeDate === "semana") matchDate = rowFecha === "hoy" || rowFecha === "semana";

                const show = matchText && matchStatus && matchDate;
                row.style.display = show ? "" : "none";
                if (show) visible += 1;
            });

            if (emptyMsg) emptyMsg.hidden = visible > 0;
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        statusBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                statusBtns.forEach(function (b) {
                    b.classList.remove("btn-agro", "active");
                    b.classList.add("btn-filtro");
                });
                btn.classList.remove("btn-filtro");
                btn.classList.add("btn-agro", "active");
                activeStatus = (btn.dataset.estado || "todos").toLowerCase();
                applyFilters();
            });
        });

        dateLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                activeDate = link.dataset.rango || "todas";
                if (dateLabel) dateLabel.textContent = link.textContent.trim();
                applyFilters();
            });
        });
    });
})();

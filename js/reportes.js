/* =========================================================
   AgroGest Distribuciones - Centro de Reportes (reportes.js)
   ========================================================= */

(function () {
    "use strict";

    const kpis = [
        {
            label: "Ventas Totales (Mes)",
            value: "$18.750.000",
            note: "▲ 15% vs mes anterior",
            up: true,
            icon: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'
        },
        {
            label: "Pedidos a proveedores",
            value: "14",
            note: "Últimos 30 días",
            icon: '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>'
        },
        {
            label: "Productos en inventario",
            value: "147",
            note: "Unidades totales",
            icon: '<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'
        },
        {
            label: "Pedidos Completados",
            value: "8",
            note: "Sin novedades",
            up: true,
            icon: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>'
        }
    ];

    const sales = [
        { month: "Feb", value: 2.4 },
        { month: "Mar", value: 3.1 },
        { month: "Abr", value: 4.6 },
        { month: "May", value: 3.3 },
        { month: "Jun", value: 5.2 },
        { month: "Jul", value: 5.8, current: true }
    ];

    const inventory = [
        { name: "Fertilizantes", percent: 60, color: "#D98B00" },
        { name: "Semillas",      percent: 25, color: "#2F80ED" },
        { name: "Herramientas",  percent: 15, color: "#EF4444" }
    ];
    const totalItems = 147;

    const reports = [
        {
            name: "Ventas del mes - Agosto 2026",
            desc: "Detalle de facturación y pagos",
            type: "Financiero",
            date: "2026-08-13T10:00",
            icon: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'
        },
        {
            name: "Inventario Crítico (Stock Bajo)",
            desc: "Productos por debajo del mínimo",
            type: "Inventario",
            date: "2026-08-12T15:30",
            icon: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'
        },
        {
            name: "Pedidos a Proveedores - Agosto",
            desc: "Estado de compras y entregas",
            type: "Compras",
            date: "2026-08-10T11:15",
            icon: '<path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>'
        },
        {
            name: "Análisis de Clientes (Top 10)",
            desc: "Clientes con mayor facturación",
            type: "Clientes",
            date: "2026-08-08T09:00",
            icon: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/><path d="M17 4.5a3.5 3.5 0 0 1 0 7M22 21v-1a6 6 0 0 0-4-5.6"/>'
        }
    ];

    const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    function svg(paths, size, stroke) {
        return '<svg viewBox="0 0 24 24" width="' + (size || 16) + '" height="' + (size || 16) + '" fill="none" stroke="' + (stroke || "currentColor") + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
    }

    function formatDate(iso) {
        const d = new Date(iso);
        const day = String(d.getDate()).padStart(2, "0");
        let h = d.getHours();
        const min = String(d.getMinutes()).padStart(2, "0");
        const suffix = h >= 12 ? "pm" : "am";
        h = h % 12 || 12;
        return day + " " + MESES[d.getMonth()] + " " + d.getFullYear() + " • " + String(h).padStart(2, "0") + ":" + min + " " + suffix;
    }

    function renderKpis() {
        document.getElementById("kpis").innerHTML = kpis.map(function (k) {
            return (
                '<article class="reportes-card kpi">' +
                    '<div class="kpi__icon">' + svg(k.icon, 18) + "</div>" +
                    "<div>" +
                        '<div class="kpi__label">' + k.label + "</div>" +
                        '<div class="kpi__value">' + k.value + "</div>" +
                        '<div class="kpi__note ' + (k.up ? "is-up" : "") + '">' + k.note + "</div>" +
                    "</div>" +
                "</article>"
            );
        }).join("");
    }

    function renderBars() {
        const max = Math.max.apply(null, sales.map(function (s) { return s.value; }));
        const chartHeight = 130;

        document.getElementById("barChart").innerHTML = sales.map(function (s, i) {
            return (
                '<div class="bar ' + (s.current ? "is-current" : "") + '">' +
                    '<span class="bar__tag">$' + s.value.toFixed(1) + "M</span>" +
                    '<div class="bar__fill" style="height:' + Math.round((s.value / max) * chartHeight) + 'px; animation-delay:' + (i * 60) + 'ms"></div>' +
                    '<span class="bar__label">' + s.month + "</span>" +
                "</div>"
            );
        }).join("");
    }

    function renderDonut() {
        let acc = 0;
        const stops = inventory.map(function (item) {
            const from = acc;
            acc += item.percent;
            return item.color + " " + from + "% " + acc + "%";
        });

        const donut = document.getElementById("donut");
        donut.style.background = "conic-gradient(" + stops.join(", ") + ")";
        donut.innerHTML = '<div class="donut__center"><strong>' + totalItems + "</strong><small>ítems</small></div>";

        document.getElementById("donutLegend").innerHTML = inventory.map(function (item) {
            return '<li><i style="background:' + item.color + '"></i>' + item.name + " (" + item.percent + "%)</li>";
        }).join("");
    }

    function renderReports(list) {
        const body = document.getElementById("reportsBody");
        const empty = document.getElementById("emptyMsg");

        empty.hidden = list.length > 0;

        body.innerHTML = list.map(function (r, i) {
            return (
                "<tr>" +
                    "<td>" +
                        '<div class="report">' +
                            '<div class="report__icon">' + svg(r.icon, 15) + "</div>" +
                            "<div>" +
                                '<div class="report__name">' + r.name + "</div>" +
                                '<div class="report__desc">' + r.desc + "</div>" +
                            "</div>" +
                        "</div>" +
                    "</td>" +
                    '<td><span class="badge-reporte">' + r.type + "</span></td>" +
                    '<td class="td-date">' + formatDate(r.date) + "</td>" +
                    '<td class="td-actions">' +
                        '<button type="button" class="btn-pdf" data-index="' + i + '" aria-label="Descargar ' + r.name + ' en PDF">' +
                            svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>', 12) +
                            " PDF" +
                        "</button>" +
                    "</td>" +
                "</tr>"
            );
        }).join("");

        body.querySelectorAll(".btn-pdf").forEach(function (btn) {
            btn.addEventListener("click", function () {
                const report = list[btn.dataset.index];
                window.AgroGest.showToast("Generando PDF: " + report.name, "success");
            });
        });
    }

    function applyFilter() {
        const from = document.getElementById("dateFrom").value;
        const to = document.getElementById("dateTo").value;

        if (from && to && from > to) {
            window.AgroGest.showToast("La fecha inicial no puede ser posterior a la final.", "error");
            return;
        }

        const filtered = reports.filter(function (r) {
            const day = r.date.slice(0, 10);
            return (!from || day >= from) && (!to || day <= to);
        });

        renderReports(filtered);
    }

    document.addEventListener("DOMContentLoaded", function () {
        renderKpis();
        renderBars();
        renderDonut();
        renderReports(reports);

        document.getElementById("filtersForm").addEventListener("submit", function (e) {
            e.preventDefault();
            applyFilter();
        });
    });
})();

/* =========================================================
   AgroGest Distribuciones - Historial de Precios (historial-productos.js)
   ========================================================= */

(function () {
    "use strict";

    const PRICE_DATA = {
        "maiz|agropro":   { prices: [5600, 5750, 5900, 5800, 6200], trend: "Alza constante", icon: "bi-graph-up-arrow" },
        "maiz|dist":      { prices: [5500, 5600, 5650, 5700, 5850], trend: "Alza moderada", icon: "bi-graph-up-arrow" },
        "maiz|insumos":   { prices: [5800, 5750, 5700, 5720, 5700], trend: "Estable", icon: "bi-dash-lg" },
        "fert|agropro":   { prices: [21500, 22000, 23200, 23800, 24500], trend: "Alza constante", icon: "bi-graph-up-arrow" },
        "fert|dist":      { prices: [22000, 21800, 21500, 21900, 22100], trend: "Estable", icon: "bi-dash-lg" },
        "fert|insumos":   { prices: [23000, 22600, 22100, 21800, 21200], trend: "A la baja", icon: "bi-graph-down-arrow" },
        "pulv|agropro":   { prices: [88000, 89500, 90000, 91500, 92000], trend: "Alza moderada", icon: "bi-graph-up-arrow" },
        "pulv|dist":      { prices: [91000, 90500, 90000, 89500, 89000], trend: "A la baja", icon: "bi-graph-down-arrow" },
        "pulv|insumos":   { prices: [89000, 89000, 89500, 89500, 90000], trend: "Estable", icon: "bi-dash-lg" },
        "trigo|agropro":  { prices: [18500, 19000, 19400, 19800, 20200], trend: "Alza constante", icon: "bi-graph-up-arrow" },
        "trigo|dist":     { prices: [19200, 19100, 19000, 19200, 19100], trend: "Estable", icon: "bi-dash-lg" },
        "trigo|insumos":  { prices: [19800, 19500, 19100, 18900, 18600], trend: "A la baja", icon: "bi-graph-down-arrow" }
    };

    const X_COORDS = [80, 230, 380, 530, 680];

    function renderChart(productKey, providerKey) {
        const key = productKey + "|" + providerKey;
        const entry = PRICE_DATA[key] || PRICE_DATA["maiz|agropro"];
        const prices = entry.prices;
        const min = Math.min.apply(null, prices);
        const max = Math.max.apply(null, prices);
        const span = max - min || 1;

        const points = prices.map(function (val, idx) {
            const y = Math.round(185 - ((val - min) / span) * 110);
            return { x: X_COORDS[idx], y: y, price: val };
        });

        const polyline = document.getElementById("trendPolyline");
        if (polyline) {
            polyline.setAttribute("points", points.map(function (p) { return p.x + "," + p.y; }).join(" "));
        }

        points.forEach(function (p, idx) {
            const dot = document.getElementById("trendDot" + idx);
            const label = document.getElementById("trendPrice" + idx);
            if (dot) {
                dot.setAttribute("cx", p.x);
                dot.setAttribute("cy", p.y);
            }
            if (label) {
                label.setAttribute("x", p.x);
                label.setAttribute("y", p.y - 18);
                label.textContent = "$" + p.price.toLocaleString("es-CO");
            }
        });

        const badge = document.getElementById("trendBadge");
        if (badge) {
            badge.innerHTML = '<i class="bi ' + entry.icon + ' me-1"></i> Tendencia: ' + entry.trend;
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        const prodSelect = document.getElementById("selectProducto");
        const provSelect = document.getElementById("selectProveedor");
        const btnConsultar = document.getElementById("btnConsultarHistorial");

        if (!prodSelect || !provSelect) return;

        function update() {
            renderChart(prodSelect.value, provSelect.value);
        }

        if (btnConsultar) {
            btnConsultar.addEventListener("click", function () {
                update();
                window.AgroGest.showToast("Historial de precios actualizado.", "success");
            });
        }

        prodSelect.addEventListener("change", update);
        provSelect.addEventListener("change", update);
        update();
    });
})();

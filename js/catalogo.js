/* =========================================================
   AgroGest Distribuciones - Catálogo visitante (catalogo.js)
   Vista de solo lectura: muestra productos sin funciones de
   edición, carrito ni administración.
   ========================================================= */

(function () {
    "use strict";

    /* Productos por defecto (se muestran si no hay datos en localStorage) */
    var DEFAULT_PRODUCTS = [
        { id: 1, nombre: "Semilla de Maíz Híbrido",  categoria: "SEMILLAS",       precioVenta: 45000,  icono: "bi-flower1",      descripcion: "Semilla de alta calidad, ideal para climas templados y cálidos." },
        { id: 2, nombre: "Fertilizante Líquido",      categoria: "FERTILIZANTES",  precioVenta: 32500,  icono: "bi-droplet-fill",  descripcion: "Fertilizante foliar de rápida absorción." },
        { id: 3, nombre: "Pulverizadora Manual",      categoria: "HERRAMIENTAS",   precioVenta: 120000, icono: "bi-tools",         descripcion: "Pulverizadora manual de espalda con boquilla regulable." },
        { id: 4, nombre: "Semilla de Trigo",          categoria: "SEMILLAS",       precioVenta: 28000,  icono: "bi-tree",          descripcion: "Semilla certificada de alto rendimiento." }
    ];

    /** Formatea valor numérico como pesos colombianos */
    function formatCOP(value) {
        var n = Number(value) || 0;
        return "$ " + n.toLocaleString("es-CO");
    }

    /** Obtiene productos desde localStorage o devuelve los por defecto.
     *  Solo expone campos seguros: nombre, categoría, precio, icono, descripción. */
    function getPublicProducts() {
        var raw = null;
        try {
            var stored = localStorage.getItem("agrogest_productos");
            if (stored) { raw = JSON.parse(stored); }
        } catch (_) { /* silent */ }

        var source = Array.isArray(raw) && raw.length > 0 ? raw : DEFAULT_PRODUCTS;

        return source.map(function (p) {
            return {
                nombre:      p.nombre      || "Producto",
                categoria:   (p.categoria   || "GENERAL").toUpperCase(),
                precioVenta: Number(p.precioVenta) || 0,
                icono:       p.icono        || "bi-box-seam",
                descripcion: p.descripcion  || ""
            };
        });
    }

    /** Crea una tarjeta de producto de solo lectura (sin editar, sin carrito) */
    function createReadOnlyCard(prod) {
        var col = document.createElement("div");
        col.className = "col producto-item";
        col.dataset.categoria = prod.categoria;
        col.dataset.nombre = (prod.nombre + " " + prod.categoria).toLowerCase();

        col.innerHTML =
            '<div class="card product-card h-100">' +
                '<div class="product-img-top">' +
                    '<i class="bi ' + prod.icono + '"></i>' +
                '</div>' +
                '<div class="card-body text-center d-flex flex-column justify-content-between p-4">' +
                    '<div>' +
                        '<p class="category-badge mb-1"></p>' +
                        '<h5 class="fw-bold text-dark-custom fs-6 mb-2 product-title"></h5>' +
                        '<p class="text-muted small mb-2 product-desc"></p>' +
                        '<p class="text-dark fw-bold fs-5 mb-0">' + formatCOP(prod.precioVenta) + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>';

        col.querySelector(".category-badge").textContent = prod.categoria;
        col.querySelector(".product-title").textContent  = prod.nombre;
        col.querySelector(".product-desc").textContent   = prod.descripcion;

        return col;
    }

    /* ---- Inicialización ---- */
    document.addEventListener("DOMContentLoaded", function () {
        var grid           = document.getElementById("grillaProductos");
        var searchInput    = document.getElementById("buscarProductos");
        var emptyMsg       = document.getElementById("sinProductos");
        var categoryBtns   = document.querySelectorAll(".btn-categoria");

        if (!grid) return;

        var activeCategory = "TODOS";
        var products       = getPublicProducts();

        /* Renderizar tarjetas */
        grid.innerHTML = "";
        products.forEach(function (prod) {
            grid.appendChild(createReadOnlyCard(prod));
        });

        /* Filtros */
        function applyFilters() {
            var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
            var cards = grid.querySelectorAll(".producto-item");
            var visibleCount = 0;

            cards.forEach(function (card) {
                var matchCat  = activeCategory === "TODOS" || card.dataset.categoria === activeCategory;
                var matchText = !query || card.dataset.nombre.includes(query);
                var visible   = matchCat && matchText;
                card.style.display = visible ? "" : "none";
                if (visible) visibleCount += 1;
            });

            if (emptyMsg) { emptyMsg.hidden = visibleCount > 0; }
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        categoryBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                categoryBtns.forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
                activeCategory = (btn.dataset.categoria || "TODOS").toUpperCase();
                applyFilters();
            });
        });
    });
})();

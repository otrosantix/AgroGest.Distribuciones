/* =========================================================
   AgroGest Distribuciones - Productos (productos.js)
   ========================================================= */

(function () {
    "use strict";

    const DEFAULT_PRODUCTS = [
        { id: 1, codigo: "PRO-0001", nombre: "Semilla de Maíz Híbrido", marca: "Agroseed", categoria: "SEMILLAS", proveedor: "AgroPro S.A.S.", nit: "900.123.456-7", presentacion: "Bolsa x 1 Kg", unidad: "Kilogramos (kg)", estado: "Activo", precioCompra: 35000, precioVenta: 45000, stockMinimo: 50, icono: "bi-flower1", descripcion: "Semilla de alta calidad, ideal para climas templados y cálidos." },
        { id: 2, codigo: "PRO-0103", nombre: "Fertilizante Líquido", marca: "AgroPlus", categoria: "FERTILIZANTES", proveedor: "AgroPro S.A.S.", nit: "900.123.456-7", presentacion: "Garrafa x 5 L", unidad: "Litros (L)", estado: "Activo", precioCompra: 24000, precioVenta: 32500, stockMinimo: 40, icono: "bi-droplet-fill", descripcion: "Fertilizante foliar de rápida absorción." },
        { id: 3, codigo: "PRO-0052", nombre: "Pulverizadora Manual", marca: "CampoPro", categoria: "HERRAMIENTAS", proveedor: "Insumos del Campo S.A.", nit: "800.456.789-1", presentacion: "Unidad 20 L", unidad: "Unidades", estado: "Activo", precioCompra: 92000, precioVenta: 120000, stockMinimo: 5, icono: "bi-tools", descripcion: "Pulverizadora manual de espalda con boquilla regulable." },
        { id: 4, codigo: "PRO-0084", nombre: "Semilla de Trigo", marca: "Agroseed", categoria: "SEMILLAS", proveedor: "Distribuciones Agrícolas Ltda.", nit: "901.789.321-4", presentacion: "Bolsa x 1 Kg", unidad: "Kilogramos (kg)", estado: "Activo", precioCompra: 20000, precioVenta: 28000, stockMinimo: 30, icono: "bi-tree", descripcion: "Semilla certificada de alto rendimiento." }
    ];

    function getProducts() {
        const stored = window.AgroGest.getStore("agrogest_productos", null);
        if (!Array.isArray(stored) || stored.length === 0) {
            window.AgroGest.setStore("agrogest_productos", DEFAULT_PRODUCTS);
            return DEFAULT_PRODUCTS.slice();
        }
        return stored;
    }

    function createCard(prod) {
        const col = document.createElement("div");
        col.className = "col producto-item";
        col.dataset.categoria = (prod.categoria || "").toUpperCase();
        col.dataset.nombre = ((prod.nombre || "") + " " + (prod.categoria || "") + " " + (prod.codigo || "")).toLowerCase();

        col.innerHTML =
            '<div class="card product-card h-100">' +
                '<div class="product-img-top">' +
                    '<a href="editar-producto.html?id=' + encodeURIComponent(prod.id) + '" class="settings-icon" title="Editar producto" aria-label="Editar ' + prod.nombre + '">' +
                        '<i class="bi bi-gear-fill"></i>' +
                    '</a>' +
                    '<i class="bi ' + (prod.icono || "bi-box-seam") + '"></i>' +
                '</div>' +
                '<div class="card-body text-center d-flex flex-column justify-content-between p-4">' +
                    '<div>' +
                        '<p class="category-badge mb-1"></p>' +
                        '<h5 class="fw-bold text-dark-custom fs-6 mb-2 product-title"></h5>' +
                        '<p class="text-dark fw-bold fs-5 mb-4">' + window.AgroGest.formatCOP(prod.precioVenta) + '</p>' +
                    '</div>' +
                    '<button type="button" class="btn btn-outline-agro w-100 rounded-pill py-2 btn-agregar-carrito">Agregar al carrito</button>' +
                '</div>' +
            '</div>';

        col.querySelector(".category-badge").textContent = (prod.categoria || "GENERAL").toUpperCase();
        col.querySelector(".product-title").textContent = prod.nombre;

        col.querySelector(".btn-agregar-carrito").addEventListener("click", function () {
            const cart = window.AgroGest.getStore("agrogest_carrito", []);
            const existing = cart.find(function (item) { return String(item.id) === String(prod.id); });
            if (existing) {
                existing.cantidad += 1;
            } else {
                cart.push({ id: prod.id, nombre: prod.nombre, precio: Number(prod.precioVenta) || 0, cantidad: 1 });
            }
            window.AgroGest.setStore("agrogest_carrito", cart);
            updateCartBadge();
            window.AgroGest.showToast("Agregado al carrito: " + prod.nombre, "success");
        });

        return col;
    }

    function updateCartBadge() {
        const badge = document.getElementById("contadorCarrito");
        if (!badge) return;
        const cart = window.AgroGest.getStore("agrogest_carrito", []);
        const total = cart.reduce(function (sum, item) { return sum + (item.cantidad || 0); }, 0);
        badge.textContent = total;
    }

    document.addEventListener("DOMContentLoaded", function () {
        const grid = document.getElementById("grillaProductos");
        const searchInput = document.getElementById("buscarProductos");
        const emptyMsg = document.getElementById("sinProductos");
        const categoryButtons = document.querySelectorAll(".btn-categoria");

        if (!grid) return;

        let activeCategory = "TODOS";
        const products = getProducts();

        grid.innerHTML = "";
        products.forEach(function (prod) {
            grid.appendChild(createCard(prod));
        });

        updateCartBadge();

        function applyFilters() {
            const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
            const cards = grid.querySelectorAll(".producto-item");
            let visibleCount = 0;

            cards.forEach(function (card) {
                const matchCat = activeCategory === "TODOS" || card.dataset.categoria === activeCategory;
                const matchText = !query || card.dataset.nombre.includes(query);
                const visible = matchCat && matchText;
                card.style.display = visible ? "" : "none";
                if (visible) visibleCount += 1;
            });

            if (emptyMsg) {
                emptyMsg.hidden = visibleCount > 0;
            }
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        categoryButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                categoryButtons.forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
                activeCategory = (btn.dataset.categoria || "TODOS").toUpperCase();
                applyFilters();
            });
        });
    });
})();

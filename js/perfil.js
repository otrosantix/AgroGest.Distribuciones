/* =========================================================
   AgroGest Distribuciones - Mi Perfil (perfil.js)
   Necesita que usuarios.js se cargue antes
   ========================================================= */

(function () {
    "use strict";

    function getActiveUserId() {
        return sessionStorage.getItem("agrogest_usuario_id") || "1";
    }

    function mostrarMisDatos() {
        const activeId = getActiveUserId();
        const yo = buscarUsuario(activeId) || buscarUsuario(1);
        if (!yo) return;

        document.getElementById("miAvatar").textContent = sacarIniciales(yo.nombres, yo.apellidos);
        document.getElementById("miNombre").textContent = yo.nombres + " " + yo.apellidos;
        document.getElementById("miCargo").textContent = nombreRol(yo.rol) + " del sistema";
        document.getElementById("miCorreo").textContent = yo.correo;
        document.getElementById("miTelefono").textContent = yo.celular;
        document.getElementById("miDocumento").textContent = yo.tipoDoc + " " + yo.numDoc;
        document.getElementById("miRol").textContent = nombreRol(yo.rol);

        const btnEditarMisDatos = document.querySelector('a[href^="nuevo-usuario.html?id="]');
        if (btnEditarMisDatos) {
            btnEditarMisDatos.href = "nuevo-usuario.html?id=" + encodeURIComponent(yo.id);
        }
    }

    function mostrarCuentas() {
        const tabla = document.getElementById("tabla-cuentas-cuerpo");
        const contador = document.getElementById("contador-cuentas");
        if (!tabla || !contador) return;

        const activeId = getActiveUserId();
        const lista = obtenerUsuarios();
        tabla.innerHTML = "";

        lista.forEach(function (u) {
            const fila = tabla.insertRow();
            const esAdminPrincipal = String(u.id) === "1";
            const esUsuarioActual = String(u.id) === String(activeId);

            fila.innerHTML =
                "<td>" +
                    '<div class="d-flex align-items-center gap-3">' +
                        '<span class="mini-avatar"></span>' +
                        "<div>" +
                            '<span class="cuenta-nombre"></span>' +
                            '<span class="cuenta-correo"></span>' +
                        "</div>" +
                    "</div>" +
                "</td>" +
                '<td><span class="etiqueta-rol rol-' + u.rol + '">' + nombreRol(u.rol) + "</span></td>" +
                '<td><span class="estado-activo">Activa</span></td>' +
                '<td class="text-end text-nowrap">' +
                    '<a class="btn btn-editar" href="nuevo-usuario.html?id=' + encodeURIComponent(u.id) + '">' +
                        '<i class="bi bi-pencil-square me-1"></i>Editar' +
                    "</a>" +
                    (esAdminPrincipal || esUsuarioActual
                        ? ""
                        : ' <button type="button" class="btn btn-eliminar-cuenta" data-id="' + u.id + '" title="Eliminar cuenta" aria-label="Eliminar cuenta"><i class="bi bi-trash3"></i></button>') +
                "</td>";

            fila.querySelector(".mini-avatar").textContent = sacarIniciales(u.nombres, u.apellidos);
            fila.querySelector(".cuenta-nombre").textContent = u.nombres + " " + u.apellidos;
            fila.querySelector(".cuenta-correo").textContent = u.correo;

            if (esUsuarioActual) {
                const tu = document.createElement("span");
                tu.className = "tu-cuenta";
                tu.textContent = "(tú)";
                fila.querySelector(".cuenta-nombre").appendChild(tu);
            }

            const btnEliminar = fila.querySelector(".btn-eliminar-cuenta");
            if (btnEliminar) {
                btnEliminar.addEventListener("click", function () {
                    if (eliminarUsuario(u.id)) {
                        mostrarCuentas();
                        if (window.AgroGest) {
                            window.AgroGest.showToast("Cuenta eliminada correctamente.", "success");
                        }
                    }
                });
            }
        });

        contador.textContent = lista.length === 1
            ? "1 cuenta con acceso"
            : lista.length + " cuentas con acceso";
    }

    document.addEventListener("DOMContentLoaded", function () {
        mostrarMisDatos();
        mostrarCuentas();
    });
})();

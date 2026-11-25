/* =========================================================
   AgroGest Distribuciones - Crear o editar usuario (nuevo-usuario.js)
   Necesita que usuarios.js se cargue antes
   ========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const formulario = document.getElementById("formUsuario");
        const campoClave = document.getElementById("clave");
        const campoCorreo = document.getElementById("correo");
        const toggleClaveBtn = document.getElementById("toggleClaveUsuario");
        if (!formulario || !campoClave || !campoCorreo) return;

        const campos = [
            "tipoDoc", "numDoc", "fechaNac", "nombres", "apellidos", "genero",
            "celular", "fijo", "direccion", "ciudad", "correo", "rol"
        ];

        const parametros = new URLSearchParams(window.location.search);
        const idEditar = parametros.get("id");
        const usuarioEditar = idEditar !== null ? buscarUsuario(idEditar) : null;

        document.getElementById("fechaNac").max = new Date().toISOString().split("T")[0];

        if (toggleClaveBtn) {
            toggleClaveBtn.addEventListener("click", function () {
                const isPass = campoClave.type === "password";
                campoClave.type = isPass ? "text" : "password";
                const icon = toggleClaveBtn.querySelector("i");
                if (icon) {
                    icon.className = isPass ? "bi bi-eye-slash" : "bi bi-eye";
                }
            });
        }

        if (usuarioEditar !== null) {
            document.title = "Editar usuario - AgroGest";
            document.getElementById("tituloAccion").textContent = "Editar";
            document.getElementById("subtitulo").textContent = "Modifica los datos de este usuario";
            document.getElementById("migaActual").textContent = "Editar usuario";
            document.getElementById("btnGuardar").innerHTML = '<i class="bi bi-floppy me-1"></i>Guardar cambios';

            campoClave.required = false;
            campoClave.placeholder = "Nueva contraseña (opcional)";
            document.getElementById("asteriscoClave").hidden = true;
            document.getElementById("ayudaClave").hidden = false;

            campos.forEach(function (nombre) {
                const input = document.getElementById(nombre);
                if (input) {
                    input.value = usuarioEditar[nombre] || "";
                }
            });
        }

        function correoRepetido(correo) {
            const lista = obtenerUsuarios();
            return lista.some(function (u) {
                const esOtroUsuario = !usuarioEditar || String(u.id) !== String(usuarioEditar.id);
                return esOtroUsuario && (u.correo || "").toLowerCase() === correo.toLowerCase();
            });
        }

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (correoRepetido(campoCorreo.value.trim())) {
                campoCorreo.setCustomValidity("Repetido");
                document.getElementById("errorCorreo").textContent = "Ya existe un usuario con este correo.";
            } else {
                campoCorreo.setCustomValidity("");
                document.getElementById("errorCorreo").textContent = "Escribe un correo válido.";
            }

            // En edición, si ingresa una nueva contraseña debe tener mínimo 8 caracteres
            if (campoClave.value.length > 0 && campoClave.value.length < 8) {
                campoClave.setCustomValidity("La contraseña debe tener mínimo 8 caracteres.");
            } else {
                campoClave.setCustomValidity("");
            }

            if (!formulario.checkValidity()) {
                formulario.classList.add("was-validated");
                if (window.AgroGest) {
                    window.AgroGest.showToast("Revisa los campos resaltados del formulario.", "error");
                }
                return;
            }

            const usuario = {};
            campos.forEach(function (nombre) {
                usuario[nombre] = document.getElementById(nombre).value.trim();
            });

            const lista = obtenerUsuarios();
            if (usuarioEditar !== null) {
                usuario.id = usuarioEditar.id;
                usuario.clave = campoClave.value !== "" ? campoClave.value : (usuarioEditar.clave || "agrogest123");
                const idx = lista.findIndex(function (u) { return String(u.id) === String(usuario.id); });
                if (idx >= 0) lista[idx] = usuario;
            } else {
                usuario.id = Date.now();
                usuario.clave = campoClave.value;
                lista.push(usuario);
            }

            guardarUsuarios(lista);

            // Si se editó el usuario con sesión iniciada, actualiza los datos de sesión
            const activeId = sessionStorage.getItem("agrogest_usuario_id");
            if (activeId && String(activeId) === String(usuario.id)) {
                sessionStorage.setItem("agrogest_usuario_activo", usuario.correo);
                sessionStorage.setItem("agrogest_usuario_nombre", (usuario.nombres + " " + usuario.apellidos).trim());
                sessionStorage.setItem("agrogest_usuario_rol", nombreRol(usuario.rol));
            }

            window.location.href = "perfil.html";
        });
    });
})();

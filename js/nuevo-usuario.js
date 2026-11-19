// nuevo-usuario.js - Crear o editar un usuario
// Necesita que usuarios.js se cargue antes

var formulario = document.getElementById("formUsuario");
var campoClave = document.getElementById("clave");
var campoCorreo = document.getElementById("correo");

// Los campos del formulario (el id de cada uno coincide con el nombre del dato)
var campos = ["tipoDoc", "numDoc", "fechaNac", "nombres", "apellidos", "genero",
              "celular", "fijo", "direccion", "ciudad", "correo", "rol"];

// Si la dirección es nuevo-usuario.html?id=3 estamos EDITANDO al usuario 3
var parametros = new URLSearchParams(window.location.search);
var idEditar = parametros.get("id");
var usuarioEditar = null;

// No se puede elegir una fecha de nacimiento futura
document.getElementById("fechaNac").max = new Date().toISOString().split("T")[0];

// Si hay id, llenamos el formulario con los datos de ese usuario
if (idEditar != null) {
    usuarioEditar = buscarUsuario(idEditar);
}

if (usuarioEditar != null) {
    // Cambiamos los textos de la página a modo "editar"
    document.title = "Editar usuario - AgroGest";
    document.getElementById("tituloAccion").textContent = "Editar";
    document.getElementById("subtitulo").textContent = "Modifica los datos de este usuario";
    document.getElementById("migaActual").textContent = "Editar usuario";
    document.getElementById("btnGuardar").innerHTML = '<i class="bi bi-floppy me-1"></i>Guardar cambios';

    // En edición la contraseña es opcional
    campoClave.required = false;
    campoClave.placeholder = "Nueva contraseña (opcional)";
    document.getElementById("asteriscoClave").hidden = true;
    document.getElementById("ayudaClave").hidden = false;

    // Ponemos cada dato en su campo
    for (var i = 0; i < campos.length; i++) {
        var nombre = campos[i];
        document.getElementById(nombre).value = usuarioEditar[nombre];
    }
}

// Revisa que el correo no lo tenga otro usuario
function correoRepetido(correo) {
    var lista = obtenerUsuarios();
    for (var i = 0; i < lista.length; i++) {
        var esOtroUsuario = (usuarioEditar == null) || (lista[i].id != usuarioEditar.id);
        if (esOtroUsuario && lista[i].correo.toLowerCase() == correo.toLowerCase()) {
            return true;
        }
    }
    return false;
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evita que la página se recargue

    // Si el correo ya existe lo marcamos como inválido
    if (correoRepetido(campoCorreo.value.trim())) {
        campoCorreo.setCustomValidity("Repetido");
        document.getElementById("errorCorreo").textContent = "Ya existe un usuario con este correo.";
    } else {
        campoCorreo.setCustomValidity("");
        document.getElementById("errorCorreo").textContent = "Escribe un correo válido.";
    }

    // Si algo está mal, mostramos los avisos y paramos
    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        return;
    }

    // Armamos el usuario con los datos del formulario
    var usuario = {};
    for (var i = 0; i < campos.length; i++) {
        usuario[campos[i]] = document.getElementById(campos[i]).value.trim();
    }

    var lista = obtenerUsuarios();

    if (usuarioEditar != null) {
        // EDITAR: reemplazamos el usuario que tenía ese id
        usuario.id = usuarioEditar.id;
        for (var j = 0; j < lista.length; j++) {
            if (lista[j].id == usuario.id) {
                lista[j] = usuario;
            }
        }
    } else {
        // NUEVO: le damos un id único y lo agregamos
        usuario.id = Date.now();
        lista.push(usuario);
    }

    // OJO: la contraseña NO se guarda aquí (en el navegador no es seguro).
    // Cuando tengas backend, se envía al servidor y allí se guarda cifrada.
    guardarUsuarios(lista);

    // Volvemos a la lista de cuentas
    window.location.href = "perfil.html";
});
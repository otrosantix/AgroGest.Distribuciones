// perfil.js - Página Mi perfil de AgroGest
// Necesita que usuarios.js se cargue antes

var tabla = document.getElementById("tabla-cuentas-cuerpo");
var contador = document.getElementById("contador-cuentas");

// Llena la tarjeta con los datos del administrador (usuario con id 1)
function mostrarMisDatos() {
    var yo = buscarUsuario(1);
    if (yo == null) {
        return;
    }
    document.getElementById("miAvatar").textContent = sacarIniciales(yo.nombres, yo.apellidos);
    document.getElementById("miNombre").textContent = yo.nombres + " " + yo.apellidos;
    document.getElementById("miCargo").textContent = nombreRol(yo.rol) + " del sistema";
    document.getElementById("miCorreo").textContent = yo.correo;
    document.getElementById("miTelefono").textContent = yo.celular;
    document.getElementById("miDocumento").textContent = yo.tipoDoc + " " + yo.numDoc;
    document.getElementById("miRol").textContent = nombreRol(yo.rol);
}

// Dibuja una fila de la tabla por cada usuario
function mostrarCuentas() {
    var lista = obtenerUsuarios();
    tabla.innerHTML = "";

    for (var i = 0; i < lista.length; i++) {
        var u = lista[i];
        var fila = tabla.insertRow();

        fila.innerHTML =
            '<td>' +
                '<div class="d-flex align-items-center gap-3">' +
                    '<span class="mini-avatar"></span>' +
                    '<div>' +
                        '<span class="cuenta-nombre"></span>' +
                        '<span class="cuenta-correo"></span>' +
                    '</div>' +
                '</div>' +
            '</td>' +
            '<td><span class="etiqueta-rol rol-' + u.rol + '">' + nombreRol(u.rol) + '</span></td>' +
            '<td><span class="estado-activo">Activa</span></td>' +
            '<td class="text-end">' +
                '<a class="btn btn-editar" href="nuevo-usuario.html?id=' + u.id + '">' +
                '<i class="bi bi-pencil-square me-1"></i>Editar</a>' +
            '</td>';

        // Los textos se ponen con textContent para que no rompan la página
        fila.querySelector(".mini-avatar").textContent = sacarIniciales(u.nombres, u.apellidos);
        fila.querySelector(".cuenta-nombre").textContent = u.nombres + " " + u.apellidos;
        fila.querySelector(".cuenta-correo").textContent = u.correo;

        // Marcamos la cuenta del administrador
        if (u.id == 1) {
            var tu = document.createElement("span");
            tu.className = "tu-cuenta";
            tu.textContent = "(tú)";
            fila.querySelector(".cuenta-nombre").appendChild(tu);
        }
    }

    // Contador de cuentas
    if (lista.length == 1) {
        contador.textContent = "1 cuenta con acceso";
    } else {
        contador.textContent = lista.length + " cuentas con acceso";
    }
}

mostrarMisDatos();
mostrarCuentas();

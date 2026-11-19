// usuarios.js - Datos de usuarios compartidos por perfil.html y nuevo-usuario.html
// DEMO: los usuarios se guardan en el navegador (localStorage).
// Cuando tengas backend, estas funciones se reemplazan por peticiones al servidor.

// Solo hay dos roles que inician sesión: administrador y empleado
// Si cambias los datos iniciales y quieres reiniciar todo, sube la versión (v3 -> v4)
var CLAVE_USUARIOS = "agrogest_usuarios_v3";

// Usuarios que existen la primera vez que se abre la página
// OJO: los roles SIEMPRE en minúscula ("administrador" o "empleado")
var usuariosIniciales = [
    {
        id: 1, tipoDoc: "CC", numDoc: "1000000000", fechaNac: "", nombres: "Administrador",
        apellidos: "AgroGest", genero: "", celular: "3000000000", fijo: "",
        direccion: "Carrera 10 # 25-30", ciudad: "Pesca", correo: "admin@agrogest.com", rol: "administrador"
    },
    {
        id: 2, tipoDoc: "CC", numDoc: "1055227430", fechaNac: "", nombres: "Julian",
        apellidos: "Morales", genero: "Masculino", celular: "3101234567", fijo: "",
        direccion: "Calle 5 # 8-20", ciudad: "Pesca", correo: "julian.morales@agrogest.com", rol: "administrador"
    },
    {
        id: 3, tipoDoc: "CC", numDoc: "1060123456", fechaNac: "", nombres: "Jhon",
        apellidos: "Correa", genero: "Masculino", celular: "3112223344", fijo: "",
        direccion: "Sogamoso", ciudad: "Sogamoso", correo: "jhon.correa@agrogest.com", rol: "administrador"
    },
    {
        id: 4, tipoDoc: "CC", numDoc: "1023456789", fechaNac: "", nombres: "Diego",
        apellidos: "sepulveda", genero: "Masculino", celular: "3207654321", fijo: "",
        direccion: "Vereda El Centro", ciudad: "Pesca", correo: "diego.sepulveda@agrogest.com", rol: "empleado"
    }
];

// Devuelve la lista de usuarios guardada.
// Además: agrega los usuarios iniciales que falten (por id) y arregla roles con mayúscula.
function obtenerUsuarios() {
    var guardados = localStorage.getItem(CLAVE_USUARIOS);
    var lista = [];
    var cambio = false;

    if (guardados == null) {
        cambio = true;
    } else {
        try {
            lista = JSON.parse(guardados);
        } catch (error) {
            lista = [];
            cambio = true;
        }
    }

    // Agrega los usuarios iniciales que no estén en la lista
    for (var i = 0; i < usuariosIniciales.length; i++) {
        var existe = false;
        for (var j = 0; j < lista.length; j++) {
            if (lista[j].id == usuariosIniciales[i].id) {
                existe = true;
            }
        }
        if (!existe) {
            lista.push(JSON.parse(JSON.stringify(usuariosIniciales[i])));
            cambio = true;
        }
    }

    // Normaliza el rol (evita "Administrador" con mayúscula o rol vacío)
    for (var k = 0; k < lista.length; k++) {
        var rolActual = lista[k].rol || "empleado";
        var rolBueno = rolActual.toLowerCase();
        if (lista[k].rol != rolBueno) {
            lista[k].rol = rolBueno;
            cambio = true;
        }
    }

    if (cambio) {
        guardarUsuarios(lista);
    }
    return lista;
}

// Guarda la lista completa de usuarios
function guardarUsuarios(lista) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

// Busca un usuario por su id (devuelve null si no existe)
function buscarUsuario(id) {
    var lista = obtenerUsuarios();
    for (var i = 0; i < lista.length; i++) {
        if (lista[i].id == id) {
            return lista[i];
        }
    }
    return null;
}

// "vendedor" -> "Vendedor"
function nombreRol(rol) {
    rol = rol || "";
    return rol.charAt(0).toUpperCase() + rol.slice(1);
}

// Iniciales para el avatar (Ej: María Rodríguez -> MR)
function sacarIniciales(nombres, apellidos) {
    return ((nombres || "").charAt(0) + (apellidos || "").charAt(0)).toUpperCase();
}

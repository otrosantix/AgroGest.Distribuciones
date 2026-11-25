/* =========================================================
   AgroGest Distribuciones - Datos de usuarios (usuarios.js)
   Compartido por inicio-sesion.html, perfil.html y nuevo-usuario.html
   ========================================================= */

const CLAVE_USUARIOS = "agrogest_usuarios_v3";

const usuariosIniciales = [
    {
        id: 1, tipoDoc: "CC", numDoc: "1000000000", fechaNac: "", nombres: "Administrador",
        apellidos: "AgroGest", genero: "", celular: "3000000000", fijo: "",
        direccion: "Carrera 10 # 25-30", ciudad: "Pesca", correo: "admin@agrogest.com",
        rol: "administrador", clave: "admin1234"
    },
    {
        id: 2, tipoDoc: "CC", numDoc: "1055227430", fechaNac: "", nombres: "Julian",
        apellidos: "Morales", genero: "Masculino", celular: "3101234567", fijo: "",
        direccion: "Calle 5 # 8-20", ciudad: "Pesca", correo: "julian.morales@agrogest.com",
        rol: "administrador", clave: "julian1234"
    },
    {
        id: 3, tipoDoc: "CC", numDoc: "1060123456", fechaNac: "", nombres: "Jhon",
        apellidos: "Correa", genero: "Masculino", celular: "3112223344", fijo: "",
        direccion: "Sogamoso", ciudad: "Sogamoso", correo: "jhon.correa@agrogest.com",
        rol: "administrador", clave: "jhon1234"
    },
    {
        id: 4, tipoDoc: "CC", numDoc: "1023456789", fechaNac: "", nombres: "Diego",
        apellidos: "Sepulveda", genero: "Masculino", celular: "3207654321", fijo: "",
        direccion: "Vereda El Centro", ciudad: "Pesca", correo: "diego.sepulveda@agrogest.com",
        rol: "empleado", clave: "diego1234"
    }
];

function obtenerUsuarios() {
    const guardados = localStorage.getItem(CLAVE_USUARIOS);
    let lista = [];
    let cambio = false;

    if (guardados === null) {
        cambio = true;
    } else {
        try {
            const parsed = JSON.parse(guardados);
            if (Array.isArray(parsed)) {
                lista = parsed;
            } else {
                cambio = true;
            }
        } catch (error) {
            lista = [];
            cambio = true;
        }
    }

    usuariosIniciales.forEach(function (inicial) {
        const existe = lista.some(function (u) { return String(u.id) === String(inicial.id); });
        if (!existe) {
            lista.push(Object.assign({}, inicial));
            cambio = true;
        }
    });

    lista.forEach(function (u) {
        const rolBueno = (u.rol || "empleado").toLowerCase();
        if (u.rol !== rolBueno) {
            u.rol = rolBueno;
            cambio = true;
        }
        if (!u.clave) {
            const base = usuariosIniciales.find(function (ini) { return String(ini.id) === String(u.id); });
            u.clave = base ? base.clave : "agrogest123";
            cambio = true;
        }
    });

    if (cambio) {
        guardarUsuarios(lista);
    }
    return lista;
}

function guardarUsuarios(lista) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

function buscarUsuario(id) {
    const lista = obtenerUsuarios();
    return lista.find(function (u) { return String(u.id) === String(id); }) || null;
}

function buscarUsuarioPorCorreo(correo) {
    const target = (correo || "").trim().toLowerCase();
    if (!target) return null;
    const lista = obtenerUsuarios();
    return lista.find(function (u) {
        return (u.correo || "").trim().toLowerCase() === target;
    }) || null;
}

function autenticarUsuario(correo, clave) {
    const usuario = buscarUsuarioPorCorreo(correo);
    if (!usuario) return null;
    if (String(usuario.clave || "") !== String(clave || "")) {
        return null;
    }
    return usuario;
}

function eliminarUsuario(id) {
    if (String(id) === "1") return false;
    const lista = obtenerUsuarios().filter(function (u) { return String(u.id) !== String(id); });
    guardarUsuarios(lista);
    return true;
}

function nombreRol(rol) {
    const clean = rol || "";
    return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function sacarIniciales(nombres, apellidos) {
    return ((nombres || "").charAt(0) + (apellidos || "").charAt(0)).toUpperCase();
}

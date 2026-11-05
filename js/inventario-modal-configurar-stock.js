
// Esperamos a que toda la página (incluido el modal) esté cargada
document.addEventListener("DOMContentLoaded", function () {

    // Variables que guardan lo que se está editando
    var filaActual = null;   // la fila (tr) del producto que se está configurando
    var stockActual = 0;     // stock actual del producto

    // Elementos del modal
    var elementoModal = document.getElementById("modalStock");
    var inputCantidad = document.getElementById("cantidad"); // ahora es un input
    var tipoAjuste = document.getElementById("tipoAjuste");

    // 1. Al presionar "Configurar", llenamos el modal con los datos de esa fila
    var botones = document.querySelectorAll(".btn-config");

    botones.forEach(function (boton) {
        boton.addEventListener("click", function (evento) {
            evento.preventDefault(); // evita que el href="#" suba la página

            // closest("tr") busca la fila que contiene el botón presionado
            filaActual = boton.closest("tr");

            // Leemos los datos que ya están escritos en la fila
            var nombre = filaActual.querySelector(".producto-nombre").textContent;
            var codigo = filaActual.querySelector(".producto-codigo").textContent.replace("Cod: ", "");
            var celdaStock = filaActual.cells[2];                       // 3ra columna: Stock Actual
            var unidad = celdaStock.querySelector("small").textContent; // Kg, L o Unidades

            // firstChild es el texto que va antes del <small> (por ejemplo "120 ")
            stockActual = parseInt(celdaStock.firstChild.textContent);

            // Mostramos los datos en el modal
            document.getElementById("modalNombre").textContent = nombre;
            document.getElementById("modalDetalle").textContent = "Código: " + codigo + " | Unidad: " + unidad;
            document.getElementById("modalStockActual").textContent = stockActual;

            // Reiniciamos los campos
            inputCantidad.value = 0;
            tipoAjuste.selectedIndex = 0;

            // Abrimos el modal con Bootstrap
            bootstrap.Modal.getOrCreateInstance(elementoModal).show();
        });
    });

    // 2. Botones - y + (cambian el número que hay escrito en el input)
    document.getElementById("btnSumar").addEventListener("click", function () {
        // Number(...) convierte el texto a número; si está vacío usamos 0
        inputCantidad.value = (Number(inputCantidad.value) || 0) + 1;
    });

    document.getElementById("btnRestar").addEventListener("click", function () {
        var nuevo = (Number(inputCantidad.value) || 0) - 1;
        if (nuevo < 0) {
            nuevo = 0; // no dejamos números negativos
        }
        inputCantidad.value = nuevo;
    });

    // 3. Guardar el ajuste
    document.getElementById("btnGuardar").addEventListener("click", function () {
        // Leemos el número que escribió el usuario
        var cantidad = Number(inputCantidad.value);

        // Validaciones
        if (tipoAjuste.value === "") {
            alert("Selecciona el tipo de ajuste");
            return;
        }
        if (inputCantidad.value === "" || cantidad < 0) {
            alert("Escribe una cantidad válida");
            return;
        }
        if (cantidad === 0 && tipoAjuste.value !== "correccion") {
            alert("La cantidad no puede ser 0");
            return;
        }

        // Calculamos el nuevo stock según el tipo de ajuste
        var nuevoStock = stockActual;
        if (tipoAjuste.value ==="entrada") {
            nuevoStock = stockActual + cantidad;   // entrada: suma
        } else if (tipoAjuste.value === "salida") {
            nuevoStock = stockActual - cantidad;   // salida: resta
        } else {
            nuevoStock = cantidad;                 // corrección: el stock pasa a ser ese número
        }

        if (nuevoStock < 0) {
            alert("El stock no puede quedar negativo");
            return;
        }

        // Cambiamos solo el número en la tabla, sin borrar la unidad (<small>)
        filaActual.cells[2].firstChild.textContent = nuevoStock + " ";

        // Cerramos el modal
        bootstrap.Modal.getInstance(elementoModal).hide();
    });

});
// Traemos del HTML los elementos con los que vamos a trabajar
const campoBusqueda = document.getElementById('campo-busqueda');
const botonTodos = document.getElementById('filtro-todos');
const mensajeVacio = document.getElementById('sin-resultados');

// Todas las filas de la tabla (solo las del tbody, así no cuenta el encabezado)
const filas = document.querySelectorAll('#tabla-pedidos tbody tr');

// closest('form') busca hacia "arriba" el formulario que envuelve al input
const formulario = campoBusqueda.closest('form');

// Si el usuario da Enter, el formulario intentaría recargar la página.
// preventDefault() cancela eso, porque nosotros filtramos sin recargar.
formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
});

// Esta función revisa fila por fila si coincide con lo escrito
function filtrarPedidos() {
    // Pasamos todo a minúsculas para que "agropro" encuentre "AgroPro"
    const texto = campoBusqueda.value.toLowerCase().trim();
    let visibles = 0;

    filas.forEach(function (fila) {
        // textContent es todo el texto de la fila: número, proveedor, estado, etc.
        const coincide = fila.textContent.toLowerCase().includes(texto);

        // '' devuelve la fila a su estado normal; 'none' la esconde
        fila.style.display = coincide ? '' : 'none';

        if (coincide) {
            visibles++;
        }
    });

    // Si no quedó ninguna fila visible, mostramos el mensaje
    mensajeVacio.hidden = visibles > 0;
}

// 'input' se dispara con cada letra que se escribe
campoBusqueda.addEventListener('input', filtrarPedidos);

// El botón "Todos" limpia el buscador y muestra todos los pedidos otra vez
botonTodos.addEventListener('click', function () {
    campoBusqueda.value = '';
    filtrarPedidos();
});
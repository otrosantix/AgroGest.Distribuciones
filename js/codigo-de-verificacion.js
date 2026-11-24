// js/codigo-de-verificacion.js
// Se usa en codigo-de-verificacion.html

const casillas = document.querySelectorAll('#contenedor-codigo input');
const botonVerificar = document.querySelector('#btn-verificar');
const mensaje = document.querySelector('#mensaje-codigo');
const CODIGO_CORRECTO = '1234'; // solo para la demostración

function marcarCasillas(clase) {
  casillas.forEach(function (casilla) {
    casilla.classList.remove('border-danger', 'border-success');
    if (clase) casilla.classList.add(clase);
  });
}

function mostrarMensaje(texto, clase) {
  mensaje.textContent = texto;
  mensaje.className = 'small fw-semibold mb-3 ' + clase;
}

function verificar() {
  let codigo = '';
  casillas.forEach(function (casilla) {
    codigo += casilla.value;
  });

  if (codigo.length < casillas.length) {
    marcarCasillas('border-danger');
    mostrarMensaje('Ingresa los 4 dígitos del código.', 'text-danger');
  } else if (codigo === CODIGO_CORRECTO) {
    marcarCasillas('border-success');
    mostrarMensaje('Código verificado. Iniciando sesión...', 'text-success');
    botonVerificar.disabled = true;
    setTimeout(function () {
      window.location.href = 'productos.html';
    }, 1200);
  } else {
    marcarCasillas('border-danger');
    mostrarMensaje('El código es incorrecto. Intenta de nuevo.', 'text-danger');
  }
}

if (casillas.length > 0 && botonVerificar && mensaje) {
  casillas[0].focus();

  casillas.forEach(function (casilla, indice) {
    // Al escribir: solo números y salta a la siguiente casilla
    casilla.addEventListener('input', function () {
      casilla.value = casilla.value.replace(/\D/g, '');
      marcarCasillas('');
      mostrarMensaje('', '');
      if (casilla.value !== '' && indice < casillas.length - 1) {
        casillas[indice + 1].focus();
      }
    });

    // Backspace en una casilla vacía vuelve a la anterior; Enter verifica
    casilla.addEventListener('keydown', function (evento) {
      if (evento.key === 'Backspace' && casilla.value === '' && indice > 0) {
        casillas[indice - 1].focus();
      }
      if (evento.key === 'Enter') {
        verificar();
      }
    });
  });

  botonVerificar.addEventListener('click', verificar);
}

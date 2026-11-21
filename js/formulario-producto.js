// js/formulario-producto.js
// Se usa en nuevo-producto.html y editar-producto.html

const formulario = document.querySelector('#form-producto');

if (formulario) {
  // Desactiva los avisos del navegador para mostrar los nuestros
  formulario.setAttribute('novalidate', '');

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); // evita que la página se recargue
    limpiarErrores();

    let hayErrores = false;
    let primerCampoConError = null;
    let precioCompra = null;
    let precioVenta = null;
    let campoVenta = null;

    // Los campos obligatorios son los que tienen asterisco rojo (*) en su etiqueta
    const asteriscos = formulario.querySelectorAll('label .text-danger');

    asteriscos.forEach(function (asterisco) {
      const etiqueta = asterisco.closest('label');
      const campo = etiqueta.parentElement.querySelector('input, select, textarea');
      const nombre = etiqueta.textContent.replace('*', '').trim().toLowerCase();
      const mensaje = validarCampo(campo, nombre);

      if (mensaje) {
        mostrarError(campo, mensaje);
        hayErrores = true;
        if (!primerCampoConError) primerCampoConError = campo;
      } else if (nombre === 'precio de compra') {
        precioCompra = soloNumero(campo.value);
      } else if (nombre === 'precio de venta') {
        precioVenta = soloNumero(campo.value);
        campoVenta = campo;
      }
    });

    // Regla de negocio: no se puede vender por debajo del costo
    if (precioCompra !== null && precioVenta !== null && precioVenta < precioCompra) {
      mostrarError(campoVenta, 'El precio de venta no puede ser menor al de compra.');
      hayErrores = true;
      if (!primerCampoConError) primerCampoConError = campoVenta;
    }

    if (hayErrores) {
      primerCampoConError.focus();
      return;
    }

    // Todo correcto: avisa y vuelve a la lista de productos
    const aviso = document.createElement('div');
    aviso.className = 'alert alert-success mt-3';
    aviso.textContent = (formulario.dataset.mensajeExito || 'Datos guardados.') + ' Redirigiendo...';
    formulario.prepend(aviso);
    formulario.querySelector('[type="submit"]').disabled = true;

    setTimeout(function () {
      window.location.href = 'productos.html';
    }, 1500);
  });

  // Cuando el usuario corrige un campo, se le quita el error
  formulario.addEventListener('input', function (evento) {
    quitarError(evento.target);
  });
}

// Devuelve el texto del error, o '' si el campo está bien
function validarCampo(campo, nombre) {
  const valor = campo.value.trim();

  // Select: no puede quedarse en la opción "Selecciona..." (está deshabilitada)
  if (campo.tagName === 'SELECT') {
    return campo.selectedOptions[0].disabled ? 'Selecciona una opción.' : '';
  }

  if (valor === '') {
    return 'Este campo es obligatorio.';
  }
  if (nombre.startsWith('código') && !/^PRO-\d{4}$/i.test(valor)) {
    return 'Usa el formato PRO-0001.';
  }
  if (nombre.startsWith('nit') && !/^\d{3}\.?\d{3}\.?\d{3}-\d$/.test(valor)) {
    return 'Usa el formato 900123456-7.';
  }
  if (nombre.startsWith('precio') && soloNumero(valor) <= 0) {
    return 'Ingresa un valor mayor que 0.';
  }
  if (nombre.startsWith('stock') && Number(valor) < 0) {
    return 'El stock no puede ser negativo.';
  }
  return '';
}

// "$ 35.000" -> 35000
function soloNumero(texto) {
  return Number(texto.replace(/\D/g, ''));
}

function mostrarError(campo, texto) {
  campo.classList.add('is-invalid'); // clase de Bootstrap: borde rojo
  const aviso = document.createElement('div');
  aviso.className = 'invalid-feedback d-block';
  aviso.textContent = texto;
  const destino = campo.closest('.input-group') || campo;
  destino.insertAdjacentElement('afterend', aviso);
}

function quitarError(campo) {
  campo.classList.remove('is-invalid');
  const destino = campo.closest('.input-group') || campo;
  const siguiente = destino.nextElementSibling;
  if (siguiente && siguiente.classList.contains('invalid-feedback')) {
    siguiente.remove();
  }
}

function limpiarErrores() {
  formulario.querySelectorAll('.invalid-feedback').forEach(function (aviso) {
    aviso.remove();
  });
  formulario.querySelectorAll('.is-invalid').forEach(function (campo) {
    campo.classList.remove('is-invalid');
  });
}

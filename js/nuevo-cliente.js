/* =========================================================
   AgroGest Distribuciones - Nuevo Cliente (nuevo-cliente.js)
   ========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("form-cliente");
        if (!form) return;

        const tipoDoc = document.getElementById("tipo-documento");
        const numDoc = document.getElementById("numero-documento");
        const nombres = document.getElementById("nombres");
        const apellidos = document.getElementById("apellidos");
        const celular = document.getElementById("telefono-celular");
        const correo = document.getElementById("correo");
        const direccion = document.getElementById("direccion");
        const ciudad = document.getElementById("ciudad");

        const resNombre = document.getElementById("resumenNombre");
        const resDoc = document.getElementById("resumenDoc");
        const resTel = document.getElementById("resumenTel");
        const resCorreo = document.getElementById("resumenCorreo");
        const resCiudad = document.getElementById("resumenCiudad");
        const resDireccion = document.getElementById("resumenDireccion");

        function setField(el, val, placeholder) {
            if (!el) return;
            const clean = (val || "").trim();
            if (clean) {
                el.textContent = clean;
                el.className = "dato-lleno";
            } else {
                el.textContent = placeholder || "-";
                el.className = "dato-vacio";
            }
        }

        function updateSummary() {
            const fullName = ((nombres ? nombres.value : "") + " " + (apellidos ? apellidos.value : "")).trim();
            if (resNombre) {
                resNombre.textContent = fullName || "Sin nombre registrado";
            }
            const docVal = numDoc && numDoc.value.trim()
                ? (tipoDoc ? tipoDoc.value + " " : "") + numDoc.value.trim()
                : "";
            setField(resDoc, docVal, "-");
            setField(resTel, celular ? celular.value : "", "-");
            setField(resCorreo, correo ? correo.value : "", "-");
            setField(resCiudad, ciudad ? ciudad.value : "", "-");
            setField(resDireccion, direccion ? direccion.value : "", "-");
        }

        [tipoDoc, numDoc, nombres, apellidos, celular, correo, direccion, ciudad].forEach(function (el) {
            if (!el) return;
            el.addEventListener("input", updateSummary);
            el.addEventListener("change", updateSummary);
        });

        updateSummary();

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                window.AgroGest.showToast("Completa los campos obligatorios del cliente.", "error");
                return;
            }

            const list = window.AgroGest.getStore("agrogest_clientes", []);
            list.push({
                nombre: (nombres.value.trim() + " " + apellidos.value.trim()).trim(),
                documento: tipoDoc.value + " " + numDoc.value.trim(),
                telefono: celular.value.trim(),
                correo: correo.value.trim() || "Sin correo",
                direccion: direccion.value.trim(),
                ciudad: ciudad.value
            });

            window.AgroGest.setStore("agrogest_clientes", list);
            window.location.href = "nueva-venta.html";
        });
    });
})();

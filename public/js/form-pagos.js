import { $, $$, initOnce } from './utils.js';
import { initModales } from './modales.js';
import { initNotificaciones } from './notificaciones.js';
import { initInputs } from './inputs.js';
import { initSaldo } from './saldo.js';

export function initFormPagos({ modales, inputs, notificaciones, saldo }) {
    // ===============================
    // ! SECCION: FORMULARIO
    // ===============================

    console.log("form-pagos.js Cargado");

    const enviarPagoBtn = $("#enviarPagoBtn");
    const limpiarFormBtn = $("#limpiarForm");
    const pagoForm = $("#pagoForm");
    const modalPago = $(".modal-pago");
    const modalConfirmarPago = $(".modal-confirmar-pago");
    const modalPagoFinalizado = $(".modal-finalizar-pago");

    //Verificacion interna 
    if(!pagoForm){
        console.warn("[initFormPagos] no se encontro el formulario de pago, se omitira la carga de este modulo")
        return null;
    }

    const { abrirModal, cerrarModal } = modales ?? initModales();
    const { notificacion, mostrarCargando, ocultarCargando } = notificaciones ?? initNotificaciones();
    const { resetearLabels } = inputs ?? initInputs();
    const { renderTablaTransacciones , actualizarSaldo} = saldo ?? initSaldo();

    //Limpiar formulario
    limpiarFormBtn?.addEventListener("click", (e) => {
        console.log("[DEBUG] Botón limpiar formulario presionado");
        const lastFocused = document.activeElement;
        pagoForm?.reset();

        console.log("[DEBUG] Formulario reseteado, abriendo modal de pago");
        abrirModal(modalPago);

        resetearLabels();
        console.log("[DEBUG] Labels reseteados");
    })

    const confirmarDatos = (dataForm) => {
        console.log("[DEBUG] Validando datos del formulario");

        let todoBien = true;
        let mensaje = "";

        const regex = {
            cedula: /^[0-9]{7,10}$/,
            telefono: /^\+?[0-9]{7,15}$/,
            monto: /^\d+(\.\d{1,2})?$/
        };

        for (let [key, value] of dataForm.entries()) {
            console.log(`[DEBUG] Campo ${key}: ${value}`);
            if (value === '') {
                mensaje = "Complete todos los campos";
                todoBien = false;
                break;
            }

            if (regex[key] && !regex[key].test(value)) {
                switch (key) {
                    case "cedula":
                        mensaje = "La cedula debe tener entre 7 y 10 digitos";
                        break;
                    case "telefono":
                        mensaje = "Numero de telefono invalido";
                        break;
                    case "monto":
                        mensaje = "Monto invalido";
                        break;
                }
                todoBien = false;
                break;
            }
        }

        if (!todoBien) {
            console.log(`[DEBUG] Validación fallida: ${mensaje}`);
            $("#pago-response").classList.add("response-error");
            $("#pago-response").textContent = mensaje;
        } else {
            console.log("[DEBUG] Validación exitosa");
            setTimeout(() => {
                $("#pago-response").classList.remove("response-error");
                $("#pago-response").textContent = "";
            }, 2000)
        }

        return todoBien;
    }

    const mostrarReferencia = (operacion) => {
        console.log("[DEBUG] Mostrando referencia del pago");
        const spans = $$(".pago-finalizado-span");
        for (let [key, value] of Object.entries(operacion)) {
            console.log(`[DEBUG] ${key}: ${value}`);
            spans.forEach(span => {
                if (span.dataset.span === key) {
                    if(span.dataset.span === "monto"){
                            span.textContent = new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(value) ?? "0";
                    }else{
                        span.textContent = value;
                    }
                }
            })
        }

        console.log("[DEBUG] Abriendo modal de pago finalizado");
        abrirModal(modalPagoFinalizado);
    }

    //Confirmar Datos
    enviarPagoBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("[DEBUG] Botón enviar pago presionado");
        const formData = new FormData(pagoForm);

        if (confirmarDatos(formData)) {
            console.log("[DEBUG] Datos validados, mostrando modal de confirmación");

            const spans = $$(".confirm-span");
            for (let [key, value] of formData.entries()) {
                spans.forEach(span => {
                    if (span.dataset.span === key) {
                        if(span.dataset.span === "monto"){
                            span.textContent = new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(value) ?? "0"
                        }else{
                            span.textContent = value;
                        }
                    }
                })
            }

            abrirModal(modalConfirmarPago);
        }
    })

    // Finalizar Pago 
    pagoForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("[DEBUG] Formulario enviado, iniciando proceso de pago");

        const formData = new FormData(pagoForm);

        try {
            console.log("[DEBUG] Mostrando modal de cargando");
            mostrarCargando();

            const res = await fetch("index.php?url=main/realizarPago", {
                method: "POST",
                body: formData,
            });

            console.log("[DEBUG] Respuesta del servidor recibida");
            const data = await res.json();
            console.log("[DEBUG] Datos JSON recibidos:", data);

            if (data.success) {
        
                cerrarModal(modalPago);
                cerrarModal(modalConfirmarPago);
                pagoForm?.reset();
                console.log("[DEBUG] Formularios y modales cerrados, mostrando referencia");
                mostrarReferencia(data.operacion);

                //Actualizar tabla en el DOM
                renderTablaTransacciones();
                //Actualizar el saldo
                actualizarSaldo();

            } else {
                console.error("[DEBUG] Error en el pago:", data.message);
                notificacion("error", data.message)
            }
        } catch (err) {
            console.error("[DEBUG] Excepción capturada:", err);
            notificacion("error", "Error en la conexión")
        } finally {
            console.log("[DEBUG] Ocultando modal de cargando");
            ocultarCargando();
        }
    })

    return { confirmarDatos };
}

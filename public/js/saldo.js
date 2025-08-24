import { $, $$ } from './utils.js';
import { initNotificaciones } from './notificaciones.js';

export function initSaldo({ notificaciones }) {
    // ===============================
    // ! SECCION: Saldo
    // ===============================

    console.log("Saldo.js Cargado");

    const saldo = $("#saldo");
    const ocultarSaldoButton = $(".ocultar-saldo-btn");
    const actualizarSaldoBtn = $("#actualizar-saldo-btn")

    const transaccionesTable = $("#transacciones-body")

    if (!saldo || !ocultarSaldoButton) {
        console.warn("No se encontraron elementos saldo o botón");
        return;
    }

    const { notificacion, mostrarCargando, ocultarCargando } = notificaciones ?? initNotificaciones();


    let oculto = false;
    let original = "";

    ocultarSaldoButton.addEventListener("click", () => {

        if (!oculto) {
            original = saldo.textContent ?? '';
        }

        oculto = !oculto;

        saldo.textContent = oculto ? '*'.repeat(4) : original;

        ocultarSaldoButton.classList.toggle("button-activo", oculto);
        ocultarSaldoButton.setAttribute('aria-pressed', String(oculto));
    });



    const actualizarSaldo = async () => {
        console.log("[DEBUG] Cargando Datos del usuario...")

        try {
            mostrarCargando();

            const res = await fetch("index.php?url=main/obtenerDatosUsuario");

            console.log("[DEBUG] Respuesta del servidor recibida");
            const data = await res.json();
            console.log("[DEBUG] Datos JSON recibidos:", data);

            if (data.success) {
                saldo.textContent = new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(data.data.saldo) ?? "0";
            } else {
                console.log("[DEBUG] Error al datos de el usuario. ");
            }
        } catch (err) {
            console.error("[DEBUG] Excepción capturada:", err);
        } finally {
            ocultarCargando();
        }

    }

    actualizarSaldoBtn.addEventListener("click", () => {
        if (actualizarSaldo()) {
            notificacion("success", "Saldo actualizado");
        }
    })

    const obtenerTransacciones = async () => {
        console.log("[DEBUG] Cargando Operaciones...")

        try {

            const res = await fetch("index.php?url=main/cargarOperaciones");

            console.log("[DEBUG] Respuesta del servidor recibida");
            const data = await res.json();
            console.log("[DEBUG] Datos JSON recibidos:", data);

            if (data.success) {

                let transacciones = data.data;

                if (!Array.isArray(transacciones)) {
                    transacciones = Object.values(transacciones)
                }

                console.log("[DEBUG] Retornando datos: ", data.data);
                return transacciones;
            } else {
                console.log("[DEBUG] Error al obtener las transacciones. ");
                return [];
            }

        } catch (err) {
            console.error("[DEBUG] Excepción capturada:", err);
        }
    }

    const renderTablaTransacciones = async () => {

        if (!transaccionesTable) {
            console.error("[DEBUG] transaccionesTable no encontrado en el DOM");
            return;
        }

        //Limpiamos la tabla antes de cargar
        transaccionesTable.innerHTML = "";

        const transacciones = await obtenerTransacciones();

        if (!transacciones || transacciones.length === 0) {
            transaccionesTable.innerHTML = `<tr><td colspan="4">No hay transacciones disponibles</td></tr>`;
            return;
        }

        // Ordenar por fecha y hora descendente (lo más nuevo primero)
        transacciones.sort((a, b) => {
            const fechaHoraA = new Date(a.fecha_pago + "T" + (a.hora_pago || "00:00:00"));
            const fechaHoraB = new Date(b.fecha_pago + "T" + (b.hora_pago || "00:00:00"));
            return fechaHoraB - fechaHoraA; // descendente
        });

        let fechaActual = null;
        const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        transacciones.forEach(tx => {
            if (tx.fecha_pago !== fechaActual) {
                fechaActual = tx.fecha_pago;

                const textoFecha = fechaActual === hoy ? "Hoy" : fechaActual;

                const filaFecha = document.createElement("tr");
                filaFecha.classList.add("grupo-fecha");
                filaFecha.innerHTML = `<td colspan="5"> ${textoFecha} </td>`
                transaccionesTable.appendChild(filaFecha)
            }

            const fila = document.createElement("tr");

            fila.innerHTML = `
    <td>${tx.cedula_destinatario ?? "-"}</td>
    <td>${tx.telefono_destinatario ?? "-"}</td>
    <td>${new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VES' }).format(tx.monto) ?? "0"} </td>
    <td>${tx.concepto ?? "-"}</td>
    <td>${tx.hora_pago ?? "-"}</td>
`;


            transaccionesTable.appendChild(fila);
        });

    }

    return { renderTablaTransacciones, actualizarSaldo };

}

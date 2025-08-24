// === archivo: /js/modales.js ===
import { $, $$ } from './utils.js';


export function initModales() {
    // ===============================
    // ! SECCION: MODALES
    // ===============================

    console.log("modales.js Cargado");

    const overlay = $(".overlay");
    let lastFocused = null;


    const hacerFoco = (modal) => {
        // foco al primer elemento focusable dentro del modal
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        focusable?.focus?.();
    }


    const abrirModal = (modal) => {


        lastFocused = document.activeElement;
        overlay.classList.add("abierto-overlay");
        overlay.setAttribute("aria-hidden", "false");


        modal?.classList.add("abierto-modal");
        modal?.setAttribute?.("aria-hidden", "false");


        hacerFoco(modal)
    };


    const cerrarModal = (modal) => {
        modal.classList.remove("abierto-modal");
        modal?.setAttribute?.("aria-hidden", "true");


        document.body.style.overflow = "";


        // restaurar foco
        lastFocused?.focus?.();
        lastFocused = null;


        const modalesAbiertos = Array.from(document.querySelectorAll(".modal"))
            .some(m => m.classList.contains("abierto-modal"));


        if (!modalesAbiertos) {
            overlay.classList.remove("abierto-overlay");
            overlay.setAttribute("aria-hidden", "true");
        }
    };


    // abrir modal desde botones
    document.querySelectorAll("[data-open-modal]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modalClass = btn.getAttribute("data-open-modal");
            const modal = document.querySelector(`.${modalClass}`);
            if (modal) abrirModal(modal);
        });
    });


    // cerrar modal desde botones internos
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) cerrarModal(modal);
        });
    });


    // Cerrar al click en overlay (fuera del modal)
    overlay?.addEventListener("click", (e) => {
        if (e.target === overlay) {
            const abierto = document.querySelector(".abierto-modal");
            if (abierto && !abierto.classList.contains("modal-pago")) {
                cerrarModal(abierto);
            }
        }
    });


    // cerrar con Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("abierto-overlay")) {
            const abierto = document.querySelector(".abierto-modal");
            if (abierto) cerrarModal(abierto);
        }
    });


    return { abrirModal, cerrarModal, hacerFoco };
}
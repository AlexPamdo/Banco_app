// === archivo: /js/modales.js ===
import { $, $$ } from './utils.js';

// === archivo: /js/offcanvas.js ===
export function initOffcanvas() {
    // ===============================
    // ! 📌 SECCIÓN: Selectores (offcanvas)
    // ===============================

    console.log("offcanvas.js Cargado");

    const offcanvaButtons = $$('.offcanva-button');
    const notificacionesOffcanva = $(".notificaciones");
    const menuOffcanva = $(".menu");
    
    
    // --- Offcanvas: map para manejar dinámicamente ---
    const offcanvasMap = {
    notificaciones: { el: notificacionesOffcanva, cls: "notificaciones-abierto" },
    menu: { el: menuOffcanva, cls: "menu-abierto" }
    };
    
    
    // Alternar offcanvas y cerrar el otro
    const alternarOffcanva = (e) => {
    const name = e.currentTarget?.dataset?.offcanva;
    if (!name || !offcanvasMap[name]) return;
    
    
    // cerrar todos primero (mejor UX: solo 1 abierto)
    Object.keys(offcanvasMap).forEach(k => {
    const node = offcanvasMap[k].el;
    const cls = offcanvasMap[k].cls;
    node?.classList.remove(cls);
    node?.setAttribute?.('aria-hidden', 'true');
    });
    
    
    // si estaba cerrado, abrirlo (toggle equivalente a abrir solo si estaba cerrado)
    const target = offcanvasMap[name].el;
    const targetCls = offcanvasMap[name].cls;
    if (!target?.classList.contains(targetCls)) {
    target?.classList.add(targetCls);
    target?.setAttribute?.('aria-hidden', 'false');
    }
    };
    
    
    // Cerrar todos los offcanvas
    const cerrarOffcanvas = () => {
    Object.keys(offcanvasMap).forEach(k => {
    const node = offcanvasMap[k].el;
    const cls = offcanvasMap[k].cls;
    node?.classList.remove(cls);
    node?.setAttribute?.('aria-hidden', 'true');
    });
    };
    
    
    // Delegación / listeners de botones (puedes usar event delegation si hay muchos botones y un contenedor padre)
    offcanvaButtons.forEach(button => button.addEventListener('click', alternarOffcanva));
    
    
    // Cerrar al hacer click fuera (si el click no es en un botón y no está dentro de ninguno)
    document.addEventListener("click", (e) => {
    const t = e.target;
    
    
    // 1) Si es un botón explícito de cerrar -> cerramos y salimos
    if (t.closest('.close-offcanva')) {
    cerrarOffcanvas();
    return;
    }
    
    
    // 2) Si el click fue en un botón que abre/alternar, no cerramos
    if (t.closest('.offcanva-button')) return;
    
    
    // 3) Si el click quedó dentro de algún offcanvas (ej: dentro del menú o notificaciones), no cerramos
    const clickDentroDeAlguno = Object.keys(offcanvasMap).some(k => {
    const node = offcanvasMap[k].el;
    return node && node.contains(t);
    });
    if (clickDentroDeAlguno) return;
    
    
    // 4) Si llegó hasta aquí, fue un click fuera -> cerrar
    cerrarOffcanvas();
    });
    
    
    return { alternarOffcanva, cerrarOffcanvas };
    }
// === archivo: /js/modales.js ===
import { $, $$ } from './utils.js';
import { initModales } from './modales.js';

export function initNotificaciones() {
    // ===============================
    // ! SECCION: NOTIFICACIONES
    // ===============================

    console.log("notificaciones.js cargado");

  // element nodes (si no existen, la función seguirá funcionando sin tirar errores)
  const modalNotificacion = $('.modal-notificacion');
  const notificacionesText = $('#notificacion-text');
  const notificacionesIcon = $('#notificacion-icon');

  // modal de 'cargando' (puede ser el mismo u otro)
  const modalCargando = $('.modal-cargando');

  // overlay (puede no existir, lo manejamos con optional chaining)
  const overlay = $('.overlay-notificacion');

  const abrirModalLocal = (modal) => {
    if (!modal) return;
    overlay?.classList.add('abierto-overlay');
    overlay?.setAttribute('aria-hidden', 'false');

    modal.classList.add('abierto-modal');
    modal.setAttribute('aria-hidden', 'false');
  };

  const cerrarModalLocal = (modal) => {
    if (!modal) return;
    modal.classList.remove('abierto-modal');
    modal.setAttribute('aria-hidden', 'true');

    const anyOpen = Array.from(document.querySelectorAll('.modal-notificacion'))
      .some(m => m.classList.contains('abierto-modal'));
    if (!anyOpen) {

      overlay?.classList.remove('abierto-overlay');
      overlay?.setAttribute('aria-hidden', 'true');
      
    }
  };

  function alerta(type = '', message = '') {

  }

  function notificacion(type = 'info', message = '') {
    // Diccionario de iconos
    const icons = {
      success: `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="green" viewBox="0 0 24 24">
          <path d="M20.285 6.709l-11.285 11.291-5.285-5.291 1.414-1.414 3.871 3.877 9.871-9.877z"/>
        </svg>
      `,
      error: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5 16.59l-1.41 1.41-3.59-3.59-3.59 3.59-1.41-1.41 3.59-3.59-3.59-3.59 1.41-1.41 3.59 3.59 3.59-3.59 1.41 1.41-3.59 3.59 3.59 3.59z"/>
        </svg>
      `,
      info: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="gray" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-.828 0-1.5-.671-1.5-1.5s.672-1.5 1.5-1.5 1.5.671 1.5 1.5-.672 1.5-1.5 1.5zm1.071-5.071v.571h-2.143v-1c0-1.104.896-2 2-2 .552 0 1-.448 1-1 0-.552-.448-1-1-1-.826 0-1.5-.674-1.5-1.5s.674-1.5 1.5-1.5c1.657 0 3 1.343 3 3 0 1.306-.835 2.417-2 2.829z"/>
        </svg>
      `
    };
  
    // Si no existen los nodos, salimos
    if (notificacionesIcon) {
      notificacionesIcon.innerHTML = icons[type] || icons.info;
    }
  
    if (notificacionesText) {
      notificacionesText.textContent = message;
    }
  
    abrirModalLocal(modalNotificacion);
  
    // auto cerrar pasados 1s sólo si existe modalNotificacion
    if (modalNotificacion) {
      setTimeout(() => cerrarModalLocal(modalNotificacion), 1000);
    }
  }
  

  function mostrarCargando() {
    abrirModalLocal(modalCargando);
  }

  function ocultarCargando() {
    cerrarModalLocal(modalCargando);
    // no forzamos cerrar modalNotificacion aquí; quien lo necesite puede llamarlo
  }

  return { notificacion, mostrarCargando, ocultarCargando };
}
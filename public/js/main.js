import { initOffcanvas } from './offcanvas.js';
import { initModales } from './modales.js';
import { initInputs } from './inputs.js';
import { initFormPagos } from './form-pagos.js';
import { initLoginCarousel } from './login-carousel.js';
import { initNotificaciones } from './notificaciones.js';
import { initSaldo } from './saldo.js';

document.addEventListener("DOMContentLoaded", () => {
  console.log("Script Cargado Correctamente");



  initOffcanvas();


  const modales = initModales();
  const inputs = initInputs();
  const notificaciones = initNotificaciones();

  const saldo = initSaldo({ modales });
  saldo?.actualizarSaldo?.()
  saldo?.renderTablaTransacciones?.();

  // Pasamos las dependencias a form-pagos para que NO vuelva a inicializarlas
  const formPagos = initFormPagos({ modales, inputs, notificaciones, saldo });



  const login = initLoginCarousel();



});

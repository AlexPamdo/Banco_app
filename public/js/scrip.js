document.addEventListener("DOMContentLoaded", () => {

    console.log("Scrip Cargado Correctamente")

    // ===============================
    // ! 📌 SECCIÓN: Selectores
    // ===============================
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));
    const body = document.body;

    // --- offcanvas ---
    const offcanvaButtons = $$('.offcanva-button');
    const notificacionesOffcanva = $(".notificaciones");
    const menuOffcanva = $(".menu");

    // --- saldo ---
    const saldo = $("#saldo");
    const ocultarSaldoButton = $(".ocultar-saldo-btn");

    // --- inputs ---
    const inputContainers = $$(".input-container");

    // --- Formulario ---
    const enviarPagoBtn = $("#enviarPagoBtn")
    const limpiarFormBtn = $("#limpiarForm");
    const pagoForm = $("#pagoForm");

    // --- Modal ---
    const abrirModalPago = $("#realizar-pago");
    const modalPago = $(".modal-pago");
    const overlay = $(".overlay");
    const cerrarModalBtn = $("#cerrarModalbtn");

    // --- Notificaciones ---
    const notificaciones = $(".modal-notificacion");
    const notificacionesText = $("#notificacion-text");

    // --- Login ---
    const imgLogin1 = $(".img-login-1");
    const imgLogin2 = $(".img-login-2");

    const switchBtn = $("#swich-login");
    const loginTitle = $("#login-title")

    const loginForm = $("#form-login")
    const registerForm = $("#form-register")

    const loginResponseBox = $("#login-response-box");


    // ===============================
    // ! SECCION: FUNCIONES 
    // ===============================

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

    // TODO --- SALDO ---
    if (saldo && ocultarSaldoButton) {
        // guardar original de manera segura
        if (!saldo.dataset.original) saldo.dataset.original = String(saldo.textContent ?? '').trim();

        let oculto = false;
        ocultarSaldoButton.addEventListener("click", () => {
            oculto = !oculto;
            saldo.textContent = oculto ? '*'.repeat(4) : saldo.dataset.original;
            // toggle con segundo argumento asegura estado idempotente
            ocultarSaldoButton.classList.toggle("button-activo", oculto);
            ocultarSaldoButton.setAttribute('aria-pressed', String(oculto));
        });
    } else {
        // opcional: loguear para depurar en dev
        // console.warn('Saldo o botón de ocultar saldo no encontrados');
    }

    // TODO --- MODALES ---
    // controlar foco para restaurarlo al abrir/cerrar
    let lastFocused = null;

    const hacerFoco = (modal) => {
        // foco al primer elemento focusable dentro del modal
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        focusable?.focus?.();
    }

    const abrirModal = (modal) => {
        console.log("abrirModal llamado con modal:", modal);

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

        body.style.overflow = "";

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
        console.log("Registrando listener en botón:", btn);
        btn.addEventListener("click", () => {
            const modalClass = btn.getAttribute("data-open-modal");
            console.log("Botón clickeado, modalClass:", modalClass);
            const modal = document.querySelector(`.${modalClass}`);
            console.log("Modal encontrado:", modal);
            if (modal) abrirModal(modal);
        });
    });

    // cerrar modal desde botones internos
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            console.log("Cerrando modal desde botón:", modal);
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

    // TODO --- Notificaciones ---

    const notificacion = (tipe, message) => {

        //Cambiamos el mensaje de notificacio
        notificacionesText.textContent = message;

        //abrimos el modal de notificaciones
        abrirModal(notificaciones);

        setTimeout(() => {
            cerrarModal(notificaciones);
        }, 2000)
    }


    // TODO --- INPUTS (labels que se mantienen arriba) ---
    inputContainers.forEach(container => {
        // permitir input o textarea
        const input = container.querySelector('input, textarea');
        if (!input) return;

        const refresh = () => container.classList.toggle('filled', input.value.trim() !== '');
        refresh();

        input.addEventListener('input', refresh);
        input.addEventListener('blur', refresh);
    });

    const resetearLabels = () => {
        inputContainers.forEach(container => {
            const input = container.querySelector('input, textarea');
            if (!input) return;

            container.classList.toggle('filled', input.value.trim() !== '')
        })
    }

    // --- FORMULARIO ---
    limpiarFormBtn?.addEventListener("click", (e) => {
        lastFocused = document.activeElement;
        pagoForm?.reset();

        hacerFoco(modalPago);
        resetearLabels()
    })

    

    // TODO --- TRANSFERENCIA ---

    pagoForm?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(pagoForm);

        try {
            const res = await fetch("index.php?url=main/realizarPago", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                //Actualizamos la cantidad de saldo en la pagina
                saldo.textContent = data.saldo_restante;

                //cerramos el modal de pago
                cerrarModal(modalPago);

                notificacion("success", data.message);

                //Limpiar el formulario
                pagoForm?.reset()

            } else {

                notificacion("error", data.message);

            }
        } catch (err) {
            notificacion("error", data.message);
        }
    })



    // TODO --- LOGIN ---

    //Cambiar Imagenes del login
    const Imagenes = ["img/img1.jpg", "img/img2.jpg", "img/img3.jpg"]
    let index = 0;
    let showingImg1 = true;

    imgLogin1.src = Imagenes[0];
    imgLogin2.src = Imagenes[1];

    const cambiarImg = () => {
        const nexIndex = (index + 1) % Imagenes.length;

        if (showingImg1) {
            imgLogin2.src = Imagenes[nexIndex];
            imgLogin2.classList.remove("hidden")
            imgLogin1.classList.add("hidden")
        } else {
            imgLogin1.src = Imagenes[nexIndex];
            imgLogin1.classList.remove("hidden")
            imgLogin2.classList.add("hidden")
        }

        showingImg1 = !showingImg1;
        index = nexIndex;
    }

    setInterval(cambiarImg, 3000)

    //Intercambiar Login/register
    switchBtn.addEventListener('click', function (e) {
        const currentlyRegister = e.currentTarget.dataset.mode === 'register';
        const newIsRegister = !currentlyRegister;

        // Cambiar texto inmediatamente
        loginTitle.textContent = newIsRegister ? 'Crear Cuenta' : 'Iniciar Sesion';

        // Toggle de formularios
        loginForm.classList.toggle('form-active', !newIsRegister);
        registerForm.classList.toggle('form-active', newIsRegister);

        // Actualizar dataset
        e.currentTarget.dataset.mode = newIsRegister ? 'register' : 'login';
    });

    // Login
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // 🔴 esto evita la recarga

        const formData = new FormData(loginForm);

        try {
            const res = await fetch("index.php?url=login/doLogin", {
                method: "POST",
                body: formData,
            })

            const data = await res.json();

            if (data.success) {
                loginResponseBox.classList.remove("response-error");
                loginResponseBox.textContent = data.message;
                loginResponseBox.classList.add("response-success");

                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 1000)

            } else {
                loginResponseBox.textContent = data.message;
                loginResponseBox.classList.add("response-error");
            }

        } catch (err) {
            loginResponseBox.textContent = "Error en la conexión";
            loginResponseBox.classList.add("response-error");
        }
    })


    // ===============================
    // ! FIN
    // ===============================
});


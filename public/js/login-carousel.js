import { $ } from './utils.js';

export function initLoginCarousel() {
    // ===============================
    // ! TODO --- LOGIN (IMAGENES y SWITCH)
    // ===============================

    console.log("login.js cargado Correctamente")


    const imgLogin1 = $(".img-login-1");
    const imgLogin2 = $(".img-login-2");

    const switchBtn = $("#swich-login");
    const loginTitle = $("#login-title")

    const loginForm = $("#form-login")
    const registerForm = $("#form-register")

    const loginResponseBox = $("#login-response-box");

    //Cambiar Imagenes del login
    const Imagenes = ["img/img1.jpg", "img/img2.jpg", "img/img3.jpg"]
    let index = 0;
    let showingImg1 = true;

    if (!imgLogin1 || !imgLogin2) {
        console.warn("No se encontraron elementos de el login");
        return;
    }

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

    return {};
}




    <main id="main-login">

        <section id="login-container">
            <div id="img-login-container">
                <img class="img-login-1" src="" alt="">
                <img class="img-login-2" src="" alt="">
            </div>
            <div id="form-login-container">
                <div id="login-container-info">
                    <h1>BANCALEX</h1>
                    <h2 id="login-title">Iniciar Sesion</h2>
                </div>
                <form id="form-login" class="form form-active" method="post" >
                    <span id="login-response-box" class="response-box">sss</span>

                    <div class="input-container">
                        <label for="cedula" class="input-label">Documento</label>
                        <input type="text" id="cedula" name="cedula" inputmode="numeric" maxlength="12"
                            pattern="^\d{6,12}$" required>
                    </div>

                    <div class="input-container">
                        <label for="contrasena" class="input-label">Contraseña</label>
                        <input type="password" id="contrasena" name="contrasena" required>
                    </div>

                    <button id="login-btn" class="form-button main" type="submit">Ingresar</button>

                </form>
                
                <form id="form-register" class="form" action="">
                    <div class="input-container">
                        <label for="cedula" class="input-label">Documento</label>
                        <input type="text" id="cedula_register" name="cedula" inputmode="numeric" maxlength="12"
                            pattern="^\d{6,12}$" required>
                    </div>

                    <div class="input-container">
                        <label for="contraseña" class="input-label">Contraseña</label>
                        <input type="password" id="contraseña_register" name="contraseña" required>
                    </div>

                    <div class="input-container ">
                        <label for="confirmar-contraseña" class="input-label">Confirmar contraseña</label>
                        <input type="password" id="confirmar_Contraseña_register" name="confirmar-contraseña" required>
                    </div>

                    <div class="input-container ">
                        <label for="nombre" class="input-label">Nombre Completo</label>
                        <input type="text" id="nombre_register" name="nombre" required>
                    </div>

                    <button id="register-btn" class="form-button " type="submit">Crear Cuenta</button>
                </form>
                <p>¿No tienes una cuenta activa? <a id="swich-login" data-mode="register" href="#">¡Crea una aqui!</a></p>
            </div>
        </section>

    </main>

<?php

require_once __DIR__ . '/../models/Login.php';

class LoginController
{

    public function render()
    {
        $view = __DIR__ . '/../views/login/login.php';
        require __DIR__ . '/../views/layout/main.php';
    }

    public function doLogin()
    {

        header('Content-Type: application/json');

        $cedula = trim((string) filter_input(INPUT_POST, 'cedula') ?? '');
        $contrasena = (string) (filter_input(INPUT_POST, 'contrasena') ?? '');

        if (empty($cedula) || empty($contrasena)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Datos incompletos"
            ]);
            exit;
        }

        // Validación simple de formato (si tu cédula es sólo dígitos)
        if (!ctype_digit($cedula)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Formato de cédula inválido."
            ]);
            exit;
        }

        $loginModel = new Login();
        $usuario = $loginModel->verificarUsuario($cedula, $contrasena);

        if ($usuario === false) {
            // Error interno (BD)
            http_response_code(500);
            // Log interno ya que el modelo debería haber hecho error_log()
            echo json_encode([
                "success" => false,
                "message" => "Error interno del servidor."
            ]);
            exit;
        }

        if ($usuario === null) {
            // Credenciales inválidas
            http_response_code(401);
            // Aquí podrías registrar el intento fallido para bloqueo/rate-limit
            echo json_encode([
                "success" => false,
                "message" => "Usuario o contraseña incorrectos."
            ]);
            exit;
        }

        session_regenerate_id(true);
        $_SESSION["loggeado"] = true;
        $_SESSION["user_info"] = $usuario;

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Login exitoso",
            "redirect" => "index.php?url=main/render"
        ]);
        exit;

    }


    public function logout()
    {

        // Unset all session variables
        $_SESSION = [];

        session_unset();
        session_destroy();
        header("Location: index.php?url=login/render");
        exit;
    }
}
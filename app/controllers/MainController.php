<?php

require_once __DIR__ . '/../models/Pagos.php';
require_once __DIR__ . '/../models/Usuarios.php';
require_once __DIR__ . '/../services/pagoServices.php';

class MainController
{
    public function render()
    {
        if (!empty($_SESSION["loggeado"])) {
            $view = __DIR__ . '/../views/main/main.php';
            require __DIR__ . '/../views/layout/main.php';
        } else {
            require __DIR__ . '/../views/layout/sessionError.php';
        }
    }

    public function cargarOperaciones()
    {
        $pagosModel = new Pagos();
        $pagos = $pagosModel->verOperaciones($_SESSION['user_info']['id_usuario']);

        if (!$pagos) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Informacion de usuario erronea"
            ]);
        }

        echo json_encode([
            "success" => true,
            "data" => $pagos
        ]);
        exit();
    }

    public function obtenerDatosUsuario()
    {
        $usuariosModel = new Usuarios();
        $usuarioData = $usuariosModel->verificarUsuario($_SESSION['user_info']['cedula_usuario'], $_SESSION['user_info']['telefono_usuario']);

        if (!$usuarioData) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Datos incompletos"
            ]);
            exit();
        }

        echo json_encode([
            "success" => true,
            "data" => $usuarioData
        ]);
        exit();

    }

    public function realizarPago()
    {
        error_log("POST cedula=" . ($_POST['cedula'] ?? 'null') . " telefono=" . ($_POST['telefono'] ?? 'null') . " monto=" . ($_POST['monto'] ?? 'null'));

        $cedula = trim((string) filter_input(INPUT_POST, 'cedula') ?? '');
        $telefono = trim((string) filter_input(INPUT_POST, 'telefono') ?? '');
        $monto = filter_input(INPUT_POST, 'monto') ?? '';
        $concepto = trim((string) filter_input(INPUT_POST, 'concepto') ?? '');


        if (empty($cedula) || empty($telefono) || empty($monto)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Datos incompletos"
            ]);
            exit;
        }

        $pagosModel = new Pagos();
        $usuariosModel = new Usuarios();
        $pagoService = new PagoServices($pagosModel, $usuariosModel);

        $resultado = $pagoService->transferir($_SESSION['user_info']['id_usuario'], $cedula, $telefono, $monto, $concepto);

        if (!$resultado) {
            http_response_code(400);
        }

        echo json_encode($resultado);
        exit();

    }



    public function buscarOperacion()
    {

    }

}
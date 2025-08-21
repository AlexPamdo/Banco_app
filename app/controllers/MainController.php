<?php

require_once __DIR__ . '/../models/main.php';
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

    public function realizarPago()
    {
        error_log("POST cedula=" . ($_POST['cedula'] ?? 'null') . " telefono=" . ($_POST['telefono'] ?? 'null') . " monto=" . ($_POST['monto'] ?? 'null'));

        $cedula = trim((string) filter_input(INPUT_POST, 'cedula') ?? '');
        $telefono = trim((string) filter_input(INPUT_POST, 'telefono') ?? '');
        $monto = filter_input(INPUT_POST, 'monto') ?? '';


        if (empty($cedula) || empty($telefono) || empty($monto)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Datos incompletos"
            ]);
            exit;
        }

        $mainModel = new Main();
        $pagoService = new PagoServices($mainModel);

        $resultado = $pagoService->transferir($_SESSION['user_info']['id_usuario'], $cedula, $telefono, $monto);

        if(!$resultado){
            http_response_code(400);
        }

        echo json_encode($resultado);
        exit();
    
    }
}
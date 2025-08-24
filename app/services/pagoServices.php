<?php


class PagoServices
{
    private $mainModel;
    private $usuariosModel;
    private $pagosModel;

    public function __construct($pagosModel, $usuariosModel)
    {
        $this->pagosModel = $pagosModel;
        $this->usuariosModel = $usuariosModel;
        $this->mainModel = new Main;
    }

    public function transferir(int $idRemitente, string $cedulaDestinatario, string $telefonoDestinatario, float $monto, string $concepto): array
    {

        try {
            $this->mainModel->beginTransaction();

            //buscamos el remitente
            $remitente = $this->usuariosModel->buscarUsuarioId($idRemitente);

            if (!$remitente) {
                $this->mainModel->rollBack();
                return ["success" => false, "message" => "Remitente no válido"];
            }

            //Buscamos el destinatario
            $destinatario = $this->usuariosModel->verificarUsuario($cedulaDestinatario, $telefonoDestinatario);
            if ($destinatario === null) {
                $this->mainModel->rollBack();
                return ["success" => false, "message" => "Destinatario no encontrado"];
            }
            if ($destinatario === false) {
                $this->mainModel->rollBack();
                return ["success" => false, "message" => "Error al buscar el destinatario"];
            }

            //validamos el saldo
            if ($remitente['saldo'] < $monto) {
                $this->mainModel->rollBack();
                return ["success" => false, "message" => "No tenei plata mano"];
            }

            //actualizamos los saldos
            if (!$this->usuariosModel->actualizarSaldo($remitente['id_usuario'], $remitente['saldo'] - $monto) || !$this->usuariosModel->actualizarSaldo($destinatario['id_usuario'], $destinatario['saldo'] + $monto)) {
                $this->mainModel->rollBack();
                return ["success" => false, "message" => "Error al actualizar el saldo"];
            }


            // 5. Registrar operación
            $operacion = $this->pagosModel->registrarPago(
                $idRemitente, 
                $cedulaDestinatario,  
                $telefonoDestinatario,
                $monto,
                $concepto,
                date("Y-m-d"),
                date('H:i:s')
            );

            if(!$operacion){
                $this->mainModel->rollBack();
                return ["success" => false, "message" => "Error al registrar la operacion"];
            }

            //Completamos la tansaccion
            $this->mainModel->commit();

            return [
                "success" => true,
                "message" => "Transferencia realizada con éxito",
                "saldo_restante" => $remitente["saldo"] - $monto,
                "operacion" => $operacion,
            ];

        } catch (Exception $e) {
            $this->mainModel->rollBack();
            return ["success" => false, "message" => "Error interno"];
        }

    }

}
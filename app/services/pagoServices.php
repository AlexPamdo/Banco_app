<?php

class PagoServices
{
    private $mainModel;

    public function __construct($mainModel)
    {
        $this->mainModel = $mainModel;
    }

    public function transferir(int $idRemitente, string $cedulaDestinatario, string $telefonoDestinatario, float $monto): array
    {

        try {
            $this->mainModel->beginTransaction();

            //buscamos el remitente
            $remitente = $this->mainModel->buscarUsuarioId($idRemitente);

            if (!$remitente) {
                $this->mainModel->rollBack();
                return ["success" => false, "message" => "Remitente no válido"];
            }

            //Buscamos el destinatario
            $destinatario = $this->mainModel->verificarUsuario($cedulaDestinatario, $telefonoDestinatario);
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
            if (!$this->mainModel->actualizarSaldo($remitente['id_usuario'], $remitente['saldo'] - $monto) || !$this->mainModel->actualizarSaldo($destinatario['id_usuario'], $destinatario['saldo'] + $monto)) {
                $this->mainModel->rollBack();
                return ["success" => false, "message" => "Error al actualizar el saldo"];
            }


            //! ESTA FUNCION HAY QUE HACERLA
            //! 5. Registrar operación
            //! $this->mainModel->registrarTransferencia($remitente["id_usuario"], $destinatario["id_usuario"], $monto);

            //Completamos la tansaccion
            $this->mainModel->commit();

            return [
                "success" => true,
                "message" => "Transferencia realizada con éxito",
                "saldo_restante" => $remitente["saldo"] - $monto
            ];

        } catch (Exception $e) {
            $this->mainModel->rollBack();
            return ["success" => false, "message" => "Error interno"];
        }

    }

}
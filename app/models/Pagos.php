<?php

require_once __DIR__ . "/../models/Main.php";


class Pagos extends Main {
    private $table = "pagos";

    public function registrarPago($id_usuario, $cedula_destinatario, $telefono_destinatario, $monto, $concepto, $fecha, $hora)
    {

        

        // Validaciones básicas
        if (
            !is_numeric($id_usuario) ||
            empty($cedula_destinatario) ||
            empty($telefono_destinatario) ||
            !is_numeric($monto) || $monto <= 0 ||
            empty($concepto) ||
            empty($fecha) ||
            empty($hora)
        ) {
            return false;
        }

        $sql = "INSERT INTO pagos 
                (id_usuario, cedula_destinatario, telefono_destinatario, monto, concepto, fecha_pago, hora_pago) 
                VALUES 
                (:id_usuario, :cedula_destinatario, :telefono_destinatario, :monto, :concepto, :fecha, :hora)";

        try {
            $stmt = $this->conn->prepare($sql);
            $success = $stmt->execute([
                ':id_usuario' => $id_usuario,
                ':cedula_destinatario' => $cedula_destinatario,
                ':telefono_destinatario' => $telefono_destinatario,
                ':monto' => $monto,
                ':concepto' => $concepto,
                ':fecha' => $fecha,
                ':hora' => $hora,
            ]);

            if ($success) {
                $id_pago = $this->conn->lastInsertId();

                return [
                    "success" => true,
                    "monto" => $monto,
                    "fecha_pago" => $fecha,
                    "id_pago" => $id_pago,
                    "cedula_destinatario" => $cedula_destinatario,
                    "concepto" => $concepto,
                    "telefono_destinatario" => $telefono_destinatario,
                ];
            }

            return ["success" => false];

        } catch (PDOException $e) {
            // Opcional: loguear $e->getMessage() para depuración
            return false;
        }
    }

    public function verOperaciones($id_usuario){
        
        $sql = "SELECT * FROM {$this->table} WHERE id_usuario = :id ORDER BY id_pago DESC";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([':id' => $id_usuario]);

            $operaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (!$operaciones)
                return null;

            return $operaciones;

        } catch (PDOException $e) {
            error_log("verificarOperaciones DB error: " . $e->getMessage());
            return false; // indica error en la BD
        }
    }

     function verificarOperacion($id_operacion)
    {
        if (!is_int($id_operacion)) {
            return null;
        }

        $sql = "SELECT * FROM {$this->table}
        WHERE id_pago = :id";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([':id' => $id_operacion]);

            $operacion = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$operacion)
                return null;

            return $operacion;

        } catch (PDOException $e) {
            error_log("verificarOperacion DB error: " . $e->getMessage());
            return false; // indica error en la BD
        }

    }
}
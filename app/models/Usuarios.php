<?php

require_once __DIR__ . "/../models/Main.php";

class Usuarios extends Main
{

    private $table = "usuarios";


    public function buscarUsuarioId($id)
    {
        if (empty($id)) {
            return null;
        }

        $sql = "SELECT * FROM $this->table WHERE id_usuario = :id";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([':id' => $id]);

            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$user)
                return null;

            return $user;

        } catch (PDOException $e) {
            error_log("buscarUsuarioId DB error: " . $e->getMessage());
            return false; // indica error en la BD
        }
    }



    public function verificarUsuario($cedula, $telefono)
    {
        if (empty($cedula) || empty($telefono)) {
            return null;
        }

        $sql = "SELECT * FROM usuarios
        WHERE cedula_usuario = :cedula 
        AND telefono_usuario = :telefono";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([':cedula' => $cedula, ':telefono' => $telefono]);

            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            error_log("Resultado: " . print_r($user, true));
            if (!$user)
                return null;

            return $user;

        } catch (PDOException $e) {
            error_log("verificarUsuario DB error: " . $e->getMessage());
            return false; // indica error en la BD
        }
    }

    public function verificarUsuarioLogin($cedula, $contrasena)
    {
        if (empty($cedula) || empty($contrasena)) {
            return null;
        }
    
        try {
            // Traer el usuario por cédula
            $stmt = $this->conn->prepare("SELECT * FROM usuarios WHERE cedula_usuario = :cedula");
            $stmt->execute([':cedula' => $cedula]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
            error_log("Resultado DB: " . print_r($user, true));
    
            if (!$user) {
                return null; // usuario no existe
            }
    
        /*     // Verificar contraseña hasheada
            if (!password_verify($contrasena, $user['contrasena_usuario'])) {
                return null; // contraseña incorrecta
            } */
    
            return $user;
    
        } catch (PDOException $e) {
            error_log("verificarUsuarioLogin DB error: " . $e->getMessage());
            return false; // error en BD
        }
    }
    



    public function actualizarSaldo($id, $monto)
    {
        if (!is_numeric($id) || !is_numeric($monto))
            return false;

        $sql = "UPDATE $this->table SET saldo = :monto WHERE id_usuario = :id";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([':monto' => $monto, ':id' => (int) $id]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }


}
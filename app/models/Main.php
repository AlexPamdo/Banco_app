<?php

require_once __DIR__ . "/../../config/database.php";

class Main
{

    private $conn;

    function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();

    }


    public function beginTransaction()
    {
        $this->conn->beginTransaction();
    }

    public function commit()
    {
        $this->conn->commit();
    }

    public function rollBack()
    {
        $this->conn->rollBack();
    }

    public function verTodo()
    {
        $stmt = $this->conn->prepare(("SELECT + FROM usuarios"));
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function buscarUsuarioId($id)
    {
        if (empty($id)) {
            return null;
        }

        $sql = "SELECT * FROM usuarios WHERE id_usuario = :id";

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

    public function actualizarSaldo($id, $monto)
    {
        if (!is_numeric($id) || !is_numeric($monto))
            return false;

        $sql = "UPDATE usuarios SET saldo = :monto WHERE id_usuario = :id";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([':monto' => $monto, ':id' => (int) $id]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }


}
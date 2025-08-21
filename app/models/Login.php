<?php

require_once __DIR__ . "/../../config/database.php";

class Login
{
    private $conn;

    function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function verificarUsuario($cedula, $contrasena)
    {

        if (empty($cedula) || empty($contrasena) || !ctype_digit((string) $cedula)) {
            return null;
        }

        $sql = "SELECT * FROM usuarios WHERE cedula_usuario = :cedula AND contrasena_usuario = :contrasena LIMIT 1";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([':cedula' => $cedula, ':contrasena' => $contrasena]);

            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$user)
                return null;
/* 
            if (!password_verify($contrasena, $user['contrasena_usuario'])) {
                return null;
            }
 */
            unset($user['contrasena_usuario']);
            return $user;
        } catch (PDOException $e) {
            error_log("verificarUsuario DB error: " . $e->getMessage());
            return false; // indica error en la BD
        }
    }

}
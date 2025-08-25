<?php

class Database {
    private $host = 'aws-1-sa-east-1.pooler.supabase.com';
    private $dbname = 'postgres';
    private $user = 'postgres.rhwjjuvucewgwhretpbx ';
    private $password = '123456789Dd*';
    private $port = 6543;

    public $conn;

    public function getConnection() {
        if($this->conn === null){
            try{
               $this->conn = new PDO(
    "pgsql:host={$this->host};port={$this->port};dbname={$this->dbname}",
    $this->user,
    $this->password
);

                );
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }catch(PDOException $e){
                die("Error de conexion: " . $e->getMessage());
            }
        }
        return $this->conn;
    }

}

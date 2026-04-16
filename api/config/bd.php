<?php
//Muestra errores(solo para desarrollo)
ini_set('display_errors', 1);
error_reporting(E_ALL);

$servidor = "localhost";
$usuario = "root";
$password = "";
$bd = "turistea";


$conexion = new mysqli($servidor, $usuario, $password, $bd);

//verifica conexión
if ($conexion->connect_error) {
    die("Error al conectar: " . $conexion->connect_error);
}

//configura charset (caracteres especiales)
$conexion->set_charset("utf8mb4");

?>
<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once("../config/bd.php");

if (isset($_GET['id'])) {

    $id = (int) $_GET['id'];
    $resultado = $conexion->query("SELECT * FROM paquete WHERE id = $id");
    $paquete = $resultado->fetch_assoc();
    echo json_encode($paquete);

} else {

    $resultado = $conexion->query("SELECT * FROM paquete");
    echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));
}

?>
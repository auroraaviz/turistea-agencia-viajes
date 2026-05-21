<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once("../config/bd.php");


// consulta de todos los datos y además calcula el número de noches con respecto a la fecha
// de salida y regreso, no se guarda en la bd.
if (isset($_GET['id'])) {

    $id = (int) $_GET['id'];

    $resultado = $conexion->query("
        SELECT *,
        DATEDIFF(fecha_regreso, fecha_salida) AS noches
        FROM paquete
        WHERE id = $id
    ");

    $paquete = $resultado->fetch_assoc();

    echo json_encode($paquete);

} else {

    $resultado = $conexion->query("
        SELECT *,
        DATEDIFF(fecha_regreso, fecha_salida) AS noches
        FROM paquete
        WHERE fecha_regreso >= CURDATE()
        AND activo = 1
    ");

    echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));
}
?>
<?php
/*
=========================================
API CONSULTA PAQUETES
-----------------------------------------
Responsabilidad:
- Si recibe id => devuelve 1 paquete
- Si no recibe id => devuelve listado
- Añade cálculo de noches

Salida JSON para frontend.
=========================================
*/


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once("../config/bd.php");

$resultado = $conexion->query("
    SELECT DISTINCT destino
    FROM paquete
    WHERE destino IS NOT NULL
    AND destino <> ''
    ORDER BY destino ASC
");

$destinos = $resultado->fetch_all(MYSQLI_ASSOC);

echo json_encode($destinos);
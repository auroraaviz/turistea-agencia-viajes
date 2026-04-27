<?php

/*
=========================================
API UPDATE PAQUETES
-----------------------------------------
Responsabilidad:
- Recibir datos JSON desde frontend
- Validar id del paquete
- Actualizar registro en base de datos
- Devolver respuesta JSON

Ruta:
/api/paquetes/update.php
=========================================
*/


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once("../config/bd.php");


// =========================================
// PETICIÓN OPTIONS (CORS)
// =========================================
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}


// =========================================
// LEER JSON ENVIADO DESDE FETCH
// =========================================
$data = json_decode(
    file_get_contents("php://input"),
    true
);


// =========================================
// VALIDAR ID
// =========================================
if (!$data || !isset($data["id"])) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Falta el id del paquete"
    ]);

    exit;
}


// =========================================
// VARIABLES
// =========================================
$id = (int) $data["id"];

$titulo = $data["titulo"] ?? "";
$destino = $data["destino"] ?? "";
$descripcion = $data["descripcion"] ?? "";
$imagen = $data["imagen"] ?? "";

$hotel_nombre = $data["hotel_nombre"] ?? "";
$hotel_estrellas = (int) ($data["hotel_estrellas"] ?? 0);
$hotel_regimen = $data["hotel_regimen"] ?? "";
$hotel_detalles = $data["hotel_detalles"] ?? "";
$hotel_imagen = $data["hotel_imagen"] ?? "";

$fecha_salida = $data["fecha_salida"] ?? null;
$fecha_regreso = $data["fecha_regreso"] ?? null;

$precio = (float) ($data["precio"] ?? 0);
$descuento = (float) ($data["descuento"] ?? 0);

$plazas_totales = (int) ($data["plazas_totales"] ?? 0);
$plazas_disponibles = (int) ($data["plazas_disponibles"] ?? 0);

$activo = (int) ($data["activo"] ?? 0);
$vuelo_incluido = (int) ($data["vuelo_incluido"] ?? 0);

$salida_desde = $data["salida_desde"] ?? "";

$cerca_playa = (int) ($data["cerca_playa"] ?? 0);

$categoria = $data["categoria"] ?? "vacaciones";

$validas = [
    "vuelo",
    "vacaciones",
    "fin_de_semana",
    "verano"
];

if (!in_array($categoria, $validas)) {
    $categoria = "vacaciones";
}


// =========================================
// PREPARE UPDATE
// =========================================
$stmt = $conexion->prepare("
    UPDATE paquete
    SET
        titulo = ?,
        destino = ?,
        descripcion = ?,
        imagen = ?,

        hotel_nombre = ?,
        hotel_estrellas = ?,
        hotel_regimen = ?,
        hotel_detalles = ?,
        hotel_imagen = ?,

        fecha_salida = ?,
        fecha_regreso = ?,

        precio = ?,
        descuento = ?,

        plazas_totales = ?,
        plazas_disponibles = ?,

        activo = ?,
        vuelo_incluido = ?,

        salida_desde = ?,

        cerca_playa = ?,
        categoria = ?

    WHERE id = ?
");


// =========================================
// COMPROBAR PREPARE
// =========================================
if (!$stmt) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error en prepare",
        "error" => $conexion->error
    ]);

    exit;
}


// =========================================
// BIND PARAM
// 21 VARIABLES = 21 TIPOS
// =========================================
$stmt->bind_param(
    "sssssisssssddiiiisisi",

    $titulo,
    $destino,
    $descripcion,
    $imagen,

    $hotel_nombre,
    $hotel_estrellas,
    $hotel_regimen,
    $hotel_detalles,
    $hotel_imagen,

    $fecha_salida,
    $fecha_regreso,

    $precio,
    $descuento,

    $plazas_totales,
    $plazas_disponibles,

    $activo,
    $vuelo_incluido,

    $salida_desde,

    $cerca_playa,
    $categoria,

    $id
);


// =========================================
// EJECUTAR
// =========================================
if ($stmt->execute()) {

    echo json_encode([
        "ok" => true,
        "mensaje" => "Paquete actualizado correctamente"
    ]);

} else {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al actualizar",
        "error" => $stmt->error
    ]);

}


// =========================================
// CERRAR
// =========================================
$stmt->close();
$conexion->close();

?>
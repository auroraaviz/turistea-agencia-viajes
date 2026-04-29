<?php

/*
=========================================
API CREATE PAQUETES
-----------------------------------------
Responsabilidad:
- Recibir datos JSON desde frontend
- Insertar nuevo paquete en BD
- Devolver respuesta JSON

Ruta:
/api/paquetes/create.php
=========================================
*/


header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Permitir preflight CORS sin auth
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once("../config/auth.php");
verificarAdmin();

require_once("../config/bd.php");


// =========================================
// LEER JSON
// =========================================
$data = json_decode(
    file_get_contents("php://input"),
    true
);


// =========================================
// VALIDAR DATOS
// =========================================
if (!$data) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "No se recibieron datos"
    ]);

    exit;
}


// =========================================
// VARIABLES
// =========================================
$titulo = $data["titulo"] ?? "";
$destino = $data["destino"] ?? "";
$descripcion = $data["descripcion"] ?? "";
$imagen = $data["imagen"] ?? "assets/img/default.jpg";

$hotel_nombre = $data["hotel_nombre"] ?? "";
$hotel_estrellas = (int) ($data["hotel_estrellas"] ?? 3);
$hotel_regimen = $data["hotel_regimen"] ?? "";
$hotel_detalles = $data["hotel_detalles"] ?? "";
$hotel_imagen = $data["hotel_imagen"] ?? "assets/img/hoteles/default.jpg";

$fecha_salida = $data["fecha_salida"] ?? null;
$fecha_regreso = $data["fecha_regreso"] ?? null;

$precio = (float) ($data["precio"] ?? 0);
$descuento = (float) ($data["descuento"] ?? 0);

$plazas_totales = (int) ($data["plazas_totales"] ?? 0);
$plazas_disponibles = (int) ($data["plazas_disponibles"] ?? 0);

$activo = (int) ($data["activo"] ?? 1);
$vuelo_incluido = (int) ($data["vuelo_incluido"] ?? 0);

$salida_desde = $data["salida_desde"] ?? "";

$cerca_playa = (int) ($data["cerca_playa"] ?? 0);

$categoria = $data["categoria"] ?? "vacaciones";


// =========================================
// VALIDAR CATEGORÍA
// =========================================
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
// PREPARE INSERT
// =========================================
$stmt = $conexion->prepare("
    INSERT INTO paquete (

        titulo,
        destino,
        descripcion,
        imagen,

        hotel_nombre,
        hotel_estrellas,
        hotel_regimen,
        hotel_detalles,
        hotel_imagen,

        fecha_salida,
        fecha_regreso,

        precio,
        descuento,

        plazas_totales,
        plazas_disponibles,

        activo,
        vuelo_incluido,

        salida_desde,

        cerca_playa,
        categoria

    ) VALUES (

        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?,
        ?, ?

    )
");


// =========================================
// ERROR PREPARE
// =========================================
if (!$stmt) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error prepare",
        "error" => $conexion->error
    ]);

    exit;
}


// =========================================
// BIND PARAM
// =========================================
$stmt->bind_param(
    "sssssisssssddiiiisis",

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
    $categoria
);


// =========================================
// EJECUTAR
// =========================================
if ($stmt->execute()) {

    echo json_encode([
        "ok" => true,
        "mensaje" => "Paquete creado correctamente",
        "id" => $stmt->insert_id
    ]);

} else {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al crear paquete",
        "error" => $stmt->error
    ]);
}


// =========================================
// CERRAR
// =========================================
$stmt->close();
$conexion->close();

?>
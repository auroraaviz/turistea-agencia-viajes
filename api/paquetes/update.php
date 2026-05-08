<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once("../config/auth.php");
verificarAdmin();
require_once("../config/bd.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["id"])) {
    echo json_encode(["ok" => false, "mensaje" => "Falta el id del paquete"]);
    exit;
}

// ── Variables ─────────────────────────────────────────────────────────
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
if (!in_array($categoria, ["vuelo", "vacaciones", "fin_de_semana", "verano"])) {
    $categoria = "vacaciones";
}

// ── Campos nuevos ─────────────────────────────────────────────────────
$transporte = $data["transporte"] ?? "avion";
if (!in_array($transporte, ["avion", "sin_transporte"])) {
    $transporte = "avion";
}
$hora_salida_avion = !empty($data["hora_salida_avion"]) ? $data["hora_salida_avion"] : null;
$hora_llegada_avion = !empty($data["hora_llegada_avion"]) ? $data["hora_llegada_avion"] : null;

// ── UPDATE ────────────────────────────────────────────────────────────
$stmt = $conexion->prepare("
    UPDATE paquete SET
        titulo              = ?,
        destino             = ?,
        descripcion         = ?,
        imagen              = ?,
        hotel_nombre        = ?,
        hotel_estrellas     = ?,
        hotel_regimen       = ?,
        hotel_detalles      = ?,
        hotel_imagen        = ?,
        fecha_salida        = ?,
        fecha_regreso       = ?,
        precio              = ?,
        descuento           = ?,
        plazas_totales      = ?,
        plazas_disponibles  = ?,
        activo              = ?,
        vuelo_incluido      = ?,
        salida_desde        = ?,
        cerca_playa         = ?,
        categoria           = ?,
        transporte          = ?,
        hora_salida_avion   = ?,
        hora_llegada_avion  = ?
    WHERE id = ?
");

if (!$stmt) {
    echo json_encode(["ok" => false, "mensaje" => "Error en prepare", "error" => $conexion->error]);
    exit;
}

// 24 variables: 23 campos + id
// s=string, i=int, d=decimal
$stmt->bind_param(
    "sssssisssssddiiiisissssi",
    $titulo,            // s
    $destino,           // s
    $descripcion,       // s
    $imagen,            // s
    $hotel_nombre,      // s
    $hotel_estrellas,   // i
    $hotel_regimen,     // s
    $hotel_detalles,    // s
    $hotel_imagen,      // s
    $fecha_salida,      // s
    $fecha_regreso,     // s
    $precio,            // d
    $descuento,         // d
    $plazas_totales,    // i
    $plazas_disponibles,// i
    $activo,            // i
    $vuelo_incluido,    // i
    $salida_desde,      // s
    $cerca_playa,       // i
    $categoria,         // s
    $transporte,        // s
    $hora_salida_avion, // s
    $hora_llegada_avion,// s
    $id                 // i
);

if ($stmt->execute()) {
    echo json_encode(["ok" => true, "mensaje" => "Paquete actualizado correctamente"]);
} else {
    echo json_encode(["ok" => false, "mensaje" => "Error al actualizar", "error" => $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
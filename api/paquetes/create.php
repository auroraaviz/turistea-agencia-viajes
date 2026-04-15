<?php
// Mostrar errores solo en desarrollo
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Cabeceras
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Respuesta rápida al preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);
    exit();
}

// Conexión
require_once("../config/bd.php");

// Leer JSON recibido
$datos = json_decode(file_get_contents("php://input"), true);


// Comprobar que llegan datos
if (!$datos) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "No se recibieron datos válidos en JSON"
    ]);
    exit();
}

// Validar campos obligatorios
$camposObligatorios = [
    "titulo",
    "destino",
    "descripcion",
    "imagen",
    "hotel_nombre",
    "hotel_estrellas",
    "hotel_regimen",
    "hotel_imagen",
    "fecha_salida",
    "fecha_regreso",
    "plazas_disponibles",
    "plazas_totales",
    "precio",
    "descuento",
    "activo",
    "vuelo_incluido",
    "salida_desde",
    "cerca_playa"
];

foreach ($camposObligatorios as $campo) {
    if (!isset($datos[$campo]) || $datos[$campo] === "") {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Falta el campo obligatorio: " . $campo
        ]);
        exit();
    }
}

// Preparar datos
$titulo = trim($datos["titulo"]);
$destino = trim($datos["destino"]);
$descripcion = trim($datos["descripcion"]);
$imagen = trim($datos["imagen"]);
$hotel_nombre = trim($datos["hotel_nombre"]);
$hotel_estrellas = (int)$datos["hotel_estrellas"];
$hotel_regimen = trim($datos["hotel_regimen"]);
$hotel_imagen = trim($datos["hotel_imagen"]);
$fecha_salida = $datos["fecha_salida"];
$fecha_regreso = $datos["fecha_regreso"];
$plazas_disponibles = (int)$datos["plazas_disponibles"];
$plazas_totales = (int)$datos["plazas_totales"];
$precio = (float)$datos["precio"];
$descuento = (float)$datos["descuento"];
$activo = (int)$datos["activo"];
$vuelo_incluido = (int)$datos["vuelo_incluido"];
$salida_desde = trim($datos["salida_desde"]);
$cerca_playa = (int)$datos["cerca_playa"];

// SQL
$sql = "INSERT INTO paquete (
    titulo,
    destino,
    descripcion,
    imagen,
    hotel_nombre,
    hotel_estrellas,
    hotel_regimen,
    hotel_imagen,
    fecha_salida,
    fecha_regreso,
    plazas_disponibles,
    plazas_totales,
    precio,
    descuento,
    activo,
    vuelo_incluido,
    salida_desde,
    cerca_playa
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al preparar la consulta: " . $conexion->error
    ]);
    exit();
}

$stmt->bind_param(
    "sssssissssiiddiisi",
    $titulo,
    $destino,
    $descripcion,
    $imagen,
    $hotel_nombre,
    $hotel_estrellas,
    $hotel_regimen,
    $hotel_imagen,
    $fecha_salida,
    $fecha_regreso,
    $plazas_disponibles,
    $plazas_totales,
    $precio,
    $descuento,
    $activo,
    $vuelo_incluido,
    $salida_desde,
    $cerca_playa
);

// Ejecutar
if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Paquete creado correctamente",
        "id" => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error al crear el paquete: " . $stmt->error
    ]);
}

$stmt->close();
$conexion->close();
?>
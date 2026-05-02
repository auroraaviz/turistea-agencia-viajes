<?php
/**
 * /api/reservas/crear.php
 * POST → Crea una reserva para el usuario logueado.
 * Body JSON: { "paquete_id": 1, "num_viajeros": 2, "fecha_salida": "2026-10-05" }
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(204); exit; }

require_once __DIR__ . "/../config/bd.php";
require_once __DIR__ . "/../config/auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

// Modo dev: simular éxito
if (esModoDev()) {
    echo json_encode(["ok" => true, "mensaje" => "Reserva creada (modo dev)"]);
    exit;
}

if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$body       = json_decode(file_get_contents("php://input"), true);
$paqueteId  = (int)   ($body["paquete_id"]   ?? 0);
$numViajeros = (int)  ($body["num_viajeros"]  ?? 1);

if ($paqueteId <= 0) {
    http_response_code(422);
    echo json_encode(["error" => "paquete_id inválido"]);
    exit;
}

if ($numViajeros < 1) $numViajeros = 1;

$usuarioId = (int) $_SESSION["usuario_id"];

// Obtener precio del paquete para calcular el total
$stmtPaquete = $conexion->prepare(
    "SELECT precio, plazas_disponibles FROM paquete WHERE id = ? AND activo = 1 LIMIT 1"
);
$stmtPaquete->bind_param("i", $paqueteId);
$stmtPaquete->execute();
$resPaquete = $stmtPaquete->get_result()->fetch_assoc();

if (!$resPaquete) {
    http_response_code(404);
    echo json_encode(["error" => "Paquete no encontrado"]);
    exit;
}

if ($resPaquete["plazas_disponibles"] < $numViajeros) {
    http_response_code(409);
    echo json_encode(["error" => "No hay suficientes plazas disponibles"]);
    exit;
}

$precioTotal = $resPaquete["precio"] * $numViajeros;

// Insertar reserva
$stmt = $conexion->prepare(
    "INSERT INTO reserva (usuario_id, paquete_id, num_viajeros, precio_total, estado, fecha_reserva)
     VALUES (?, ?, ?, ?, 'PENDIENTE', NOW())"
);
$stmt->bind_param("iiid", $usuarioId, $paqueteId, $numViajeros, $precioTotal);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Error al crear la reserva"]);
    exit;
}

// Descontar plazas disponibles
$stmtPlazas = $conexion->prepare(
    "UPDATE paquete SET plazas_disponibles = plazas_disponibles - ? WHERE id = ?"
);
$stmtPlazas->bind_param("ii", $numViajeros, $paqueteId);
$stmtPlazas->execute();

echo json_encode([
    "ok"      => true,
    "mensaje" => "Reserva creada correctamente",
    "id"      => $stmt->insert_id
]);
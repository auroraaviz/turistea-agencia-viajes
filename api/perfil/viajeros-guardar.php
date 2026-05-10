<?php
/**
 * /api/perfil/viajeros-guardar.php
 * POST → Guarda los viajeros de una reserva del usuario logueado.
 *
 * Body JSON:
 * {
 *   "reserva_id": 3,
 *   "viajeros": [
 *     { "nombre": "Ana", "apellidos": "García", "dni": "12345678A", "fecha_nacimiento": "1990-03-14" },
 *     ...
 *   ]
 * }
 *
 * Devuelve: { "ok": true } o { "error": "..." }
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

if (esModoDev()) {
    echo json_encode(["ok" => true, "mensaje" => "Viajeros guardados (modo dev)"]);
    exit;
}

if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$body      = json_decode(file_get_contents("php://input"), true);
$reservaId = (int) ($body["reserva_id"] ?? 0);
$viajeros  = $body["viajeros"] ?? [];

if ($reservaId <= 0 || empty($viajeros) || !is_array($viajeros)) {
    http_response_code(422);
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

$usuarioId = (int) $_SESSION["usuario_id"];

// Verificar que la reserva pertenece al usuario
$stmtCheck = $conexion->prepare(
    "SELECT id FROM reserva WHERE id = ? AND usuario_id = ? LIMIT 1"
);
$stmtCheck->bind_param("ii", $reservaId, $usuarioId);
$stmtCheck->execute();
if ($stmtCheck->get_result()->num_rows === 0) {
    http_response_code(403);
    echo json_encode(["error" => "Reserva no encontrada o no autorizada"]);
    exit;
}

// Borrar viajeros anteriores si los hubiera (para evitar duplicados al reconfirmar)
$stmtDel = $conexion->prepare("DELETE FROM viajero WHERE reserva_id = ?");
$stmtDel->bind_param("i", $reservaId);
$stmtDel->execute();

// Insertar los nuevos viajeros
$stmtIns = $conexion->prepare(
    "INSERT INTO viajero (reserva_id, nombre, apellidos, dni, fecha_nacimiento)
     VALUES (?, ?, ?, ?, ?)"
);

foreach ($viajeros as $v) {
    $nombre      = trim($v["nombre"]           ?? "");
    $apellidos   = trim($v["apellidos"]        ?? "");
    $dni         = trim($v["dni"]              ?? "");
    $nacimiento  = trim($v["fecha_nacimiento"] ?? "");

    if (!$nombre || !$apellidos || !$dni || !$nacimiento) continue;

    $stmtIns->bind_param("issss", $reservaId, $nombre, $apellidos, $dni, $nacimiento);
    $stmtIns->execute();
}

echo json_encode(["ok" => true, "mensaje" => "Viajeros guardados correctamente"]);
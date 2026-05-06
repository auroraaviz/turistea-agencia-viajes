<?php
/**
 * /api/tarjetas/guardar.php
 * POST → Guarda una tarjeta de crédito para el usuario logueado.
 * Body JSON: { "titular": "Rosa López", "ultimos_4": "5544", "vencimiento": "15/10" }
 * Devuelve: { ok: true, id: ... }
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

if (!esModoDev() && empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$body       = json_decode(file_get_contents("php://input"), true);
$titular    = trim($body["titular"] ?? "");
$ultimos4   = trim($body["ultimos_4"] ?? "");
$vencimiento = trim($body["vencimiento"] ?? "");

if (!$titular || strlen($ultimos4) !== 4 || !$vencimiento) {
    http_response_code(422);
    echo json_encode(["error" => "Datos de tarjeta incompletos"]);
    exit;
}

$usuarioId = !empty($_SESSION["usuario_id"]) ? (int) $_SESSION["usuario_id"] : 1;

$stmt = $conexion->prepare(
    "INSERT INTO tarjeta_credito (usuario_id, titular, ultimos_4, vencimiento)
     VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("isss", $usuarioId, $titular, $ultimos4, $vencimiento);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Error al guardar la tarjeta"]);
    exit;
}

echo json_encode([
    "ok"  => true,
    "id"  => $stmt->insert_id
]);

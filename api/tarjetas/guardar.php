<?php
/**
 * /api/tarjetas/guardar.php
 * POST → Guarda una tarjeta de crédito para el usuario logueado.
 * Body JSON: { "titular": "Rosa López", "numero": "4111111111111111", "vencimiento": "10/28", "cvv": "123" }
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

$body        = json_decode(file_get_contents("php://input"), true);
$titular     = trim($body["titular"] ?? "");
$numero      = preg_replace('/\D/', '', (string) ($body["numero"] ?? ""));
$ultimos4    = trim($body["ultimos_4"] ?? "");
$vencimiento = trim($body["vencimiento"] ?? "");
$cvv         = preg_replace('/\D/', '', (string) ($body["cvv"] ?? ""));

if ($numero !== "") {
    $ultimos4 = substr($numero, -4);
}

if (!$titular || strlen($numero) < 13 || strlen($numero) > 19 || strlen($ultimos4) !== 4 || !preg_match('/^\d{2}\/\d{2}$/', $vencimiento) || strlen($cvv) < 3 || strlen($cvv) > 4) {
    http_response_code(422);
    echo json_encode(["error" => "Datos de tarjeta incompletos"]);
    exit;
}

$usuarioId = !empty($_SESSION["usuario_id"]) ? (int) $_SESSION["usuario_id"] : 1;
$tarjetaHash = password_hash($numero . "|" . $vencimiento, PASSWORD_DEFAULT);

$stmtUsuario = $conexion->prepare("SELECT id FROM usuario WHERE id = ? LIMIT 1");
$stmtUsuario->bind_param("i", $usuarioId);
$stmtUsuario->execute();

if (!$stmtUsuario->get_result()->fetch_assoc()) {
    http_response_code(401);
    echo json_encode(["error" => "La sesión no corresponde a un usuario válido. Vuelve a iniciar sesión."]);
    exit;
}

$columnaHash = $conexion->query("SHOW COLUMNS FROM tarjeta_credito LIKE 'tarjeta_hash'");
if ($columnaHash && $columnaHash->num_rows === 0) {
    $conexion->query("ALTER TABLE tarjeta_credito ADD COLUMN tarjeta_hash varchar(255) NULL AFTER vencimiento");
}

$stmt = $conexion->prepare(
    "INSERT INTO tarjeta_credito (usuario_id, titular, ultimos_4, vencimiento, tarjeta_hash)
     VALUES (?, ?, ?, ?, ?)"
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo preparar el guardado de la tarjeta"]);
    exit;
}

$stmt->bind_param("issss", $usuarioId, $titular, $ultimos4, $vencimiento, $tarjetaHash);

if (!$stmt->execute()) {
    error_log("Error al guardar tarjeta: " . $stmt->error);
    http_response_code(500);
    echo json_encode(["error" => "Error al guardar la tarjeta. Revisa que la base de datos tenga aplicada la migración de tarjetas."]);
    exit;
}

echo json_encode([
    "ok"  => true,
    "id"  => $stmt->insert_id
]);

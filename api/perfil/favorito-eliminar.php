<?php
/**
 * /api/perfil/favorito-eliminar.php
 * POST → Elimina un paquete de los favoritos del usuario logueado.
 * Body JSON esperado: { "paquete_id": 5 }
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(204); exit; }

require_once __DIR__ . "/../config/bd.php";

session_start();
if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

$body      = json_decode(file_get_contents("php://input"), true);
$paqueteId = (int) ($body["paquete_id"] ?? 0);

if ($paqueteId <= 0) {
    http_response_code(422);
    echo json_encode(["error" => "paquete_id inválido"]);
    exit;
}

$usuarioId = (int) $_SESSION["usuario_id"];

$sql  = "DELETE FROM favorito WHERE usuario_id = ? AND paquete_id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ii", $usuarioId, $paqueteId);

if ($stmt->execute()) {
    echo json_encode(["ok" => true, "mensaje" => "Favorito eliminado"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al eliminar el favorito"]);
}
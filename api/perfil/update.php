<?php
/**
 * /api/perfil/update.php
 * POST → Actualiza nombre, apellidos y teléfono del usuario logueado.
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

// Leer body JSON
$body = json_decode(file_get_contents("php://input"), true);

$nombre    = trim($body["nombre"]    ?? "");
$apellidos = trim($body["apellidos"] ?? "");
$telefono  = trim($body["telefono"]  ?? "");

// Validaciones mínimas
if ($nombre === "") {
    http_response_code(422);
    echo json_encode(["error" => "El nombre es obligatorio"]);
    exit;
}

$id = (int) $_SESSION["usuario_id"];

$sql = "UPDATE usuario
        SET nombre = ?, apellidos = ?, telefono = ?
        WHERE id = ? AND activo = 1";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("sssi", $nombre, $apellidos, $telefono, $id);

if ($stmt->execute()) {
    echo json_encode(["ok" => true, "mensaje" => "Perfil actualizado correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al actualizar el perfil"]);
}
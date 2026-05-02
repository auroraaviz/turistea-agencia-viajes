<?php
/**
 * /api/perfil/update.php
 * POST → Actualiza nombre, apellidos y teléfono del usuario logueado.
 *
 * NOTAS:
 *  - NO llamar session_start() → ya lo hace auth.php
 *  - Devuelve JSON: { ok: true } o { error: "..." }
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

// Modo dev: simular éxito sin tocar BD
if (esModoDev()) {
    echo json_encode(["ok" => true, "mensaje" => "Perfil actualizado (modo dev)"]);
    exit;
}

if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$body      = json_decode(file_get_contents("php://input"), true);
$nombre    = trim($body["nombre"]    ?? "");
$apellidos = trim($body["apellidos"] ?? "");
$telefono  = trim($body["telefono"]  ?? "") ?: null;

if ($nombre === "") {
    http_response_code(422);
    echo json_encode(["error" => "El nombre es obligatorio"]);
    exit;
}

$id   = (int) $_SESSION["usuario_id"];
$stmt = $conexion->prepare(
    "UPDATE usuario SET nombre = ?, apellidos = ?, telefono = ? WHERE id = ? AND activo = 1"
);
$stmt->bind_param("sssi", $nombre, $apellidos, $telefono, $id);

if ($stmt->execute()) {
    // Actualizar también la sesión para que el nombre se refleje al recargar
    $_SESSION["nombre"] = $nombre;
    echo json_encode(["ok" => true, "mensaje" => "Perfil actualizado correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al actualizar el perfil"]);
}
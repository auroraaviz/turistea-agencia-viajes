<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once("../config/bd.php");
require_once("../config/auth.php");

verificarAdmin();

$datos = json_decode(file_get_contents("php://input"), true);

if (!$datos) {
    http_response_code(400);
    echo json_encode(["error" => "JSON inválido"]);
    exit;
}

if (empty($datos['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "ID requerido"]);
    exit;
}

$id = (int) $datos['id'];
$nombre = trim($datos['nombre'] ?? '');
$apellidos = trim($datos['apellidos'] ?? '');
$email = trim($datos['email'] ?? '');
$telefono = trim($datos['telefono'] ?? '');
$rol = trim($datos['rol'] ?? 'usuario');
$activo = isset($datos['activo']) ? (int) $datos['activo'] : 1;

if ($nombre === '' || $email === '') {
    http_response_code(400);
    echo json_encode(["error" => "Nombre y email son obligatorios"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Email inválido"]);
    exit;
}

if (!in_array($rol, ['usuario', 'admin'], true)) {
    http_response_code(400);
    echo json_encode(["error" => "Rol inválido"]);
    exit;
}

$activo = $activo === 1 ? 1 : 0;

$stmt = $conexion->prepare("
    UPDATE usuario
    SET nombre = ?, apellidos = ?, email = ?, telefono = ?, rol = ?, activo = ?
    WHERE id = ?
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Error al preparar consulta: " . $conexion->error]);
    exit;
}

$stmt->bind_param("sssssii", $nombre, $apellidos, $email, $telefono, $rol, $activo, $id);
$ok = $stmt->execute();

if ($ok && $stmt->affected_rows >= 0) {
    echo json_encode(["ok" => true, "mensaje" => "Usuario actualizado"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al actualizar: " . $stmt->error]);
}
?>

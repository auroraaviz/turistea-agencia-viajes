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
$nombre = $conexion->real_escape_string($datos['nombre'] ?? '');
$apellidos = $conexion->real_escape_string($datos['apellidos'] ?? '');
$email = $conexion->real_escape_string($datos['email'] ?? '');
$telefono = $conexion->real_escape_string($datos['telefono'] ?? '');
$rol = $conexion->real_escape_string($datos['rol'] ?? '');
$activo = isset($datos['activo']) ? (int) $datos['activo'] : 1;

$ok = $conexion->query("
    UPDATE usuario
    SET
        nombre = '$nombre',
        apellidos = '$apellidos',
        email = '$email',
        telefono = '$telefono',
        rol = '$rol',
        activo = $activo
    WHERE id = $id
");

if ($ok) {
    echo json_encode(["ok" => true, "mensaje" => "Usuario actualizado"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al actualizar: " . $conexion->error]);
}
?>
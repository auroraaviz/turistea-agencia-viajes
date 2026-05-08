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

if (empty($datos['id'])) {
    http_response_code(400);
    echo json_encode(['error' => "ID requerido"]);
    exit;
}

$id = (int) $datos['id'];

//soft delete: alterna entre bloqueado y activo
$stmt = $conexion->prepare("
    UPDATE usuario
    SET activo = IF(activo = 1, 0, 1)
    WHERE id = ?
");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Error al preparar consulta: " . $conexion->error]);
    exit;
}

$stmt->bind_param("i", $id);
$ok = $stmt->execute();

if ($ok) {
    echo json_encode(["ok" => true, "mensaje" => "Estado de usuario actualizado"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error: " . $stmt->error]);
}
?>

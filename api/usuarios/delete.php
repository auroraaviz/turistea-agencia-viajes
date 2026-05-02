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

if (empty($datos['id'])) {
    http_response_code(400);
    echo json_encode(['error' => "ID requerido"]);
    exit;
}

$id = (int) $datos['id'];

//soft delete (no borrado real)
$ok = $conexion->query("
    UPDATE usuario
    SET activo = 0
    WHERE id = $id
");

if ($ok) {
    echo json_encode(["ok" => true, "mensaje" => "Usuario bloqueado"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error: " . $conexion->error]);
}
?>
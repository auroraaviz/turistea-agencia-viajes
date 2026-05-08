<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require_once __DIR__ . "/../config/bd.php";
require_once __DIR__ . "/../config/auth.php";

verificarAdmin();

$body = json_decode(file_get_contents("php://input"), true);
$id = (int) ($body["id"] ?? 0);
$estado = strtoupper($body["estado"] ?? "");

$permitidos = ["PENDIENTE", "CONFIRMADA", "CANCELADA"];

if ($id <= 0 || !in_array($estado, $permitidos)) {
    http_response_code(422);
    echo json_encode(["ok" => false, "error" => "Datos inválidos"]);
    exit;
}

$stmt = $conexion->prepare("UPDATE reserva SET estado = ? WHERE id = ?");
$stmt->bind_param("si", $estado, $id);

if ($stmt->execute()) {
    echo json_encode(["ok" => true, "estado" => $estado]);
} else {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "Error al actualizar"]);
}
?>
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

if ($id <= 0) {
    http_response_code(422);
    echo json_encode(["ok" => false, "error" => "ID inválido"]);
    exit;
}

// Obtener num_viajeros y paquete_id para restaurar plazas
$stmt = $conexion->prepare("SELECT paquete_id, num_viajeros FROM reserva WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$reserva = $stmt->get_result()->fetch_assoc();

if (!$reserva) {
    http_response_code(404);
    echo json_encode(["ok" => false, "error" => "Reserva no encontrada"]);
    exit;
}

// Eliminar pagos asociados primero
$conexion->prepare("DELETE FROM pago WHERE reserva_id = ?")->execute();
$stmtPago = $conexion->prepare("DELETE FROM pago WHERE reserva_id = ?");
$stmtPago->bind_param("i", $id);
$stmtPago->execute();

// Eliminar reserva
$stmtDel = $conexion->prepare("DELETE FROM reserva WHERE id = ?");
$stmtDel->bind_param("i", $id);

if ($stmtDel->execute()) {
    // Restaurar plazas al paquete
    $stmtPlazas = $conexion->prepare(
        "UPDATE paquete SET plazas_disponibles = plazas_disponibles + ? WHERE id = ?"
    );
    $stmtPlazas->bind_param("ii", $reserva["num_viajeros"], $reserva["paquete_id"]);
    $stmtPlazas->execute();

    echo json_encode(["ok" => true]);
} else {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "Error al eliminar"]);
}
?>
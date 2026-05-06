<?php
/**
 * /api/perfil/reserva-cancelar.php
 * POST -> Cancela una reserva del usuario logueado.
 * Body JSON: { "reserva_id": 1 }
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

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

$body = json_decode(file_get_contents("php://input"), true);
$reservaId = (int) ($body["reserva_id"] ?? 0);
$usuarioId = !empty($_SESSION["usuario_id"]) ? (int) $_SESSION["usuario_id"] : 1;

if ($reservaId <= 0) {
    http_response_code(422);
    echo json_encode(["error" => "reserva_id inválido"]);
    exit;
}

$stmt = $conexion->prepare(
    "SELECT id, estado FROM reserva WHERE id = ? AND usuario_id = ? LIMIT 1"
);
$stmt->bind_param("ii", $reservaId, $usuarioId);
$stmt->execute();
$reserva = $stmt->get_result()->fetch_assoc();

if (!$reserva) {
    http_response_code(404);
    echo json_encode(["error" => "Reserva no encontrada"]);
    exit;
}

if ($reserva["estado"] === "CANCELADA") {
    echo json_encode(["ok" => true, "mensaje" => "La reserva ya estaba cancelada"]);
    exit;
}

$conexion->begin_transaction();

try {
    $stmtReserva = $conexion->prepare(
        "UPDATE reserva SET estado = 'CANCELADA' WHERE id = ? AND usuario_id = ?"
    );
    $stmtReserva->bind_param("ii", $reservaId, $usuarioId);
    $stmtReserva->execute();

    $stmtPago = $conexion->prepare(
        "UPDATE pago SET estado = 'FALLIDO' WHERE reserva_id = ? AND estado = 'PENDIENTE'"
    );
    $stmtPago->bind_param("i", $reservaId);
    $stmtPago->execute();

    $conexion->commit();

    echo json_encode([
        "ok" => true,
        "mensaje" => "Reserva cancelada correctamente",
        "estado" => "CANCELADA"
    ]);
} catch (Throwable $e) {
    $conexion->rollback();
    http_response_code(500);
    echo json_encode(["error" => "Error al cancelar la reserva"]);
}

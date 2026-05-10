<?php
/**
 * /api/perfil/reserva-confirmar.php
 * POST -> Confirma una reserva pendiente del usuario logueado.
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

if ($reserva["estado"] === "CONFIRMADA") {
    echo json_encode(["ok" => true, "mensaje" => "La reserva ya estaba confirmada"]);
    exit;
}

if ($reserva["estado"] !== "PENDIENTE") {
    http_response_code(409);
    echo json_encode(["error" => "Solo se pueden confirmar reservas pendientes"]);
    exit;
}

$conexion->begin_transaction();

try {
    $stmtReserva = $conexion->prepare(
        "UPDATE reserva SET estado = 'CONFIRMADA' WHERE id = ? AND usuario_id = ? AND estado = 'PENDIENTE'"
    );
    $stmtReserva->bind_param("ii", $reservaId, $usuarioId);
    $stmtReserva->execute();

    $stmtPago = $conexion->prepare(
        "UPDATE pago SET estado = 'PAGADO', fecha_pago = NOW() WHERE reserva_id = ? AND estado = 'PENDIENTE'"
    );
    $stmtPago->bind_param("i", $reservaId);
    $stmtPago->execute();

    // Generar y guardar referencia de factura en formato TUR-AÑO-ID_RESERVA
    $referencia = 'TUR-' . date('Y') . '-' . $reservaId;
    $stmtRef = $conexion->prepare(
        "UPDATE pago SET referencia_externa = ?
         WHERE reserva_id = ? AND (referencia_externa IS NULL OR referencia_externa = '')"
    );
    $stmtRef->bind_param("si", $referencia, $reservaId);
    $stmtRef->execute();

    $conexion->commit();

    echo json_encode([
        "ok"         => true,
        "mensaje"    => "Reserva confirmada correctamente",
        "estado"     => "CONFIRMADA",
        "referencia" => $referencia
    ]);
} catch (Throwable $e) {
    $conexion->rollback();
    http_response_code(500);
    echo json_encode(["error" => "Error al confirmar la reserva"]);
}
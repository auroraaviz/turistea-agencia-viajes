<?php
/**
 * /api/reservas/crear.php
 * POST → Crea una reserva + pago para el usuario logueado.
 * Body JSON: {
 *   "paquete_id": 1,
 *   "num_viajeros": 2,
 *   "tarjeta_id": 5,
 *   "modo": "pagar" | "reservar"
 * }
 *
 * modo "pagar"   → reserva CONFIRMADA + pago PAGADO  (fecha < 1 mes)
 * modo "reservar" → reserva PENDIENTE  + pago PENDIENTE (fecha >= 1 mes)
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

// En modo dev se usa usuario_id = 1 si no hay sesión
if (!esModoDev() && empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$body        = json_decode(file_get_contents("php://input"), true);
$paqueteId   = (int) ($body["paquete_id"]   ?? 0);
$numViajeros = (int) ($body["num_viajeros"]  ?? 1);
$tarjetaId   = (int) ($body["tarjeta_id"]    ?? 0);
$modo        = ($body["modo"] ?? "pagar");

if ($paqueteId <= 0) {
    http_response_code(422);
    echo json_encode(["error" => "paquete_id inválido"]);
    exit;
}
if ($numViajeros < 1) $numViajeros = 1;

if ($tarjetaId <= 0) {
    http_response_code(422);
    echo json_encode(["error" => "Debes añadir una tarjeta de crédito"]);
    exit;
}

$usuarioId = !empty($_SESSION["usuario_id"]) ? (int) $_SESSION["usuario_id"] : 1;

// Obtener paquete
$stmtPaq = $conexion->prepare(
    "SELECT precio, plazas_disponibles, fecha_salida FROM paquete WHERE id = ? AND activo = 1 LIMIT 1"
);
$stmtPaq->bind_param("i", $paqueteId);
$stmtPaq->execute();
$paquete = $stmtPaq->get_result()->fetch_assoc();

if (!$paquete) {
    http_response_code(404);
    echo json_encode(["error" => "Paquete no encontrado"]);
    exit;
}

if ($paquete["plazas_disponibles"] < $numViajeros) {
    http_response_code(409);
    echo json_encode(["error" => "No hay suficientes plazas disponibles"]);
    exit;
}

// Verificar lógica de fecha
$fechaSalida = new DateTime($paquete["fecha_salida"]);
$hoy         = new DateTime();
$diff        = $hoy->diff($fechaSalida);
$diasHasta   = (int) $diff->format('%r%a'); // negativo si ya pasó

if ($diasHasta < 0) {
    http_response_code(422);
    echo json_encode(["error" => "La fecha de salida ya ha pasado"]);
    exit;
}

// <30 días → debe pagar, >=30 días → puede reservar
$esPagoInmediato = $diasHasta < 30;

if ($esPagoInmediato && $modo !== "pagar") {
    $modo = "pagar"; // forzar pago si queda menos de 1 mes
}

$precioTotal    = $paquete["precio"] * $numViajeros;
$estadoReserva  = ($modo === "pagar") ? "CONFIRMADA" : "PENDIENTE";
$estadoPago     = ($modo === "pagar") ? "PAGADO"     : "PENDIENTE";

// Insertar reserva
$stmt = $conexion->prepare(
    "INSERT INTO reserva (usuario_id, paquete_id, num_viajeros, precio_total, estado, fecha_reserva)
     VALUES (?, ?, ?, ?, ?, NOW())"
);
$stmt->bind_param("iiids", $usuarioId, $paqueteId, $numViajeros, $precioTotal, $estadoReserva);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Error al crear la reserva"]);
    exit;
}

$reservaId = $stmt->insert_id;

// Insertar pago
$ref = "PAG-" . str_pad($reservaId, 6, "0", STR_PAD_LEFT);
$metodo = "TARJETA";

$stmtPago = $conexion->prepare(
    "INSERT INTO pago (reserva_id, importe, metodo, estado, referencia_externa, fecha_pago)
     VALUES (?, ?, ?, ?, ?, NOW())"
);
$stmtPago->bind_param("idsss", $reservaId, $precioTotal, $metodo, $estadoPago, $ref);
$stmtPago->execute();

// Descontar plazas
$stmtPlazas = $conexion->prepare(
    "UPDATE paquete SET plazas_disponibles = plazas_disponibles - ? WHERE id = ?"
);
$stmtPlazas->bind_param("ii", $numViajeros, $paqueteId);
$stmtPlazas->execute();

echo json_encode([
    "ok"       => true,
    "mensaje"  => ($modo === "pagar") ? "Pago realizado correctamente" : "Reserva creada correctamente",
    "id"       => $reservaId,
    "modo"     => $modo,
    "estado"   => $estadoReserva
]);

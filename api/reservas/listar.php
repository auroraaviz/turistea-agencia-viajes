<?php
/**
 * /api/reservas/listar.php
 * GET → Devuelve todas las reservas (para admin).
 * Query params opcionales: ?estado=PENDIENTE
 */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/bd.php";
require_once __DIR__ . "/../config/auth.php";

verificarAdmin();

$estado = isset($_GET["estado"]) ? strtoupper(trim($_GET["estado"])) : null;

$sql = "SELECT r.id, r.num_viajeros, r.precio_total, r.estado, r.fecha_reserva,
               u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos, u.email AS usuario_email,
               p.titulo AS paquete_titulo, p.destino AS paquete_destino, p.fecha_salida, p.fecha_regreso,
               pg.estado AS pago_estado, pg.importe AS pago_importe, pg.metodo AS pago_metodo
        FROM reserva r
        LEFT JOIN usuario u ON r.usuario_id = u.id
        LEFT JOIN paquete p ON r.paquete_id = p.id
        LEFT JOIN pago pg ON pg.reserva_id = r.id";

if ($estado && in_array($estado, ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'])) {
    $sql .= " WHERE r.estado = ?";
    $stmt = $conexion->prepare($sql . " ORDER BY r.fecha_reserva DESC");
    $stmt->bind_param("s", $estado);
} else {
    $stmt = $conexion->prepare($sql . " ORDER BY r.fecha_reserva DESC");
}

$stmt->execute();
$resultado = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode($resultado);

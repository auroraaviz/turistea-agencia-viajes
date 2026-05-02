<?php
/**
 * /api/perfil/reservas.php
 * GET → Devuelve las reservas del usuario logueado.
 *
 * NOTAS:
 *  - NO llamar session_start() → ya lo hace auth.php
 *  - En modo dev devuelve array vacío (sin datos mock)
 */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/bd.php";
require_once __DIR__ . "/../config/auth.php";

// Modo dev: devolver array vacío para no simular datos falsos
if (esModoDev()) {
    echo json_encode([]);
    exit;
}

if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$id = (int) $_SESSION["usuario_id"];

$stmt = $conexion->prepare(
    "SELECT
        r.id,
        r.num_viajeros,
        r.precio_total,
        r.estado,
        r.fecha_reserva,
        p.titulo  AS nombre_paquete,
        p.imagen,
        p.destino
     FROM reserva r
     JOIN paquete p ON p.id = r.paquete_id
     WHERE r.usuario_id = ?
     ORDER BY r.fecha_reserva DESC"
);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

$reservas = [];
while ($fila = $resultado->fetch_assoc()) {
    $reservas[] = $fila;
}

echo json_encode($reservas);
<?php
/**
 * /api/perfil/reservas.php
 * GET → Devuelve las reservas del usuario logueado,
 *       con datos del paquete asociado (nombre, imagen, destino).
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . "/../config/bd.php";

session_start();
if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$id = (int) $_SESSION["usuario_id"];

$sql = "SELECT
            r.id,
            r.num_viajeros,
            r.precio_total,
            r.estado,
            r.fecha_reserva,
            p.nombre  AS nombre_paquete,
            p.imagen,
            p.destino
        FROM reserva r
        JOIN paquete p ON p.id = r.paquete_id
        WHERE r.usuario_id = ?
        ORDER BY r.fecha_reserva DESC";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

$reservas = [];
while ($fila = $resultado->fetch_assoc()) {
    $reservas[] = $fila;
}

echo json_encode($reservas);
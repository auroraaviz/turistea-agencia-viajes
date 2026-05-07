<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once("../config/bd.php");

if (isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    $resultado = $conexion->query("
        SELECT r.id, r.usuario_id, r.paquete_id, r.num_viajeros, r.precio_total,
               r.estado, r.fecha_reserva,
               u.nombre, u.apellidos, u.email,
               p.titulo AS paquete_titulo, p.destino, p.fecha_salida
        FROM reserva r
        LEFT JOIN usuario u ON u.id = r.usuario_id
        LEFT JOIN paquete p ON p.id = r.paquete_id
        WHERE r.id = $id
    ");
    echo json_encode($resultado->fetch_assoc());
    exit;
}

$where = [];

if (!empty($_GET['estado'])) {
    $estado = $conexion->real_escape_string(strtoupper($_GET['estado']));
    $where[] = "r.estado = '$estado'";
}

if (!empty($_GET['q'])) {
    $q = $conexion->real_escape_string($_GET['q']);
    $where[] = "(u.nombre LIKE '%$q%' OR u.apellidos LIKE '%$q%' OR u.email LIKE '%$q%' OR p.titulo LIKE '%$q%')";
}

$sql = "
    SELECT r.id, r.usuario_id, r.paquete_id, r.num_viajeros, r.precio_total,
           r.estado, r.fecha_reserva,
           u.nombre, u.apellidos, u.email,
           p.titulo AS paquete_titulo, p.destino, p.fecha_salida
    FROM reserva r
    LEFT JOIN usuario u ON u.id = r.usuario_id
    LEFT JOIN paquete p ON p.id = r.paquete_id
";

if (!empty($where)) {
    $sql .= " WHERE " . implode(" AND ", $where);
}

$sql .= " ORDER BY r.fecha_reserva DESC";

$resultado = $conexion->query($sql);
echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));
?>
<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once("../config/bd.php");

// Total paquetes
$totalPaquetes = $conexion->query("SELECT COUNT(*) AS total FROM paquete")->fetch_assoc()['total'];
$paquetesActivos = $conexion->query("SELECT COUNT(*) AS total FROM paquete WHERE activo = 1")->fetch_assoc()['total'];
$paquetesInactivos = $totalPaquetes - $paquetesActivos;

// Total usuarios
$totalUsuarios = $conexion->query("SELECT COUNT(*) AS total FROM usuario")->fetch_assoc()['total'];

// Total reservas y por estado
$totalReservas = $conexion->query("SELECT COUNT(*) AS total FROM reserva")->fetch_assoc()['total'];
$reservasPendientes = $conexion->query("SELECT COUNT(*) AS total FROM reserva WHERE estado = 'PENDIENTE'")->fetch_assoc()['total'];
$reservasConfirmadas = $conexion->query("SELECT COUNT(*) AS total FROM reserva WHERE estado = 'CONFIRMADA'")->fetch_assoc()['total'];
$reservasCanceladas = $conexion->query("SELECT COUNT(*) AS total FROM reserva WHERE estado = 'CANCELADA'")->fetch_assoc()['total'];

// Ingresos totales (pagos completados)
$ingresos = $conexion->query("SELECT COALESCE(SUM(importe), 0) AS total FROM pago WHERE estado = 'PAGADO'")->fetch_assoc()['total'];

// Plazas disponibles y totales
$plazasDisponibles = $conexion->query("SELECT COALESCE(SUM(plazas_disponibles), 0) AS total FROM paquete WHERE activo = 1")->fetch_assoc()['total'];
$plazasTotales = $conexion->query("SELECT COALESCE(SUM(plazas_totales), 0) AS total FROM paquete WHERE activo = 1")->fetch_assoc()['total'];

// Paquetes con pocas plazas (menos de 5)
$alertaPlazas = $conexion->query("
    SELECT id, titulo, destino, plazas_disponibles, plazas_totales
    FROM paquete
    WHERE activo = 1 AND plazas_disponibles <= 5
    ORDER BY plazas_disponibles ASC
")->fetch_all(MYSQLI_ASSOC);

// Destinos mas populares (por numero de paquetes)
$destinosPopulares = $conexion->query("
    SELECT destino, COUNT(*) AS total
    FROM paquete
    WHERE activo = 1
    GROUP BY destino
    ORDER BY total DESC
    LIMIT 5
")->fetch_all(MYSQLI_ASSOC);

// Proximas salidas (paquetes con fecha_salida futura)
$proximasSalidas = $conexion->query("
    SELECT id, titulo, destino, fecha_salida, plazas_disponibles, precio
    FROM paquete
    WHERE activo = 1 AND fecha_salida >= CURDATE()
    ORDER BY fecha_salida ASC
    LIMIT 5
")->fetch_all(MYSQLI_ASSOC);

// Ultimos usuarios registrados
$ultimosUsuarios = $conexion->query("
    SELECT id, nombre, apellidos, email, created_at
    FROM usuario
    ORDER BY created_at DESC
    LIMIT 5
")->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    'paquetes' => [
        'total' => (int) $totalPaquetes,
        'activos' => (int) $paquetesActivos,
        'inactivos' => (int) $paquetesInactivos
    ],
    'usuarios' => [
        'total' => (int) $totalUsuarios
    ],
    'reservas' => [
        'total' => (int) $totalReservas,
        'pendientes' => (int) $reservasPendientes,
        'confirmadas' => (int) $reservasConfirmadas,
        'canceladas' => (int) $reservasCanceladas
    ],
    'ingresos' => (float) $ingresos,
    'plazas_disponibles' => (int) $plazasDisponibles,
    'plazas_totales' => (int) $plazasTotales,
    'alerta_plazas' => $alertaPlazas,
    'destinos_populares' => $destinosPopulares,
    'proximas_salidas' => $proximasSalidas,
    'ultimos_usuarios' => $ultimosUsuarios
]);
?>

<?php

require_once("../config/auth.php");
verificarAdmin();

header("Content-Type: application/json; charset=UTF-8");

require_once("../config/bd.php");

function fila($conexion, $sql) {
    $resultado = $conexion->query($sql);
    return $resultado ? $resultado->fetch_assoc() : [];
}

function filas($conexion, $sql) {
    $resultado = $conexion->query($sql);
    return $resultado ? $resultado->fetch_all(MYSQLI_ASSOC) : [];
}

function numeroFactura($pagoId, $fechaPago) {
    $year = $fechaPago ? date('Y', strtotime($fechaPago)) : date('Y');
    return 'FAC-' . $year . '-' . str_pad((string) $pagoId, 6, '0', STR_PAD_LEFT);
}

$resumen = fila($conexion, "
    SELECT
        COALESCE(SUM(CASE WHEN estado = 'PAGADO' THEN importe ELSE 0 END), 0) AS ingresos_totales,
        COALESCE(SUM(CASE WHEN estado = 'PAGADO' AND YEAR(fecha_pago) = YEAR(CURDATE()) AND MONTH(fecha_pago) = MONTH(CURDATE()) THEN importe ELSE 0 END), 0) AS ingresos_mes,
        COALESCE(SUM(CASE WHEN estado = 'PENDIENTE' THEN importe ELSE 0 END), 0) AS pagos_pendientes,
        SUM(CASE WHEN estado = 'PAGADO' THEN 1 ELSE 0 END) AS facturas_emitidas,
        COUNT(*) AS pagos_totales
    FROM pago
");

$pagosPorEstado = filas($conexion, "
    SELECT estado, COUNT(*) AS total, COALESCE(SUM(importe), 0) AS importe
    FROM pago
    GROUP BY estado
");

$pagosPorMetodo = filas($conexion, "
    SELECT metodo, COUNT(*) AS total, COALESCE(SUM(importe), 0) AS importe
    FROM pago
    GROUP BY metodo
    ORDER BY importe DESC
");

$ingresosMensuales = filas($conexion, "
    SELECT DATE_FORMAT(fecha_pago, '%Y-%m') AS mes, COALESCE(SUM(importe), 0) AS total
    FROM pago
    WHERE estado = 'PAGADO'
      AND fecha_pago >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01')
    GROUP BY DATE_FORMAT(fecha_pago, '%Y-%m')
    ORDER BY mes ASC
");

$topPaquetes = filas($conexion, "
    SELECT p.titulo, p.destino, COUNT(pg.id) AS pagos, COALESCE(SUM(pg.importe), 0) AS ingresos
    FROM pago pg
    INNER JOIN reserva r ON pg.reserva_id = r.id
    LEFT JOIN paquete p ON r.paquete_id = p.id
    WHERE pg.estado = 'PAGADO'
    GROUP BY p.id, p.titulo, p.destino
    ORDER BY ingresos DESC
    LIMIT 5
");

$ultimosPagos = filas($conexion, "
    SELECT pg.id, pg.importe, pg.metodo, pg.estado, pg.referencia_externa, pg.fecha_pago,
           r.id AS reserva_id, r.estado AS reserva_estado,
           u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos, u.email AS usuario_email,
           p.titulo AS paquete_titulo
    FROM pago pg
    LEFT JOIN reserva r ON pg.reserva_id = r.id
    LEFT JOIN usuario u ON r.usuario_id = u.id
    LEFT JOIN paquete p ON r.paquete_id = p.id
    ORDER BY pg.fecha_pago DESC, pg.id DESC
    LIMIT 12
");

$facturas = filas($conexion, "
    SELECT pg.id, pg.importe, pg.metodo, pg.referencia_externa, pg.fecha_pago,
           r.id AS reserva_id,
           u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos, u.email AS usuario_email,
           p.titulo AS paquete_titulo
    FROM pago pg
    LEFT JOIN reserva r ON pg.reserva_id = r.id
    LEFT JOIN usuario u ON r.usuario_id = u.id
    LEFT JOIN paquete p ON r.paquete_id = p.id
    WHERE pg.estado = 'PAGADO'
    ORDER BY pg.fecha_pago DESC, pg.id DESC
    LIMIT 12
");

foreach ($facturas as &$factura) {
    $factura["numero_factura"] = numeroFactura($factura["id"], $factura["fecha_pago"]);
}
unset($factura);

echo json_encode([
    "resumen" => [
        "ingresos_totales" => (float) ($resumen["ingresos_totales"] ?? 0),
        "ingresos_mes" => (float) ($resumen["ingresos_mes"] ?? 0),
        "pagos_pendientes" => (float) ($resumen["pagos_pendientes"] ?? 0),
        "facturas_emitidas" => (int) ($resumen["facturas_emitidas"] ?? 0),
        "pagos_totales" => (int) ($resumen["pagos_totales"] ?? 0)
    ],
    "pagos_por_estado" => $pagosPorEstado,
    "pagos_por_metodo" => $pagosPorMetodo,
    "ingresos_mensuales" => $ingresosMensuales,
    "top_paquetes" => $topPaquetes,
    "ultimos_pagos" => $ultimosPagos,
    "facturas" => $facturas
]);

?>

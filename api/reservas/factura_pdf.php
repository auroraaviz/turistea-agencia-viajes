<?php
/**
 * /api/reservas/factura_pdf.php
 *
 * Genera y devuelve un PDF de factura/confirmación para una reserva.
 *
 * USO:
 *   GET /api/reservas/factura_pdf.php?reserva_id=123
 *
 * RESPUESTA:
 *   - 200: PDF inline o descarga directa (Content-Type: application/pdf)
 *   - 401/404/500: JSON con error
 *
 * TODO (siguiente dev):
 *   - Llamar a este endpoint desde el perfil del usuario cuando pulse
 *     "Descargar factura" en la sección de "Mis reservas".
 *   - Ejemplo de llamada desde JS:
 *     window.open(`/api/reservas/factura_pdf.php?reserva_id=${id}`, '_blank');
 */

require_once __DIR__ . '/../config/bd.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../lib/FPDF/fpdf.php';

// ── Validación de sesión ──────────────────────────────────────────────────

if (!esModoDev() && empty($_SESSION['usuario_id'])) {
    header('Content-Type: application/json');
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit;
}

$usuarioId = !empty($_SESSION['usuario_id']) ? (int) $_SESSION['usuario_id'] : 1;

// ── Parámetro de entrada ──────────────────────────────────────────────────

$reservaId = (int) ($_GET['reserva_id'] ?? 0);
if ($reservaId <= 0) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['error' => 'reserva_id es obligatorio']);
    exit;
}

// ── Consultar datos de la reserva + usuario + paquete + pago ──────────────

$stmt = $conexion->prepare("
    SELECT
        r.id AS reserva_id,
        r.num_viajeros,
        r.precio_total,
        r.estado       AS reserva_estado,
        r.fecha_reserva,

        u.id AS usuario_id,
        u.nombre       AS usuario_nombre,
        u.apellidos    AS usuario_apellidos,
        u.email        AS usuario_email,
        u.telefono     AS usuario_telefono,

        p.titulo       AS paquete_titulo,
        p.descripcion  AS paquete_descripcion,
        p.destino,
        p.hotel_nombre,
        p.hotel_estrellas,
        p.hotel_regimen,
        p.hotel_detalles,
        p.fecha_salida,
        p.fecha_regreso,
        p.precio       AS precio_por_persona,
        p.descuento,
        p.vuelo_incluido,
        p.salida_desde,
        p.categoria,
        DATEDIFF(p.fecha_regreso, p.fecha_salida) AS noches,

        pg.metodo      AS pago_metodo,
        pg.estado      AS pago_estado,
        pg.referencia_externa,
        pg.fecha_pago
    FROM reserva r
    LEFT JOIN usuario u  ON u.id  = r.usuario_id
    LEFT JOIN paquete p  ON p.id  = r.paquete_id
    LEFT JOIN pago    pg ON pg.reserva_id = r.id
    WHERE r.id = ?
    LIMIT 1
");
$stmt->bind_param('i', $reservaId);
$stmt->execute();
$datos = $stmt->get_result()->fetch_assoc();

if (!$datos) {
    header('Content-Type: application/json');
    http_response_code(404);
    echo json_encode(['error' => 'Reserva no encontrada']);
    exit;
}

// Verificar que la reserva pertenece al usuario (salvo admin o modo dev)
$esAdmin = ($_SESSION['rol'] ?? '') === 'admin';
if (!esModoDev() && !$esAdmin && (int) $datos['usuario_id'] !== $usuarioId) {
    header('Content-Type: application/json');
    http_response_code(403);
    echo json_encode(['error' => 'No tienes permiso para ver esta factura']);
    exit;
}

// ── Consultar viajeros de la reserva ──────────────────────────────────────

$stmtViajeros = $conexion->prepare("
    SELECT nombre, apellidos, dni, fecha_nacimiento
    FROM viajero
    WHERE reserva_id = ?
    ORDER BY id ASC
");
$stmtViajeros->bind_param('i', $reservaId);
$stmtViajeros->execute();
$viajeros = $stmtViajeros->get_result()->fetch_all(MYSQLI_ASSOC);

// ── Consultar excursiones del paquete ─────────────────────────────────────

$stmtExc = $conexion->prepare("
    SELECT nombre, descripcion, fecha_hora, precio
    FROM excursion
    WHERE paquete_id = (SELECT paquete_id FROM reserva WHERE id = ?)
    ORDER BY fecha_hora ASC
");
$stmtExc->bind_param('i', $reservaId);
$stmtExc->execute();
$excursiones = $stmtExc->get_result()->fetch_all(MYSQLI_ASSOC);

// ── Cálculos ──────────────────────────────────────────────────────────────

$precioPersona     = (float) $datos['precio_por_persona'];
$descuentoPct      = (float) $datos['descuento'];
$precioConDto      = $precioPersona * (1 - $descuentoPct / 100);
$numViajeros       = (int) $datos['num_viajeros'];
$subtotalPaquete   = $precioConDto * $numViajeros;
$totalExcursiones  = 0;
foreach ($excursiones as $exc) {
    $totalExcursiones += (float) $exc['precio'] * $numViajeros;
}
$precioTotal = $subtotalPaquete + $totalExcursiones;
$noches      = (int) $datos['noches'];
$referencia  = $datos['referencia_externa'] ?? ('TUR-' . date('Y') . '-' . $reservaId);

// ── Helpers ───────────────────────────────────────────────────────────────

function t($text) {
    return iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
}

// ── Clase PDF con header y footer ─────────────────────────────────────────

class FacturaPDF extends FPDF
{
    public $refFactura = '';
    public $fechaPago  = '';

    function Header()
    {
        $logoPath = __DIR__ . '/../../frontend/assets/img/Turistea_Logo/logo_turistea.png';
        if (file_exists($logoPath)) {
            $this->Image($logoPath, 10, 8, 30);
        }

        $this->SetFont('Helvetica', 'B', 10);
        $this->SetTextColor(120, 120, 120);
        $this->SetXY(140, 10);
        $this->Cell(60, 6, 'Factura #' . $this->refFactura, 0, 1, 'R');
        $this->SetXY(140, 16);
        $this->SetFont('Helvetica', '', 9);
        $this->Cell(60, 6, 'Fecha: ' . substr($this->fechaPago, 0, 10), 0, 1, 'R');

        $this->SetY(38);
    }

    function Footer()
    {
        $this->SetY(-25);
        $this->SetDrawColor(0, 150, 136);
        $this->SetLineWidth(0.8);
        $this->Line(10, $this->GetY(), 200, $this->GetY());
        $this->Ln(4);
        $this->SetFont('Helvetica', 'I', 8);
        $this->SetTextColor(160, 160, 160);
        $this->Cell(0, 5, t('Este documento sirve como comprobante de su reserva.'), 0, 1, 'C');
        $this->Cell(0, 5, 'turistea@test.com | www.turistea.com', 0, 1, 'C');
        $this->Cell(0, 5, t('© ' . date('Y') . ' Turistea - Todos los derechos reservados'), 0, 1, 'C');
    }

    function seccionTitulo($titulo)
    {
        $this->SetFont('Helvetica', 'B', 13);
        $this->SetTextColor(0, 150, 136);
        $this->Cell(0, 10, t($titulo), 0, 1, 'L');
        $this->SetDrawColor(0, 150, 136);
        $this->SetLineWidth(0.5);
        $this->Line(10, $this->GetY(), 200, $this->GetY());
        $this->Ln(4);
    }

    function campo($etiqueta, $valor, $ancho = 45)
    {
        $this->SetFont('Helvetica', 'B', 10);
        $this->SetTextColor(50, 50, 50);
        $this->Cell($ancho, 7, t($etiqueta), 0, 0);
        $this->SetFont('Helvetica', '', 10);
        $this->Cell(0, 7, t($valor), 0, 1);
    }
}

// ── Generar el PDF ────────────────────────────────────────────────────────

$pdf = new FacturaPDF();
$pdf->refFactura = $reservaId;
$pdf->fechaPago  = $datos['fecha_pago'] ?? $datos['fecha_reserva'];
$pdf->AddPage();
$pdf->SetAutoPageBreak(true, 30);

// — Título —
$pdf->SetFont('Helvetica', 'B', 20);
$pdf->SetTextColor(0, 150, 136);
$pdf->Cell(0, 12, t('Confirmación de Reserva'), 0, 1, 'C');
$pdf->Ln(2);
$pdf->SetDrawColor(0, 150, 136);
$pdf->SetLineWidth(1);
$pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
$pdf->Ln(6);

// — Saludo —
$nombreCompleto = $datos['usuario_nombre'] . ' ' . $datos['usuario_apellidos'];
$pdf->SetFont('Helvetica', '', 11);
$pdf->SetTextColor(50, 50, 50);
$pdf->MultiCell(0, 7, t(
    "Estimado/a $nombreCompleto,\n" .
    "Gracias por reservar con Turistea. A continuación encontrarás " .
    "los detalles de tu reserva y todo lo que incluye tu paquete."
));
$pdf->Ln(4);

// — Datos del cliente —
$pdf->seccionTitulo('Datos del cliente');
$pdf->campo('Nombre:', $nombreCompleto);
$pdf->campo('Email:', $datos['usuario_email']);
$pdf->campo('Teléfono:', $datos['usuario_telefono'] ?? 'No registrado');
$pdf->Ln(4);

// — Detalles del paquete —
$pdf->seccionTitulo('Detalles del paquete');
$pdf->campo('Paquete:', $datos['paquete_titulo']);
$pdf->campo('Destino:', $datos['destino']);
$pdf->campo('Descripción:', '');
$pdf->SetFont('Helvetica', '', 9);
$pdf->SetTextColor(50, 50, 50);
$pdf->MultiCell(0, 6, t($datos['paquete_descripcion']));
$pdf->Ln(2);
$pdf->campo('Fecha de salida:', $datos['fecha_salida']);
$pdf->campo('Fecha de regreso:', $datos['fecha_regreso']);
$pdf->campo('Noches:', (string) $noches);
$pdf->Ln(4);

// — Vuelo (solo si incluido) —
if ($datos['vuelo_incluido']) {
    $pdf->seccionTitulo('Información de vuelo');
    $pdf->campo('Vuelo incluido:', 'Sí');
    $pdf->campo('Salida desde:', $datos['salida_desde'] ?? 'Por confirmar');
    $pdf->campo('Fecha ida:', $datos['fecha_salida']);
    $pdf->campo('Fecha vuelta:', $datos['fecha_regreso']);
    $pdf->Ln(4);
}

// — Alojamiento —
$pdf->seccionTitulo('Alojamiento');
$estrellas = str_repeat('*', (int) $datos['hotel_estrellas']);
$pdf->campo('Hotel:', $datos['hotel_nombre'] . ' (' . $estrellas . ')');
$pdf->campo('Régimen:', $datos['hotel_regimen']);
if (!empty($datos['hotel_detalles'])) {
    $pdf->campo('Servicios:', '');
    $pdf->SetFont('Helvetica', '', 9);
    $pdf->MultiCell(0, 6, t($datos['hotel_detalles']));
}
$pdf->Ln(4);

// — Excursiones —
if (!empty($excursiones)) {
    $pdf->seccionTitulo('Excursiones incluidas');
    $i = 1;
    foreach ($excursiones as $exc) {
        $pdf->SetFont('Helvetica', 'B', 10);
        $pdf->SetTextColor(50, 50, 50);
        $pdf->Cell(0, 7, t($i . '. ' . $exc['nombre']), 0, 1);
        $pdf->SetFont('Helvetica', '', 9);
        $pdf->SetTextColor(120, 120, 120);
        $pdf->Cell(0, 6, t('   ' . $exc['descripcion']), 0, 1);
        $fechaExc = $exc['fecha_hora'] ? date('d/m/Y H:i', strtotime($exc['fecha_hora'])) : 'Por confirmar';
        $pdf->Cell(0, 6, t('   Fecha: ' . $fechaExc . '  |  Precio: ' . number_format($exc['precio'], 2) . ' EUR/persona'), 0, 1);
        $pdf->Ln(2);
        $i++;
    }
    $pdf->Ln(2);
}

// — Viajeros —
if (!empty($viajeros)) {
    $pdf->seccionTitulo('Viajeros');
    $i = 1;
    foreach ($viajeros as $v) {
        $pdf->SetFont('Helvetica', 'B', 10);
        $pdf->SetTextColor(50, 50, 50);
        $pdf->Cell(0, 7, t('Viajero ' . $i . ': ' . $v['nombre'] . ' ' . $v['apellidos']), 0, 1);
        $pdf->SetFont('Helvetica', '', 9);
        $pdf->SetTextColor(120, 120, 120);
        $pdf->Cell(0, 6, t('   DNI: ' . $v['dni'] . '  |  Nacimiento: ' . $v['fecha_nacimiento']), 0, 1);
        $pdf->Ln(2);
        $i++;
    }
    $pdf->Ln(2);
}

// — Resumen económico (tabla) —
$pdf->seccionTitulo('Resumen económico');

// Cabecera de tabla
$pdf->SetFillColor(0, 150, 136);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetFont('Helvetica', 'B', 10);
$pdf->Cell(100, 8, '  Concepto', 0, 0, 'L', true);
$pdf->Cell(30, 8, 'Ud.', 0, 0, 'C', true);
$pdf->Cell(30, 8, 'Precio/ud.', 0, 0, 'R', true);
$pdf->Cell(30, 8, 'Total', 0, 1, 'R', true);

// Fila paquete
$pdf->SetFillColor(240, 248, 247);
$pdf->SetTextColor(50, 50, 50);
$pdf->SetFont('Helvetica', '', 10);
$pdf->Cell(100, 8, t('  ' . $datos['paquete_titulo']), 0, 0, 'L', true);
$pdf->Cell(30, 8, (string) $numViajeros, 0, 0, 'C', true);
$pdf->Cell(30, 8, number_format($precioConDto, 2) . ' EUR', 0, 0, 'R', true);
$pdf->Cell(30, 8, number_format($subtotalPaquete, 2) . ' EUR', 0, 1, 'R', true);

if ($descuentoPct > 0) {
    $pdf->SetFont('Helvetica', 'I', 9);
    $pdf->SetTextColor(120, 120, 120);
    $pdf->Cell(100, 6, t('    (Precio original: ' . number_format($precioPersona, 2) . ' EUR - ' . (int) $descuentoPct . '% dto.)'), 0, 1);
}

// Filas excursiones
$pdf->SetTextColor(50, 50, 50);
$pdf->SetFont('Helvetica', '', 10);
foreach ($excursiones as $exc) {
    $precioExc = (float) $exc['precio'];
    $pdf->SetFillColor(255, 255, 255);
    $pdf->Cell(100, 8, t('  Excursión: ' . $exc['nombre']), 0, 0, 'L', true);
    $pdf->Cell(30, 8, (string) $numViajeros, 0, 0, 'C', true);
    $pdf->Cell(30, 8, number_format($precioExc, 2) . ' EUR', 0, 0, 'R', true);
    $pdf->Cell(30, 8, number_format($precioExc * $numViajeros, 2) . ' EUR', 0, 1, 'R', true);
}

// Línea + Total
$pdf->Ln(2);
$pdf->SetDrawColor(0, 150, 136);
$pdf->SetLineWidth(0.5);
$pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
$pdf->Ln(3);
$pdf->SetFont('Helvetica', 'B', 12);
$pdf->SetTextColor(0, 150, 136);
$pdf->Cell(160, 10, 'TOTAL:', 0, 0, 'R');
$pdf->Cell(30, 10, number_format($precioTotal, 2) . ' EUR', 0, 1, 'R');
$pdf->Ln(2);

// — Información de pago —
$pdf->seccionTitulo('Información de pago');
$pdf->campo('Método de pago:', $datos['pago_metodo'] ?? 'No registrado');
$pdf->campo('Estado:', $datos['pago_estado'] ?? 'PENDIENTE');
$pdf->campo('Referencia:', $referencia);
$pdf->campo('Fecha de pago:', $datos['fecha_pago'] ?? 'Pendiente');
$pdf->campo('Estado reserva:', $datos['reserva_estado']);
$pdf->Ln(6);

// — Despedida —
$pdf->SetFont('Helvetica', '', 11);
$pdf->SetTextColor(50, 50, 50);
$pdf->MultiCell(0, 7, t(
    'Gracias por confiar en Turistea. ' .
    '¡Estamos deseando ayudarte a disfrutar de tu próxima aventura!'
));
$pdf->Ln(4);
$pdf->SetFont('Helvetica', 'B', 11);
$pdf->Cell(0, 7, 'El equipo de Turistea', 0, 1, 'L');

// ── Enviar PDF al navegador ───────────────────────────────────────────────

$nombreArchivo = 'Turistea_Factura_' . $reservaId . '.pdf';
$modoSalida = ($_GET['vista'] ?? '') === 'inline' ? 'I' : 'D';
$pdf->Output($modoSalida, $nombreArchivo); // I = ver en navegador, D = descarga directa

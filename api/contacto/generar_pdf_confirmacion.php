<?php
require_once __DIR__ . '/../lib/FPDF/fpdf.php';

function toISO($text) {
    return iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
}

/**
 * Genera un PDF de confirmación de contacto y lo devuelve como string.
 */
function generarPdfConfirmacion($nombre, $asunto, $mensaje) {
    $pdf = new FPDF();
    $pdf->AddPage();
    $pdf->SetAutoPageBreak(true, 20);

    // Logo en esquina superior izquierda
    $logoPath = __DIR__ . '/../../frontend/assets/img/Turistea_Logo/logo_turistea.png';
    if (file_exists($logoPath)) {
        $pdf->Image($logoPath, 10, 8, 40);
    }

    // Título
    $pdf->SetY(50);
    $pdf->SetFont('Helvetica', 'B', 20);
    $pdf->SetTextColor(0, 150, 136);
    $pdf->Cell(0, 12, toISO('Confirmación de contacto'), 0, 1, 'C');

    // Línea decorativa debajo del título
    $pdf->Ln(2);
    $pdf->SetDrawColor(0, 150, 136);
    $pdf->SetLineWidth(1);
    $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
    $pdf->Ln(8);

    // Saludo
    $pdf->SetFont('Helvetica', '', 12);
    $pdf->SetTextColor(50, 50, 50);
    $pdf->MultiCell(0, 7, toISO("Estimado/a $nombre,"));
    $pdf->Ln(4);

    // Cuerpo del mensaje
    $pdf->MultiCell(0, 7, toISO(
        'Hemos recibido correctamente tu mensaje y queremos agradecerte por ponerte en contacto con nosotros. ' .
        'Tu consulta es muy importante para nuestro equipo.'
    ));
    $pdf->Ln(4);

    $pdf->MultiCell(0, 7, toISO(
        'Nuestro equipo revisará tu solicitud y te responderá a la mayor brevedad posible. ' .
        'El tiempo habitual de respuesta es de 24 a 48 horas laborables.'
    ));
    $pdf->Ln(6);

    // Resumen del mensaje
    $pdf->SetFont('Helvetica', 'B', 13);
    $pdf->SetTextColor(0, 150, 136);
    $pdf->Cell(0, 10, toISO('Resumen de tu consulta'), 0, 1, 'L');

    $pdf->SetDrawColor(0, 150, 136);
    $pdf->SetLineWidth(0.5);
    $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
    $pdf->Ln(4);

    $pdf->SetFont('Helvetica', 'B', 11);
    $pdf->SetTextColor(50, 50, 50);
    $pdf->Cell(30, 7, 'Asunto:', 0, 0);
    $pdf->SetFont('Helvetica', '', 11);
    $pdf->Cell(0, 7, toISO($asunto), 0, 1);

    $pdf->SetFont('Helvetica', 'B', 11);
    $pdf->Cell(30, 7, 'Mensaje:', 0, 1);
    $pdf->SetFont('Helvetica', '', 11);
    $pdf->MultiCell(0, 7, toISO($mensaje));
    $pdf->Ln(6);

    // Despedida
    $pdf->SetFont('Helvetica', '', 12);
    $pdf->SetTextColor(50, 50, 50);
    $pdf->MultiCell(0, 7, toISO(
        'Gracias por confiar en Turistea. ¡Estamos deseando ayudarte a planificar tu próxima aventura!'
    ));
    $pdf->Ln(8);

    $pdf->SetFont('Helvetica', 'B', 12);
    $pdf->Cell(0, 7, 'El equipo de Turistea', 0, 1, 'L');
    $pdf->SetFont('Helvetica', '', 10);
    $pdf->SetTextColor(120, 120, 120);
    $pdf->Cell(0, 6, 'turistea@test.com | www.turistea.com', 0, 1, 'L');

    // Línea decorativa inferior
    $pdf->Ln(6);
    $pdf->SetDrawColor(0, 150, 136);
    $pdf->SetLineWidth(1);
    $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());

    // Footer
    $pdf->Ln(6);
    $pdf->SetFont('Helvetica', 'I', 8);
    $pdf->SetTextColor(160, 160, 160);
    $pdf->Cell(0, 5, toISO('Este es un correo automático. Por favor, no respondas a este documento.'), 0, 1, 'C');
    $pdf->Cell(0, 5, toISO('© ' . date('Y') . ' Turistea - Todos los derechos reservados'), 0, 1, 'C');

    return $pdf->Output('S');
}

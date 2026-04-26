<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

// Cargar PHPMailer
require_once __DIR__ . '/../lib/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../lib/PHPMailer/SMTP.php';
require_once __DIR__ . '/../lib/PHPMailer/Exception.php';

// Cargar configuración SMTP y generador de PDF
require_once __DIR__ . '/../config/smtp.php';
require_once __DIR__ . '/generar_pdf_confirmacion.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Leer datos del formulario
$datos = json_decode(file_get_contents("php://input"), true);

$nombre  = trim($datos['nombre'] ?? '');
$email   = trim($datos['email'] ?? '');
$asunto  = trim($datos['asunto'] ?? 'Consulta desde Turistea');
$mensaje = trim($datos['mensaje'] ?? '');

// Validar campos obligatorios
if (empty($nombre) || empty($email) || empty($mensaje)) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan campos obligatorios: nombre, email y mensaje"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "El email proporcionado no es válido"]);
    exit;
}

// Sanitizar entradas
$nombre  = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
$asunto  = htmlspecialchars($asunto, ENT_QUOTES, 'UTF-8');
$mensaje = htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8');

function configurarSmtp(PHPMailer $mail, array $cfg): void {
    $mail->isSMTP();
    $mail->Host        = $cfg['host'];
    $mail->SMTPAuth    = true;
    $mail->Username    = $cfg['username'];
    $mail->Password    = $cfg['password'];
    $mail->SMTPSecure  = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPAutoTLS = false;
    $mail->Port        = $cfg['port'];
    $mail->CharSet     = 'UTF-8';
}

$logoPath = __DIR__ . '/../../frontend/assets/img/Turistea_Logo/logo_turistea.png';

// ---------- 1) Confirmación al usuario con PDF adjunto (prioritario) ----------
try {
    $mailUsuario = new PHPMailer(true);
    configurarSmtp($mailUsuario, $smtp_config);

    $mailUsuario->setFrom($smtp_config['from'], $smtp_config['fromName']);
    $mailUsuario->addAddress($email, $nombre);

    $pdfContent = generarPdfConfirmacion($nombre, $asunto, $mensaje);
    $mailUsuario->addStringAttachment($pdfContent, 'Confirmacion_Turistea.pdf', PHPMailer::ENCODING_BASE64, 'application/pdf');

    if (file_exists($logoPath)) {
        $mailUsuario->addEmbeddedImage($logoPath, 'logo_turistea', 'logo_turistea.png');
    }

    $mailUsuario->isHTML(true);
    $mailUsuario->Subject = "Turistea - Hemos recibido tu mensaje";
    $mailUsuario->Body = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='text-align: center; padding: 20px;'>
                <img src='cid:logo_turistea' alt='Turistea' style='max-width: 200px;'>
            </div>
            <div style='padding: 20px; color: #333;'>
                <h2 style='color: #009688;'>¡Gracias por contactarnos, $nombre!</h2>
                <p>Hemos recibido tu mensaje correctamente. Nuestro equipo lo revisará y te responderá lo antes posible.</p>
                <p>Adjunto encontrarás un PDF con la confirmación y el resumen de tu consulta.</p>
                <br>
                <p>Un saludo,<br><strong>El equipo de Turistea</strong></p>
            </div>
            <div style='text-align: center; padding: 15px; background-color: #f5f5f5; color: #999; font-size: 12px;'>
                <p>© " . date('Y') . " Turistea - Todos los derechos reservados</p>
            </div>
        </div>
    ";
    $mailUsuario->AltBody = "Hola $nombre, hemos recibido tu mensaje. Adjuntamos un PDF de confirmación. Gracias por contactarnos. - El equipo de Turistea";

    $mailUsuario->send();
} catch (Exception $e) {
    http_response_code(500);
    $detalle = !empty($mailUsuario->ErrorInfo) ? $mailUsuario->ErrorInfo : $e->getMessage();
    echo json_encode(["error" => "No se pudo enviar el correo de confirmación al usuario: " . $detalle]);
    exit;
}

// ---------- 2) Aviso interno a Turistea (no bloqueante) ----------
$avisoEnviado = true;
try {
    $mailInterno = new PHPMailer(true);
    configurarSmtp($mailInterno, $smtp_config);

    $mailInterno->setFrom($smtp_config['from'], $smtp_config['fromName']);
    $mailInterno->addAddress($smtp_config['from']);
    $mailInterno->addReplyTo($email, $nombre);

    $mailInterno->isHTML(true);
    $mailInterno->Subject = "Contacto Turistea: $asunto";
    $mailInterno->Body    = "
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> $nombre</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Asunto:</strong> $asunto</p>
        <hr>
        <p><strong>Mensaje:</strong></p>
        <p>" . nl2br($mensaje) . "</p>
    ";
    $mailInterno->AltBody = "Nombre: $nombre\nEmail: $email\nAsunto: $asunto\nMensaje: $mensaje";

    $mailInterno->send();
} catch (Exception $e) {
    // El aviso interno es secundario: la confirmación al usuario ya se envió.
    error_log('[Turistea/contacto] Aviso interno no enviado: ' . $e->getMessage());
    $avisoEnviado = false;
}

echo json_encode([
    "mensaje" => "Correo enviado correctamente",
    "avisoInterno" => $avisoEnviado,
]);

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

// Cargar configuración SMTP
require_once __DIR__ . '/../config/smtp.php';

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

try {
    $mail = new PHPMailer(true);

    // Configuración SMTP
    $mail->isSMTP();
    $mail->Host       = $smtp_config['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp_config['username'];
    $mail->Password   = $smtp_config['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->SMTPAutoTLS = false;
    $mail->Port       = $smtp_config['port'];
    $mail->CharSet    = 'UTF-8';

    // Remitente y destinatario
    $mail->setFrom($smtp_config['from'], $smtp_config['fromName']);
    $mail->addAddress($smtp_config['from']); // El correo llega a Turistea
    $mail->addReplyTo($email, $nombre);       // Para responder directo al usuario

    // Contenido del correo
    $mail->isHTML(true);
    $mail->Subject = "Contacto Turistea: $asunto";
    $mail->Body    = "
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> $nombre</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Asunto:</strong> $asunto</p>
        <hr>
        <p><strong>Mensaje:</strong></p>
        <p>" . nl2br($mensaje) . "</p>
    ";
    $mail->AltBody = "Nombre: $nombre\nEmail: $email\nAsunto: $asunto\nMensaje: $mensaje";

    $mail->send();

    echo json_encode(["mensaje" => "Correo enviado correctamente"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo enviar el correo: " . $mail->ErrorInfo]);
}

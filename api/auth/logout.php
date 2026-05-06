<?php
/**
 * /api/auth/logout.php
 * POST → Destruye la sesión del usuario actual
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

session_start();

// Limpiar variables de sesión y marcar como deslogueado
$_SESSION = [];
$_SESSION["logged_out"] = true;

// Regenerar para que la nueva sesión persista el flag
session_regenerate_id(true);

// Limpiar cookie de sesión anterior
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

echo json_encode(["ok" => true, "mensaje" => "Sesión cerrada"]);

<?php
/**
 * /api/perfil/get.php
 * GET → Devuelve los datos del usuario logueado.
 * Requiere sesión PHP activa.
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . "/../config/bd.php";    // $conexion (MySQLi)
require_once __DIR__ . "/../config/auth.php";  // requiereLogin() / usuarioEnSesion()

// Verificar sesión — auth.php ya redirige si no hay sesión,
// pero devolvemos JSON si es una petición AJAX
session_start();
if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$id = (int) $_SESSION["usuario_id"];

$sql  = "SELECT id, nombre, apellidos, email, telefono, rol, created_at
         FROM usuario
         WHERE id = ? AND activo = 1
         LIMIT 1";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Usuario no encontrado"]);
    exit;
}

$usuario = $resultado->fetch_assoc();
// No devolver el hash de la contraseña
unset($usuario["password_hash"]);

echo json_encode($usuario);
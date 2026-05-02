<?php
/**
 * /api/perfil/get.php
 * GET → Devuelve los datos del usuario logueado.
 *
 * NOTAS:
 *  - NO llamar session_start() → ya lo hace auth.php
 *  - En modo dev (esModoDev()) devuelve datos de sesión
 *    directamente porque el id=999 no existe en BD
 */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/bd.php";
require_once __DIR__ . "/../config/auth.php";

// Modo desarrollo: devolver los datos que ya tiene la sesión
// sin intentar buscar id=999 en la BD
if (esModoDev()) {
    echo json_encode([
        "id"         => 999,
        "nombre"     => $_SESSION["nombre"]     ?? "Dev",
        "apellidos"  => "",
        "email"      => $_SESSION["email"]      ?? "dev@turistea.com",
        "telefono"   => null,
        "rol"        => $_SESSION["rol"]        ?? "admin",
        "created_at" => date("Y-m-d H:i:s"),
    ]);
    exit;
}

// Producción: verificar sesión
if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$id = (int) $_SESSION["usuario_id"];

$stmt = $conexion->prepare(
    "SELECT id, nombre, apellidos, email, telefono, rol, created_at
     FROM usuario
     WHERE id = ? AND activo = 1
     LIMIT 1"
);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Usuario no encontrado"]);
    exit;
}

echo json_encode($resultado->fetch_assoc());
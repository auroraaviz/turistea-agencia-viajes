<?php
/*
=========================================
API SESSION CHECK
-----------------------------------------
Responsabilidad:
- Devolver datos de sesión actual
- Permite al frontend verificar si el
  usuario está logueado y su rol
- En modo dev devuelve admin sin sesión

Ruta:
/api/auth/session.php
=========================================
*/

require_once(__DIR__ . "/../config/auth.php");

header("Content-Type: application/json");

// Modo desarrollo: simular admin
if (esModoDev()) {
    echo json_encode([
        "ok" => true,
        "email" => "dev@turistea.com",
        "nombre" => "Dev Admin",
        "rol" => "admin"
    ]);
    exit;
}

if (isset($_SESSION['email']) && isset($_SESSION['rol'])) {
    echo json_encode([
        "ok" => true,
        "email" => $_SESSION['email'],
        "nombre" => $_SESSION['nombre'],
        "rol" => $_SESSION['rol']
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "ok" => false,
        "mensaje" => "No hay sesión activa"
    ]);
}

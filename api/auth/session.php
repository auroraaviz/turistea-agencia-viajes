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

// Si el usuario hizo logout explícito, no simular nada
if (!empty($_SESSION['logged_out'])) {
    http_response_code(401);
    echo json_encode(["ok" => false, "mensaje" => "No hay sesión activa"]);
    exit;
}

// Si hay sesión real, usarla siempre (incluso en modo dev)
if (isset($_SESSION['usuario_id']) && isset($_SESSION['email']) && isset($_SESSION['rol'])) {
    echo json_encode([
        "ok" => true,
        "id" => $_SESSION['usuario_id'],
        "email" => $_SESSION['email'],
        "nombre" => $_SESSION['nombre'],
        "rol" => $_SESSION['rol']
    ]);
} else if (esModoDev()) {
    // Modo dev sin sesión real: simular admin
    echo json_encode([
        "ok" => true,
        "id" => 999,
        "email" => "dev@turistea.com",
        "nombre" => "Dev Admin",
        "rol" => "admin"
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "ok" => false,
        "mensaje" => "No hay sesión activa"
    ]);
}

<?php
/*
=========================================
MIDDLEWARE DE AUTENTICACIÓN
-----------------------------------------
Responsabilidad:
- Verificar sesión activa
- Verificar rol de administrador
- Bloquear acceso no autorizado
- En modo dev (IS_DEV=true en .env) se
  salta la verificación

Uso:
  require_once("../config/auth.php");
  verificarAdmin();
=========================================
*/

session_start();

// Cargar .env
function _cargarEnv()
{
    $envPath = __DIR__ . '/../../.env';
    if (file_exists($envPath)) {
        $lineas = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lineas as $linea) {
            $linea = trim($linea);
            if ($linea === '' || $linea[0] === '#')
                continue;
            if (strpos($linea, '=') !== false) {
                list($clave, $valor) = explode('=', $linea, 2);
                $_ENV[trim($clave)] = trim($valor);
            }
        }
    }
}

_cargarEnv();

function esModoDev()
{
    return isset($_ENV['IS_DEV']) && $_ENV['IS_DEV'] === 'true';
}

function verificarSesion()
{
    if (esModoDev())
        return;

    if (!isset($_SESSION['email']) || !isset($_SESSION['rol'])) {
        http_response_code(401);
        echo json_encode([
            "ok" => false,
            "mensaje" => "No has iniciado sesión"
        ]);
        exit;
    }
}

function verificarAdmin()
{
    if (esModoDev())
        return;

    verificarSesion();

    if ($_SESSION['rol'] !== 'admin') {
        http_response_code(403);
        echo json_encode([
            "ok" => false,
            "mensaje" => "Acceso denegado: se requiere rol de administrador"
        ]);
        exit;
    }
}

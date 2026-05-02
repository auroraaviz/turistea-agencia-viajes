<?php
/**
 * /api/favoritos/estado.php
 * GET → Comprueba si un paquete es favorito del usuario logueado.
 * Query param: ?paquete_id=5
 * Devuelve: { "es_favorito": true/false }
 */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/bd.php";
require_once __DIR__ . "/../config/auth.php";

// Modo dev: siempre devolver false (no es favorito)
if (esModoDev()) {
    echo json_encode(["es_favorito" => false]);
    exit;
}

if (empty($_SESSION["usuario_id"])) {
    // No autenticado → simplemente no es favorito, no bloqueamos la página
    echo json_encode(["es_favorito" => false]);
    exit;
}

$paqueteId = (int) ($_GET["paquete_id"] ?? 0);

if ($paqueteId <= 0) {
    echo json_encode(["es_favorito" => false]);
    exit;
}

$usuarioId = (int) $_SESSION["usuario_id"];

$stmt = $conexion->prepare(
    "SELECT id FROM favorito WHERE usuario_id = ? AND paquete_id = ? LIMIT 1"
);
$stmt->bind_param("ii", $usuarioId, $paqueteId);
$stmt->execute();
$stmt->store_result();

echo json_encode(["es_favorito" => $stmt->num_rows > 0]);
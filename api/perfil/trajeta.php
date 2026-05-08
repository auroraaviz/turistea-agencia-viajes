<?php
/**
 * /api/perfil/tarjeta.php
 * GET → Devuelve la tarjeta guardada del usuario logueado.
 * Si no tiene tarjeta devuelve { "tarjeta": null }
 */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/bd.php";
require_once __DIR__ . "/../config/auth.php";

if (esModoDev()) {
    echo json_encode(["tarjeta" => null]);
    exit;
}

if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$id = (int) $_SESSION["usuario_id"];

$stmt = $conexion->prepare(
    "SELECT id, titular, ultimos_4, vencimiento
     FROM tarjeta_credito
     WHERE usuario_id = ?
     ORDER BY created_at DESC
     LIMIT 1"
);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    echo json_encode(["tarjeta" => null]);
    exit;
}

echo json_encode(["tarjeta" => $resultado->fetch_assoc()]);
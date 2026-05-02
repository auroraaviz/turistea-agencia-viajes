<?php
/**
 * /api/perfil/favoritos.php
 * GET → Devuelve los paquetes guardados como favoritos del usuario logueado.
 *
 * NOTAS:
 *  - NO llamar session_start() → ya lo hace auth.php
 *  - En modo dev devuelve array vacío
 */

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/bd.php";
require_once __DIR__ . "/../config/auth.php";

if (esModoDev()) {
    echo json_encode([]);
    exit;
}

if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$id = (int) $_SESSION["usuario_id"];

$stmt = $conexion->prepare(
    "SELECT
        f.paquete_id,
        f.agregado_at,
        p.titulo   AS nombre,
        p.imagen,
        p.destino,
        p.precio
     FROM favorito f
     JOIN paquete p ON p.id = f.paquete_id
     WHERE f.usuario_id = ?
     ORDER BY f.agregado_at DESC"
);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

$favoritos = [];
while ($fila = $resultado->fetch_assoc()) {
    $favoritos[] = $fila;
}

echo json_encode($favoritos);
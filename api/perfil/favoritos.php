<?php
/**
 * /api/perfil/favoritos.php
 * GET → Devuelve los paquetes guardados como favoritos
 *       por el usuario logueado.
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . "/../config/bd.php";

session_start();
if (empty($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$id = (int) $_SESSION["usuario_id"];

$sql = "SELECT
            f.paquete_id,
            f.agregado_at,
            p.nombre,
            p.imagen,
            p.destino,
            p.precio
        FROM favorito f
        JOIN paquete p ON p.id = f.paquete_id
        WHERE f.usuario_id = ?
        ORDER BY f.agregado_at DESC";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

$favoritos = [];
while ($fila = $resultado->fetch_assoc()) {
    $favoritos[] = $fila;
}

echo json_encode($favoritos);
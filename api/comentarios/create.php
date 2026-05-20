<?php

/*
=========================================
API CREATE COMENTARIO (EXPERIENCIA)
-----------------------------------------
Responsabilidad:
- Recibir datos desde frontend
- Validar que el usuario tiene reserva
  CONFIRMADA en ese paquete
- Insertar comentario en BD

Ruta:
/api/comentarios/create.php

TODO: Falta implementar:
- Subida de foto
=========================================
*/

header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once("../config/auth.php");
verificarSesion();

require_once("../config/bd.php");


// =========================================
// LEER DATOS
// =========================================
$data = $_SERVER["CONTENT_TYPE"] ?? "";
$data = strpos($data, "multipart/form-data") !== false
    ? $_POST
    : json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "No se recibieron datos"
    ]);
    exit;
}


// =========================================
// VARIABLES
// =========================================
$usuario_id = $_SESSION["usuario_id"] ?? null;
$paquete_id = (int) ($data["paquete_id"] ?? 0);
$titulo_viaje = trim($data["titulo_viaje"] ?? "");
$comentario = trim($data["comentario"] ?? "");
$valoracion_viaje = (int) ($data["valoracion_viaje"] ?? 0);
$valoracion_compania = (int) ($data["valoracion_compania"] ?? 0);


// =========================================
// VALIDACIONES
// =========================================
if (!$usuario_id) {
    echo json_encode(["ok" => false, "mensaje" => "Usuario no identificado"]);
    exit;
}

if ($paquete_id <= 0) {
    echo json_encode(["ok" => false, "mensaje" => "Paquete no válido"]);
    exit;
}

if ($titulo_viaje === "" || $comentario === "") {
    echo json_encode(["ok" => false, "mensaje" => "Título y comentario son obligatorios"]);
    exit;
}

if ($valoracion_viaje < 1 || $valoracion_viaje > 5 || $valoracion_compania < 1 || $valoracion_compania > 5) {
    echo json_encode(["ok" => false, "mensaje" => "Las valoraciones deben estar entre 1 y 5"]);
    exit;
}


// =========================================
// VERIFICAR QUE EL USUARIO TIENE RESERVA
// CONFIRMADA EN ESE PAQUETE
// =========================================
$stmt = $conexion->prepare("
    SELECT id FROM reserva
    WHERE usuario_id = ? AND paquete_id = ? AND estado = 'CONFIRMADA'
    LIMIT 1
");
$stmt->bind_param("ii", $usuario_id, $paquete_id);
$stmt->execute();
$reserva = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$reserva) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Solo puedes compartir tu experiencia en viajes que hayas realizado"
    ]);
    exit;
}


// =========================================
// TODO: SUBIDA DE FOTO
// =========================================
$foto_url = null;


// =========================================
// INSERT
// =========================================
$stmt = $conexion->prepare("
    INSERT INTO comentario (usuario_id, paquete_id, titulo_viaje, comentario, foto_url, valoracion_viaje, valoracion_compania)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

if (!$stmt) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error prepare",
        "error" => $conexion->error
    ]);
    exit;
}

$stmt->bind_param(
    "iisssis",
    $usuario_id,
    $paquete_id,
    $titulo_viaje,
    $comentario,
    $foto_url,
    $valoracion_viaje,
    $valoracion_compania
);

if ($stmt->execute()) {
    echo json_encode([
        "ok" => true,
        "mensaje" => "Experiencia compartida correctamente",
        "id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al guardar la experiencia",
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conexion->close();
?>
<?php
/*
=========================================
ELIMINAR PAQUETE
-----------------------------------------
Responsabilidad:
- Recibir id por JSON
- Validar id
- Borrar registro BD
- Devolver respuesta JSON
=========================================
*/

header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once("../config/auth.php");
verificarAdmin();

require_once("../config/bd.php");


// LEER JSON
$data = json_decode(
    file_get_contents("php://input"),
    true
);


// VALIDAR ID
if (!$data || !isset($data["id"])) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Falta id"
    ]);

    exit;
}


$id = (int) $data["id"];


// PREPARE
$stmt = $conexion->prepare("
    DELETE FROM paquete
    WHERE id = ?
");


// COMPROBAR PREPARE
if (!$stmt) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error prepare",
        "error" => $conexion->error
    ]);

    exit;
}


// BIND
$stmt->bind_param("i", $id);


// EJECUTAR
if ($stmt->execute()) {

    echo json_encode([
        "ok" => true,
        "mensaje" => "Paquete eliminado"
    ]);

} else {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al borrar",
        "error" => $stmt->error
    ]);

}


// CERRAR
$stmt->close();
$conexion->close();

?>
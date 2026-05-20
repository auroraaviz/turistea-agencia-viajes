<?php

/*
=========================================
API GET COMENTARIOS (EXPERIENCIAS)
-----------------------------------------
Responsabilidad:
- Devolver comentarios/experiencias de un paquete
- Incluye datos del usuario autor

Ruta:
/api/comentarios/get.php?paquete_id=3
=========================================
*/

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once("../config/bd.php");


if (isset($_GET['paquete_id'])) {

    $paquete_id = (int) $_GET['paquete_id'];

    $stmt = $conexion->prepare("
        SELECT c.*, u.nombre AS autor_nombre, u.foto_perfil AS autor_foto
        FROM comentario c
        JOIN usuario u ON c.usuario_id = u.id
        WHERE c.paquete_id = ?
        ORDER BY c.creado_at DESC
    ");
    $stmt->bind_param("i", $paquete_id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));
    $stmt->close();

} else {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Se requiere paquete_id"
    ]);
}

$conexion->close();
?>
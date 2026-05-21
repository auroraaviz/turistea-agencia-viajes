<?php

/*
=========================================
API GET COMENTARIOS (EXPERIENCIAS)
-----------------------------------------
Responsabilidad:
- Devolver comentarios/experiencias
- Incluye datos del usuario autor y del paquete

Rutas:
/api/comentarios/get.php?paquete_id=3   → de un paquete
/api/comentarios/get.php                → todos
=========================================
*/

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once("../config/bd.php");


if (isset($_GET['paquete_id'])) {

    $paquete_id = (int) $_GET['paquete_id'];

    $stmt = $conexion->prepare("
        SELECT c.*, u.nombre AS autor_nombre, u.foto_perfil AS autor_foto,
               p.titulo AS nombre_paquete, p.destino
        FROM comentario c
        JOIN usuario u ON c.usuario_id = u.id
        LEFT JOIN paquete p ON c.paquete_id = p.id
        WHERE c.paquete_id = ?
        ORDER BY c.creado_at DESC
    ");
    $stmt->bind_param("i", $paquete_id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));
    $stmt->close();

} else {

    // Devolver todos los comentarios
    $resultado = $conexion->query("
        SELECT c.*, u.nombre AS autor_nombre, u.foto_perfil AS autor_foto,
               p.titulo AS nombre_paquete, p.destino
        FROM comentario c
        JOIN usuario u ON c.usuario_id = u.id
        LEFT JOIN paquete p ON c.paquete_id = p.id
        ORDER BY c.creado_at DESC
    ");

    echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));
}

$conexion->close();
?>
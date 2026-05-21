<?php

/*
=========================================
API GET COMENTARIOS (EXPERIENCIAS)
-----------------------------------------
Responsabilidad:
- Devolver comentarios/experiencias
- Si recibe paquete_id, filtra por paquete
- Incluye datos del usuario autor

Ruta:
/api/comentarios/get.php?paquete_id=3
/api/comentarios/get.php
=========================================
*/

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once("../config/bd.php");


$select = "
    SELECT
        c.*,
        u.nombre AS autor_nombre,
        u.foto_perfil AS autor_foto,
        p.titulo AS paquete_titulo,
        p.destino AS paquete_destino,
        p.imagen AS paquete_imagen
    FROM comentario c
    JOIN usuario u ON c.usuario_id = u.id
    LEFT JOIN paquete p ON c.paquete_id = p.id
";

if (isset($_GET['paquete_id'])) {
    $paquete_id = (int) $_GET['paquete_id'];

    $stmt = $conexion->prepare($select . "
        WHERE c.paquete_id = ?
        ORDER BY c.creado_at DESC
    ");
    $stmt->bind_param("i", $paquete_id);
} else {
    $stmt = $conexion->prepare($select . "
        ORDER BY c.creado_at DESC
    ");
}

$stmt->execute();
$resultado = $stmt->get_result();

echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));
$stmt->close();

$conexion->close();
?>

<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once("../config/bd.php");

//si viene id devuelve un usuario concreto
if (isset($_GET['id'])) {

    $id = (int) $_GET['id'];

    $resultado = $conexion->query("
    SELECT id, nombre, apellidos, email, telefono, foto_perfil, rol, activo, created_at
    FROM usuario
    WHERE id = $id
    ");

    $usuario = $resultado->fetch_assoc();

    echo json_encode($usuario);

} else {

    //Filtros opcionales GET
    $where = [];
    $params = [];

    //Filtro por rol
    if (!empty($_GET['rol'])) {
        $rol = $conexion->real_escape_string($_GET['rol']);
        $where[] = "rol = '$rol'";
    }

    //filtro por activo
    if (isset($_GET['activo']) && $_GET['activo'] !== '') {
        $activo = (int) $_GET['activo'];
        $where[] = "activo = $activo";
    }

    //búsqueda por nombre, apellidos o emial.
    if (!empty($_GET['q'])) {
        $q = $conexion->real_escape_string($_GET['q']);
        $where[] = "(nombre LIKE '%$q%' OR apellidos LIKE '%$q%' OR email LIKE '%$q%')";
    }

    $sql = "
        SELECT id, nombre, apellidos, email, telefono, foto_perfil, rol, activo, created_at
        FROM usuario
    ";

    //No devolver nunca pashword al front
    if (!empty($where)) {
        $sql .= " WHERE " . implode(" AND ", $where);
    }

    $sql .= " ORDER BY created_at DESC";

    $resultado = $conexion->query($sql);

    echo json_encode($resultado->fetch_all(MYSQLI_ASSOC));
}
?>
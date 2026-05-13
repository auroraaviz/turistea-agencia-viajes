<?php

/*
=========================================
API CREATE PAQUETES
-----------------------------------------
Responsabilidad:
- Recibir datos JSON desde frontend
- Insertar nuevo paquete en BD
- Devolver respuesta JSON

Ruta:
/api/paquetes/create.php
=========================================
*/


header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Permitir preflight CORS sin auth
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once("../config/auth.php");
verificarAdmin();

require_once("../config/bd.php");

function guardarImagenSubida($campo, $subcarpeta, $defecto)
{
    if (
        !isset($_FILES[$campo]) ||
        $_FILES[$campo]["error"] === UPLOAD_ERR_NO_FILE
    ) {
        return $defecto;
    }

    if ($_FILES[$campo]["error"] !== UPLOAD_ERR_OK) {
        echo json_encode([
            "ok" => false,
            "mensaje" => mensajeErrorSubida($_FILES[$campo]["error"])
        ]);
        exit;
    }

    $permitidos = [
        "image/jpeg" => "jpg",
        "image/png" => "png",
        "image/webp" => "webp",
        "image/gif" => "gif"
    ];

    $mime = mime_content_type($_FILES[$campo]["tmp_name"]);
    if (!isset($permitidos[$mime])) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "Formato de imagen no permitido"
        ]);
        exit;
    }

    if ($_FILES[$campo]["size"] > 2 * 1024 * 1024) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "La imagen supera el tamaño máximo de 2MB"
        ]);
        exit;
    }

    $directorio = __DIR__ . "/../../frontend/assets/img/" . $subcarpeta;
    if (!is_dir($directorio)) {
        mkdir($directorio, 0775, true);
    }

    if (!is_writable($directorio)) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "La carpeta de imágenes no tiene permisos de escritura"
        ]);
        exit;
    }

    $nombre = uniqid($campo . "_", true) . "." . $permitidos[$mime];
    $destino = $directorio . $nombre;

    if (!move_uploaded_file($_FILES[$campo]["tmp_name"], $destino)) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo guardar la imagen en el servidor"
        ]);
        exit;
    }

    return "assets/img/" . $subcarpeta . $nombre;
}

function mensajeErrorSubida($codigo)
{
    $mensajes = [
        UPLOAD_ERR_INI_SIZE => "La imagen supera el tamaño permitido por PHP",
        UPLOAD_ERR_FORM_SIZE => "La imagen supera el tamaño permitido por el formulario",
        UPLOAD_ERR_PARTIAL => "La imagen se subió solo parcialmente",
        UPLOAD_ERR_NO_TMP_DIR => "Falta la carpeta temporal de subida",
        UPLOAD_ERR_CANT_WRITE => "No se pudo escribir la imagen en disco",
        UPLOAD_ERR_EXTENSION => "Una extensión de PHP bloqueó la subida"
    ];

    return $mensajes[$codigo] ?? "Error al subir la imagen";
}


// =========================================
// LEER DATOS
// =========================================
$data = $_SERVER["CONTENT_TYPE"] ?? "";
$data = strpos($data, "multipart/form-data") !== false
    ? $_POST
    : json_decode(file_get_contents("php://input"), true);


// =========================================
// VALIDAR DATOS
// =========================================
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
$titulo = $data["titulo"] ?? "";
$destino = $data["destino"] ?? "";
$descripcion = $data["descripcion"] ?? "";
$imagen = guardarImagenSubida(
    "imagen_archivo",
    "",
    $data["imagen"] ?? "assets/img/default.jpg"
);

$hotel_nombre = $data["hotel_nombre"] ?? "";
$hotel_estrellas = (int) ($data["hotel_estrellas"] ?? 3);
$hotel_regimen = $data["hotel_regimen"] ?? "";
$hotel_detalles = $data["hotel_detalles"] ?? "";
$hotel_imagen = guardarImagenSubida(
    "hotel_imagen_archivo",
    "hoteles/",
    $data["hotel_imagen"] ?? "assets/img/hoteles/default.jpg"
);

$fecha_salida = $data["fecha_salida"] ?? null;
$fecha_regreso = $data["fecha_regreso"] ?? null;

$precio = (float) ($data["precio"] ?? 0);
$descuento = (float) ($data["descuento"] ?? 0);

$plazas_totales = (int) ($data["plazas_totales"] ?? 0);
$plazas_disponibles = (int) ($data["plazas_disponibles"] ?? 0);

$activo = (int) ($data["activo"] ?? 1);
$vuelo_incluido = (int) ($data["vuelo_incluido"] ?? 0);

$salida_desde = $data["salida_desde"] ?? "";

$cerca_playa = (int) ($data["cerca_playa"] ?? 0);

$categoria = $data["categoria"] ?? "vacaciones";


// =========================================
// VALIDAR CATEGORÍA
// =========================================
$validas = [
    "vuelo",
    "vacaciones",
    "fin_de_semana",
    "verano"
];

if (!in_array($categoria, $validas)) {
    $categoria = "vacaciones";
}


// =========================================
// PREPARE INSERT
// =========================================
$stmt = $conexion->prepare("
    INSERT INTO paquete (

        titulo,
        destino,
        descripcion,
        imagen,

        hotel_nombre,
        hotel_estrellas,
        hotel_regimen,
        hotel_detalles,
        hotel_imagen,

        fecha_salida,
        fecha_regreso,

        precio,
        descuento,

        plazas_totales,
        plazas_disponibles,

        activo,
        vuelo_incluido,

        salida_desde,

        cerca_playa,
        categoria

    ) VALUES (

        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?,
        ?, ?

    )
");


// =========================================
// ERROR PREPARE
// =========================================
if (!$stmt) {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error prepare",
        "error" => $conexion->error
    ]);

    exit;
}


// =========================================
// BIND PARAM
// =========================================
$stmt->bind_param(
    "sssssisssssddiiiisis",

    $titulo,
    $destino,
    $descripcion,
    $imagen,

    $hotel_nombre,
    $hotel_estrellas,
    $hotel_regimen,
    $hotel_detalles,
    $hotel_imagen,

    $fecha_salida,
    $fecha_regreso,

    $precio,
    $descuento,

    $plazas_totales,
    $plazas_disponibles,

    $activo,
    $vuelo_incluido,

    $salida_desde,

    $cerca_playa,
    $categoria
);


// =========================================
// EJECUTAR
// =========================================
if ($stmt->execute()) {

    echo json_encode([
        "ok" => true,
        "mensaje" => "Paquete creado correctamente",
        "id" => $stmt->insert_id,
        "imagen" => $imagen,
        "hotel_imagen" => $hotel_imagen
    ]);

} else {

    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al crear paquete",
        "error" => $stmt->error
    ]);
}


// =========================================
// CERRAR
// =========================================
$stmt->close();
$conexion->close();

?>

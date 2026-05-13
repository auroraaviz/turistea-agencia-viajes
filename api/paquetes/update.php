<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

require_once("../config/auth.php");
verificarAdmin();
require_once("../config/bd.php");

function guardarImagenSubida($campo, $subcarpeta, $rutaActual)
{
    if (
        !isset($_FILES[$campo]) ||
        $_FILES[$campo]["error"] === UPLOAD_ERR_NO_FILE
    ) {
        return $rutaActual;
    }

    if ($_FILES[$campo]["error"] !== UPLOAD_ERR_OK) {
        echo json_encode(["ok" => false, "mensaje" => mensajeErrorSubida($_FILES[$campo]["error"])]);
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
        echo json_encode(["ok" => false, "mensaje" => "Formato de imagen no permitido"]);
        exit;
    }

    if ($_FILES[$campo]["size"] > 2 * 1024 * 1024) {
        echo json_encode(["ok" => false, "mensaje" => "La imagen supera el tamaño máximo de 2MB"]);
        exit;
    }

    $directorio = __DIR__ . "/../../frontend/assets/img/" . $subcarpeta;
    if (!is_dir($directorio)) {
        mkdir($directorio, 0775, true);
    }

    if (!is_writable($directorio)) {
        echo json_encode(["ok" => false, "mensaje" => "La carpeta de imágenes no tiene permisos de escritura"]);
        exit;
    }

    $nombre = uniqid($campo . "_", true) . "." . $permitidos[$mime];
    $destino = $directorio . $nombre;

    if (!move_uploaded_file($_FILES[$campo]["tmp_name"], $destino)) {
        echo json_encode(["ok" => false, "mensaje" => "No se pudo guardar la imagen en el servidor"]);
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

$contentType = $_SERVER["CONTENT_TYPE"] ?? "";
$data = strpos($contentType, "multipart/form-data") !== false
    ? $_POST
    : json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["id"])) {
    echo json_encode(["ok" => false, "mensaje" => "Falta el id del paquete"]);
    exit;
}

// ── Variables ─────────────────────────────────────────────────────────
$id = (int) $data["id"];
$titulo = $data["titulo"] ?? "";
$destino = $data["destino"] ?? "";
$descripcion = $data["descripcion"] ?? "";
$imagen = guardarImagenSubida("imagen_archivo", "", $data["imagen"] ?? "");

$hotel_nombre = $data["hotel_nombre"] ?? "";
$hotel_estrellas = (int) ($data["hotel_estrellas"] ?? 0);
$hotel_regimen = $data["hotel_regimen"] ?? "";
$hotel_detalles = $data["hotel_detalles"] ?? "";
$hotel_imagen = guardarImagenSubida("hotel_imagen_archivo", "hoteles/", $data["hotel_imagen"] ?? "");

$fecha_salida = $data["fecha_salida"] ?? null;
$fecha_regreso = $data["fecha_regreso"] ?? null;

$precio = (float) ($data["precio"] ?? 0);
$descuento = (float) ($data["descuento"] ?? 0);

$plazas_totales = (int) ($data["plazas_totales"] ?? 0);
$plazas_disponibles = (int) ($data["plazas_disponibles"] ?? 0);

$activo = (int) ($data["activo"] ?? 0);
$vuelo_incluido = (int) ($data["vuelo_incluido"] ?? 0);
$salida_desde = $data["salida_desde"] ?? "";
$cerca_playa = (int) ($data["cerca_playa"] ?? 0);

$categoria = $data["categoria"] ?? "vacaciones";
if (!in_array($categoria, ["vuelo", "vacaciones", "fin_de_semana", "verano"])) {
    $categoria = "vacaciones";
}

// ── UPDATE ────────────────────────────────────────────────────────────
$stmt = $conexion->prepare("
    UPDATE paquete SET
        titulo              = ?,
        destino             = ?,
        descripcion         = ?,
        imagen              = ?,
        hotel_nombre        = ?,
        hotel_estrellas     = ?,
        hotel_regimen       = ?,
        hotel_detalles      = ?,
        hotel_imagen        = ?,
        fecha_salida        = ?,
        fecha_regreso       = ?,
        precio              = ?,
        descuento           = ?,
        plazas_totales      = ?,
        plazas_disponibles  = ?,
        activo              = ?,
        vuelo_incluido      = ?,
        salida_desde        = ?,
        cerca_playa         = ?,
        categoria           = ?
    WHERE id = ?
");

if (!$stmt) {
    echo json_encode(["ok" => false, "mensaje" => "Error en prepare", "error" => $conexion->error]);
    exit;
}

$stmt->bind_param(
    "sssssisssssddiiiisisi",
    $titulo,            // s
    $destino,           // s
    $descripcion,       // s
    $imagen,            // s
    $hotel_nombre,      // s
    $hotel_estrellas,   // i
    $hotel_regimen,     // s
    $hotel_detalles,    // s
    $hotel_imagen,      // s
    $fecha_salida,      // s
    $fecha_regreso,     // s
    $precio,            // d
    $descuento,         // d
    $plazas_totales,    // i
    $plazas_disponibles,// i
    $activo,            // i
    $vuelo_incluido,    // i
    $salida_desde,      // s
    $cerca_playa,       // i
    $categoria,         // s
    $id                 // i
);

if ($stmt->execute()) {
    echo json_encode([
        "ok" => true,
        "mensaje" => "Paquete actualizado correctamente",
        "paquete" => [
            "imagen" => $imagen,
            "hotel_imagen" => $hotel_imagen
        ]
    ]);
} else {
    echo json_encode(["ok" => false, "mensaje" => "Error al actualizar", "error" => $stmt->error]);
}

$stmt->close();
$conexion->close();
?>

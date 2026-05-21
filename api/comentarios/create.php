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

function guardarImagenComentario($campo)
{
    if (
        !isset($_FILES[$campo]) ||
        $_FILES[$campo]["error"] === UPLOAD_ERR_NO_FILE
    ) {
        return null;
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

    $directorio = __DIR__ . "/../../frontend/assets/img/experiencias/";
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

    $nombre = uniqid("experiencia_", true) . "." . $permitidos[$mime];
    $destino = $directorio . $nombre;

    if (!move_uploaded_file($_FILES[$campo]["tmp_name"], $destino)) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se pudo guardar la imagen en el servidor"
        ]);
        exit;
    }

    return "assets/img/experiencias/" . $nombre;
}

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
// VERIFICAR QUE EL USUARIO TIENE RESERVA CONFIRMADA
// Y QUE EL VIAJE FINALIZÓ HACE MÁS DE 5 DÍAS
// =========================================
$stmt = $conexion->prepare("
    SELECT r.id
    FROM reserva r
    JOIN paquete p ON p.id = r.paquete_id
    WHERE r.usuario_id = ?
      AND r.paquete_id = ?
      AND r.estado = 'CONFIRMADA'
      AND p.fecha_regreso IS NOT NULL
      AND DATEDIFF(CURDATE(), p.fecha_regreso) > 5
    LIMIT 1
");
$stmt->bind_param("ii", $usuario_id, $paquete_id);
$stmt->execute();
$reserva = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$reserva) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Solo puedes compartir tu experiencia en viajes completados hace más de 5 días"
    ]);
    exit;
}


// =========================================
// VERIFICAR QUE NO HAYA RESEÑA PREVIA
// =========================================
$stmt = $conexion->prepare("
    SELECT id
    FROM comentario
    WHERE usuario_id = ?
      AND paquete_id = ?
    LIMIT 1
");
$stmt->bind_param("ii", $usuario_id, $paquete_id);
$stmt->execute();
$comentario_existente = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($comentario_existente) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Ya has publicado una reseña para este paquete"
    ]);
    exit;
}


// =========================================
// SUBIDA DE FOTO
// =========================================
$foto_url = guardarImagenComentario("foto");


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
    "iisssii",
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
    $mensaje = $stmt->errno === 1062
        ? "Ya has publicado una reseña para este paquete"
        : "Error al guardar la experiencia";

    echo json_encode([
        "ok" => false,
        "mensaje" => $mensaje,
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conexion->close();
?>

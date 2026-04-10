<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/bd.php";

// leer JSON
$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data["nombre"]) ||
    empty($data["apellidos"]) ||
    empty($data["email"]) ||
    empty($data["password"])
) {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

$nombre = $data["nombre"];
$apellidos = $data["apellidos"];
$email = $data["email"];
$password = password_hash($data["password"], PASSWORD_BCRYPT);
$telefono = $data["telefono"] ?? null;

// comprobar si existe usuario
$sql_check = "SELECT id FROM usuario WHERE email = ?";
$stmt = $conexion->prepare($sql_check);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["error" => "El usuario ya existe"]);
    exit;
}

// insertar usuario
$sql = "INSERT INTO usuario (nombre, apellidos, email, password_hash, telefono)
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("sssss", $nombre, $apellidos, $email, $password, $telefono);

if ($stmt->execute()) {
    echo json_encode(["success" => "Usuario registrado correctamente"]);
} else {
    echo json_encode(["error" => "Error al registrar"]);
}
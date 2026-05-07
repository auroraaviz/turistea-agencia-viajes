<?php
session_start();
require __DIR__ . '/../config/bd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        http_response_code(400);
        die("Faltan datos");
    }

    $stmt = $conexion->prepare("SELECT * FROM usuario WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $usuario = $resultado->fetch_assoc();

    if ($usuario && password_verify($password, $usuario['password_hash'])) {

        unset($_SESSION['logged_out']);
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['email'] = $usuario['email'];
        $_SESSION['nombre'] = $usuario['nombre'];
        $_SESSION['apellidos'] = $usuario['apellidos'];
        $_SESSION['rol'] = $usuario['rol'];

        echo json_encode([
            "ok" => true,
            "rol" => $usuario['rol']
        ]);

    } else {
        http_response_code(401);
        echo "Usuario o contraseña incorrectos";
    }
}

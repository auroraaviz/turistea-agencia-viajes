<?php
require __DIR__ . '/../config/bd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $nombre = trim($_POST['nombre'] ?? '');
    $apellidos = trim($_POST['apellidos'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $password = $_POST['password'] ?? '';
    $password2 = $_POST['password2'] ?? '';

    if (!$nombre || !$apellidos || !$email || !$telefono || !$password || !$password2) {
        die("Completa todos los campos");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Email no válido");
    }

    if ($password !== $password2) {
        die("Las contraseñas no coinciden");
    }

    // comprobar si existe
    $stmt = $conexion->prepare("SELECT id FROM usuario WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        die("El email ya está registrado");
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conexion->prepare(
        "INSERT INTO usuario (nombre, apellidos, email, password_hash, telefono)
         VALUES (?, ?, ?, ?, ?)"
    );

    $stmt->bind_param("sssss", $nombre, $apellidos, $email, $hash, $telefono);

    if ($stmt->execute()) {
        header("Location: /turistea/turistea/frontend/pages/login.html");
        exit();
    } else {
        die("Error al registrar usuario");
    }
}
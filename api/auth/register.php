<?php
require __DIR__ . '/../config/bd.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $nombre = trim($_POST['nombre'] ?? '');
    $apellidos = trim($_POST['apellidos'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');
    $password = $_POST['password'] ?? '';
    $password2 = $_POST['password2'] ?? '';

    // Validación básica
    if (!$nombre || !$apellidos || !$email || !$telefono || !$password || !$password2) {
        $error = "Completa todos los campos";

    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Email no válido";

    } elseif ($password !== $password2) {
        $error = "Las contraseñas no coinciden";

    } else {

        // Comprobar si ya existe
        $stmt = $pdo->prepare("SELECT id FROM usuario WHERE email = :email");
        $stmt->execute(['email' => $email]);

        if ($stmt->fetch()) {
            $error = "El email ya está registrado";

        } else {

            $hash = password_hash($password, PASSWORD_BCRYPT);

            $insert = $pdo->prepare(
                "INSERT INTO usuario (nombre, apellidos, email, password_hash, telefono)
                 VALUES (:nombre, :apellidos, :email, :password_hash, :telefono)"
            );

            if (
                $insert->execute([
                    'nombre' => $nombre,
                    'apellidos' => $apellidos,
                    'email' => $email,
                    'password_hash' => $hash,
                    'telefono' => $telefono
                ])
            ) {

                // REDIRECCIÓN
                header("Location: login.html?registro=ok");
                exit();

            } else {
                $error = "Error al registrar usuario";
            }
        }
    }
}
?>
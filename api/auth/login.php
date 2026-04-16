<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/bd.php";

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["email"]) || empty($data["password"])) {
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

$email = $data["email"];
$password = $data["password"];

$sql = "SELECT * FROM usuario WHERE email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$usuario = $result->fetch_assoc();

if ($usuario && password_verify($password, $usuario["password_hash"])) {
    echo json_encode([
        "success" => true,
        "nombre" => $usuario["nombre"],
        "email" => $usuario["email"],
        "rol" => $usuario["rol"]
    ]);
} else {
    echo json_encode(["error" => "Email o contraseña incorrectos"]);
}

// 
<?php

//procesamos el formulario si es POST
$error = '';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    require __DIR__ . '/../config/bd.php';

    //valida que los campos no estén vacios
    if (!empty($_POST['email']) && !empty($_POST['password'])) {
        //con htmlspecialchars evitamos xss
        $email = htmlspecialchars($_POST['email']);
        $password = $_POST['password'];

        //prepara una consulta segura y compara la contraseña hasheada
        $stmt = $pdo->prepare(
            "SELECT * FROM usuario WHERE email = :email"
        );

        //ejecuta la sentencia con los valores del formulario
        $stmt->execute(['email' => $email]);

        //obtiene el primer registro que coincida con la consulta
        $usuarioEncontrado = $stmt->fetch();

        /// verificamos la contraseña con bcrypt
        if ($usuarioEncontrado && password_verify($password, $usuarioEncontrado['password_hash'])) {
            session_start();
            $_SESSION['email'] = $email;
            $_SESSION['nombre'] = $usuarioEncontrado['nombre'];
            $_SESSION['rol'] = $usuarioEncontrado['rol'];
            header("Location: panel.php");
            exit();
        } else {
            $error = "Email o contraseña incorrectos.";
        }
    } else {
        $error = "Por favor, rellena todos los campos.";
    }


}
?> //
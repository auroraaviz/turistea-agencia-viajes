<?php
require_once __DIR__ . '/../api/lib/FPDF/fpdf.php';

class SecurityReportPdf extends FPDF
{
    private string $reportTitle = 'Informe de vulnerabilidades - Turistea';

    public function Header(): void
    {
        $this->SetFont('Arial', 'B', 12);
        $this->Cell(0, 8, $this->encodeText($this->reportTitle), 0, 1, 'L');
        $this->SetDrawColor(0, 150, 136);
        $this->Line(10, 20, 200, 20);
        $this->Ln(4);
    }

    public function Footer(): void
    {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(100, 100, 100);
        $this->Cell(0, 10, $this->encodeText('Pagina ') . $this->PageNo(), 0, 0, 'C');
    }

    public function title(string $text): void
    {
        $this->SetTextColor(0, 0, 0);
        $this->SetFont('Arial', 'B', 18);
        $this->MultiCell(0, 9, $this->encodeText($text));
        $this->Ln(3);
    }

    public function section(string $text): void
    {
        $this->Ln(3);
        $this->SetFillColor(230, 247, 245);
        $this->SetTextColor(0, 90, 82);
        $this->SetFont('Arial', 'B', 13);
        $this->Cell(0, 8, $this->encodeText($text), 0, 1, 'L', true);
        $this->Ln(2);
    }

    public function paragraph(string $text): void
    {
        $this->SetTextColor(30, 30, 30);
        $this->SetFont('Arial', '', 10);
        $this->MultiCell(0, 5.2, $this->encodeText($text));
        $this->Ln(1);
    }

    public function bullet(string $label, string $text): void
    {
        $this->SetTextColor(20, 20, 20);
        $this->SetFont('Arial', 'B', 10);
        $this->Write(5.2, $this->encodeText('- ' . $label . ': '));
        $this->SetFont('Arial', '', 10);
        $this->Write(5.2, $this->encodeText($text));
        $this->Ln(6);
    }

    public function finding(array $finding): void
    {
        $colors = [
            'Critica' => [180, 35, 24],
            'Alta' => [194, 95, 0],
            'Media' => [128, 92, 0],
            'Baja' => [70, 70, 70],
        ];
        $color = $colors[$finding['severity']] ?? [70, 70, 70];

        $this->Ln(2);
        $this->SetTextColor($color[0], $color[1], $color[2]);
        $this->SetFont('Arial', 'B', 12);
        $this->MultiCell(0, 6, $this->encodeText($finding['severity'] . ' - ' . $finding['title']));
        $this->Ln(1);

        $this->bullet('Evidencia', $finding['evidence']);
        $this->bullet('Impacto', $finding['impact']);
        $this->bullet('Solucion', $finding['solution']);
        if (!empty($finding['notes'])) {
            $this->bullet('Notas', $finding['notes']);
        }
        $this->Ln(2);
    }

    private function encodeText(string $text): string
    {
        $converted = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
        return $converted === false ? $text : $converted;
    }
}

$findings = [
    [
        'severity' => 'Critica',
        'title' => 'Cambio de estado de reservas sin autorizacion',
        'evidence' => 'api/reservas/update.php importa auth.php, pero no llama a verificarAdmin() ni verificarSesion(). El endpoint acepta id y estado por JSON y ejecuta UPDATE reserva SET estado = ? WHERE id = ?.',
        'impact' => 'Un usuario no autenticado podria confirmar, cancelar o dejar pendiente cualquier reserva si conoce o prueba un id.',
        'solution' => 'Llamar a verificarAdmin() despues de cargar auth.php y antes de leer el body. Mantener la lista blanca de estados y devolver 401/403 cuando no haya permisos. Si usuarios normales deben cambiar sus propias reservas, crear un endpoint separado que filtre por usuario_id de la sesion.',
    ],
    [
        'severity' => 'Critica',
        'title' => 'Listado de usuarios expuesto publicamente',
        'evidence' => 'api/usuarios/get.php no carga auth.php y devuelve id, nombre, apellidos, email, telefono, foto_perfil, rol, activo y created_at.',
        'impact' => 'Exposicion de datos personales y estructura de roles. Facilita phishing, enumeracion de usuarios y ataques dirigidos a administradores.',
        'solution' => 'Importar auth.php y llamar a verificarAdmin(). Si alguna vista publica necesita usuarios, crear una respuesta publica minima sin emails, telefonos, rol ni estado.',
    ],
    [
        'severity' => 'Critica',
        'title' => 'Listado de reservas expuesto publicamente',
        'evidence' => 'api/reservas/get.php no exige autenticacion y devuelve reservas con usuario_id, paquete_id, precio_total, estado, fecha_reserva, nombre, apellidos y email.',
        'impact' => 'Filtracion de reservas y datos personales de clientes. Puede revelar historiales de compra, importes y estados de viaje.',
        'solution' => 'Protegerlo con verificarAdmin() o sustituir su uso por api/reservas/listar.php, que ya verifica administrador. Para perfil de usuario, usar endpoints que filtren por $_SESSION["usuario_id"].',
    ],
    [
        'severity' => 'Alta',
        'title' => 'Modo desarrollo puede saltarse toda la autenticacion',
        'evidence' => 'api/config/auth.php hace return en verificarSesion() y verificarAdmin() cuando IS_DEV=true. api/auth/session.php simula un usuario admin en modo dev.',
        'impact' => 'Si IS_DEV=true llega a un servidor real, cualquier endpoint protegido queda accesible como administrador.',
        'solution' => 'Asegurar que IS_DEV=false en produccion. Mejor aun: eliminar el bypass global o limitarlo a CLI/localhost comprobando REMOTE_ADDR. No simular administradores en endpoints HTTP compartidos.',
    ],
    [
        'severity' => 'Alta',
        'title' => 'Riesgo de fijacion de sesion en login',
        'evidence' => 'api/auth/login.php llama a session_start() y asigna variables de sesion tras password_verify(), pero no ejecuta session_regenerate_id(true).',
        'impact' => 'Un atacante que consiga fijar un PHPSESSID antes del login podria reutilizar la sesion autenticada.',
        'solution' => 'Ejecutar session_regenerate_id(true) inmediatamente despues de verificar la contrasena y antes de asignar usuario_id, email, nombre y rol.',
    ],
    [
        'severity' => 'Alta',
        'title' => 'XSS almacenado o reflejado por uso de innerHTML con datos de BD',
        'evidence' => 'frontend/js/paquetes/tarjetas.js, frontend/js/paquetes/detalle.js, frontend/js/admin/viajes/viajesRender.js y frontend/js/admin/clientes/clientesRender.js interpolan campos como titulo, descripcion, destino, email o telefono dentro de HTML.',
        'impact' => 'Si un valor malicioso entra en la base de datos, puede ejecutar JavaScript en navegadores de clientes o administradores.',
        'solution' => 'Renderizar datos de usuario/BD con textContent o crear nodos DOM. Si se mantiene template HTML, escapar todos los valores dinamicos con una funcion escapeHTML antes de insertarlos.',
    ],
    [
        'severity' => 'Media',
        'title' => 'Credenciales en el codigo fuente',
        'evidence' => 'api/config/bd.php contiene usuario y contrasena de base de datos. api/config/smtp.php contiene credenciales SMTP.',
        'impact' => 'Cualquier copia del repositorio o backup expone accesos internos. Si se sube a un remoto, las credenciales deben considerarse comprometidas.',
        'solution' => 'Mover credenciales a .env o variables de entorno, anadir .env a .gitignore y rotar las claves ya expuestas. El codigo debe leer getenv()/$_ENV con valores por defecto solo locales.',
    ],
    [
        'severity' => 'Media',
        'title' => 'Errores PHP visibles en produccion',
        'evidence' => 'api/config/bd.php activa ini_set("display_errors", 1) y error_reporting(E_ALL).',
        'impact' => 'Los errores pueden revelar rutas internas, mensajes SQL, configuracion y detalles utiles para ataques.',
        'solution' => 'Desactivar display_errors en produccion y registrar errores en logs: ini_set("display_errors", 0), ini_set("log_errors", 1). Controlarlo por entorno.',
    ],
    [
        'severity' => 'Media',
        'title' => 'Validacion insuficiente de tarjeta al crear reserva',
        'evidence' => 'api/reservas/crear.php solo valida que tarjeta_id sea mayor que 0; no comprueba que exista ni que pertenezca al usuario autenticado.',
        'impact' => 'Permite crear reservas indicando ids arbitrarios de tarjeta. Aunque solo se guardan ultimos 4 digitos, rompe la integridad de la logica de pago.',
        'solution' => 'Consultar tarjeta_credito WHERE id = ? AND usuario_id = ? antes de crear la reserva. Si no existe, devolver 422/403.',
    ],
    [
        'severity' => 'Media',
        'title' => 'Posible sobreventa de plazas por condicion de carrera',
        'evidence' => 'api/reservas/crear.php lee plazas_disponibles, inserta reserva y despues descuenta plazas en una consulta separada sin transaccion ni condicion plazas_disponibles >= num_viajeros.',
        'impact' => 'Dos peticiones simultaneas pueden superar las plazas disponibles.',
        'solution' => 'Usar transaccion. Descontar con UPDATE paquete SET plazas_disponibles = plazas_disponibles - ? WHERE id = ? AND plazas_disponibles >= ? y comprobar affected_rows antes de insertar o confirmar la reserva.',
    ],
    [
        'severity' => 'Media',
        'title' => 'CORS demasiado permisivo en endpoints sensibles',
        'evidence' => 'Varios endpoints declaran Access-Control-Allow-Origin: *, incluyendo api/usuarios/get.php, api/reservas/get.php, api/reservas/update.php y api/auth/logout.php.',
        'impact' => 'Amplia la superficie de abuso desde otros origenes. En endpoints con credenciales puede combinarse con malas configuraciones de cookies o navegadores.',
        'solution' => 'Restringir Access-Control-Allow-Origin al dominio real de la aplicacion. Para endpoints autenticados, permitir credentials solo con origen explicito y no usar *.',
    ],
    [
        'severity' => 'Media',
        'title' => 'Falta proteccion CSRF en acciones con sesion',
        'evidence' => 'Endpoints POST como usuarios/update.php, usuarios/delete.php, reservas/update.php, paquetes/create.php, paquetes/update.php y paquetes/delete.php confian solo en la cookie de sesion.',
        'impact' => 'Si la cookie se envia automaticamente, un sitio externo podria intentar disparar acciones contra la sesion de un administrador.',
        'solution' => 'Emitir token CSRF por sesion y exigirlo en una cabecera como X-CSRF-Token para operaciones POST/PUT/DELETE. Configurar cookies con SameSite=Lax o Strict, HttpOnly y Secure en HTTPS.',
    ],
    [
        'severity' => 'Media',
        'title' => 'Endpoint de contacto permite abuso y revela errores internos',
        'evidence' => 'api/contacto/enviar.php no aplica rate limiting/captcha y devuelve detalles de ErrorInfo o excepciones SMTP al cliente.',
        'impact' => 'Puede usarse para spam o pruebas masivas. Los mensajes de error pueden revelar detalles del proveedor SMTP o configuracion.',
        'solution' => 'Aplicar limite por IP/email, captcha o honeypot, y devolver errores genericos al cliente. Enviar detalles solo a error_log.',
    ],
    [
        'severity' => 'Baja',
        'title' => 'SQL dinamico con escape manual',
        'evidence' => 'api/usuarios/get.php y api/reservas/get.php construyen filtros SQL concatenando valores escapados con real_escape_string().',
        'impact' => 'Aunque el escape reduce el riesgo, es mas facil introducir una inyeccion SQL al ampliar filtros o cambiar tipos.',
        'solution' => 'Migrar filtros a prepared statements con bind_param. Mantener listas blancas para campos como estado, rol y ordenacion.',
    ],
    [
        'severity' => 'Baja',
        'title' => 'Logout con CORS inconsistente',
        'evidence' => 'api/auth/logout.php combina Access-Control-Allow-Origin: * con Access-Control-Allow-Credentials: true.',
        'impact' => 'Es una configuracion invalida/inconsistente para credenciales y puede causar comportamientos diferentes entre navegadores.',
        'solution' => 'Usar un origen explicito cuando Allow-Credentials sea true, por ejemplo https://turistea.example, y responder Vary: Origin si se permite una lista de origenes.',
    ],
];

$pdf = new SecurityReportPdf();
$pdf->SetMargins(10, 24, 10);
$pdf->SetAutoPageBreak(true, 18);
$pdf->AddPage();
$pdf->title('Informe de vulnerabilidades y soluciones');
$pdf->paragraph('Proyecto: JR_M26_AgenciaViajes / Turistea');
$pdf->paragraph('Fecha del informe: ' . date('Y-m-d'));
$pdf->paragraph('Alcance: revision estatica de endpoints PHP, configuracion de autenticacion, consultas SQL y renderizado JavaScript. No se realizaron pruebas destructivas.');

$pdf->section('Resumen ejecutivo');
$pdf->paragraph('Se han identificado vulnerabilidades criticas relacionadas con control de acceso en endpoints de usuarios y reservas. La prioridad inmediata debe ser cerrar los endpoints sin autorizacion, retirar el bypass de desarrollo en entornos no locales y endurecer la gestion de sesion.');

$pdf->section('Prioridad recomendada');
$pdf->bullet('1', 'Corregir api/reservas/update.php, api/usuarios/get.php y api/reservas/get.php con verificarAdmin() o filtros por usuario de sesion.');
$pdf->bullet('2', 'Garantizar que IS_DEV no pueda activar bypass en produccion y regenerar la sesion al iniciar login.');
$pdf->bullet('3', 'Escapar datos dinamicos antes de usar innerHTML o sustituir por textContent.');
$pdf->bullet('4', 'Mover credenciales a variables de entorno, rotarlas y desactivar display_errors.');
$pdf->bullet('5', 'Anadir CSRF, CORS restringido y transacciones en reservas.');

$pdf->section('Detalle de vulnerabilidades');
foreach ($findings as $finding) {
    $pdf->finding($finding);
}

$pdf->section('Checklist de cierre');
$pdf->bullet('Control de acceso', 'Todos los endpoints privados llaman a verificarSesion() o verificarAdmin() segun corresponda.');
$pdf->bullet('Sesiones', 'Login regenera PHPSESSID; cookies usan HttpOnly, Secure y SameSite.');
$pdf->bullet('Datos', 'No se devuelven datos personales en endpoints publicos.');
$pdf->bullet('Frontend', 'Los campos de BD se pintan con textContent o escapeHTML.');
$pdf->bullet('Configuracion', 'Credenciales fuera del repositorio, errores no visibles y CORS limitado al dominio permitido.');
$pdf->bullet('Reservas', 'Creacion de reservas dentro de transaccion y descuento de plazas atomico.');

$output = __DIR__ . '/../docs/informe_vulnerabilidades_soluciones.pdf';
$pdf->Output('F', $output);

echo $output . PHP_EOL;

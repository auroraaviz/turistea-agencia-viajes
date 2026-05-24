-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2026 a las 09:39:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `turistea`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `paquete_id` int(11) DEFAULT NULL,
  `titulo_viaje` varchar(150) NOT NULL,
  `comentario` text NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `valoracion_viaje` tinyint(1) NOT NULL,
  `valoracion_compania` tinyint(1) NOT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`id`, `usuario_id`, `paquete_id`, `titulo_viaje`, `comentario`, `foto_url`, `valoracion_viaje`, `valoracion_compania`, `creado_at`) VALUES
(7, 1, 10, 'Escapada a Lisboa', 'Un viaje increíble. Lisboa nos conquistó desde el primer momento. Alfama es mágica al atardecer y el hotel estaba en una ubicación perfecta. Repetiremos sin duda.', NULL, 5, 5, '2025-11-18 17:00:00'),
(8, 13, 10, 'Escapada a Lisboa', 'Todo muy bien organizado. Los vuelos puntuales y el hotel limpio y cómodo. Quizás el desayuno podría ser más variado, pero en general muy satisfecho.', 'https://images.unsplash.com/photo-1525207934214-58e69a8f8a3e?w=800&q=80', 4, 5, '2025-11-19 09:30:00'),
(10, 1, 12, 'Semana en Tenerife', 'Tenerife es espectacular. El hotel todo incluido era de primera calidad y la excursión al Teide fue lo mejor del viaje. Solo le faltó un día más.', NULL, 5, 4, '2025-08-10 18:00:00'),
(11, 13, 12, 'Semana en Tenerife', 'Muy buen viaje en general. Las playas son preciosas aunque en agosto hay bastante gente. El servicio del hotel excelente. Volvería fuera de temporada alta.', 'https://images.unsplash.com/photo-1691397553539-c7c573138747?w=800&q=80', 4, 4, '2025-08-11 09:00:00'),
(13, 1, 14, 'Costa Tropical Granada', 'Una escapada tranquila y muy asequible. Almuñécar es un pueblo encantador y el mar estaba en perfectas condiciones para marzo. El hotel correcto, sin más.', NULL, 4, 4, '2026-03-27 11:00:00'),
(14, 13, 14, 'Costa Tropical Granada', 'Ideal para desconectar. Poca gente, precios razonables y paisajes bonitos. El microclima es real, hizo un tiempo estupendo toda la semana. Muy recomendable.', 'https://images.unsplash.com/photo-1557998750-1969d4ec0f16?w=800&q=80', 5, 5, '2026-03-28 08:30:00'),
(18, 14, 13, 'Un viaje imprescindible', 'Además de sus monumentos, la ciudad invita a caminar sin prisa, disfrutar de sus calles, sus cafés y del ambiente a orillas del Sena. Es un destino equilibrado entre cultura, historia y experiencias cotidianas agradables.', '../assets/img/experiencias/experiencia_6a0f39210c5068.79894713.jpg', 5, 5, '2026-05-21 16:56:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `excursion`
--

CREATE TABLE `excursion` (
  `id` int(11) NOT NULL,
  `paquete_id` int(11) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favorito`
--

CREATE TABLE `favorito` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `paquete_id` int(11) DEFAULT NULL,
  `agregado_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `favorito`
--

INSERT INTO `favorito` (`id`, `usuario_id`, `paquete_id`, `agregado_at`) VALUES
(4, 13, 5, '2026-05-06 07:56:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticia`
--

CREATE TABLE `noticia` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `publicada_at` timestamp NULL DEFAULT NULL,
  `publicada` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `reserva_id` int(11) DEFAULT NULL,
  `tipo` enum('RESERVA','PAGO','SISTEMA') DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `enviada` tinyint(1) DEFAULT NULL,
  `leida` tinyint(1) DEFAULT NULL,
  `enviada_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id` int(11) NOT NULL,
  `reserva_id` int(11) DEFAULT NULL,
  `importe` decimal(10,2) DEFAULT NULL,
  `metodo` enum('TARJETA','PAYPAL','TRANSFERENCIA') DEFAULT NULL,
  `estado` enum('PENDIENTE','PAGADO','FALLIDO') DEFAULT NULL,
  `referencia_externa` varchar(255) DEFAULT NULL,
  `fecha_pago` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id`, `reserva_id`, `importe`, `metodo`, `estado`, `referencia_externa`, `fecha_pago`) VALUES
(1, 4, 1058.00, 'TARJETA', 'PAGADO', 'PAG-000004', '2026-05-08 08:34:25'),
(2, 5, 1058.00, 'TARJETA', 'PENDIENTE', 'PAG-000005', '2026-05-13 07:28:39'),
(3, 6, 747.00, 'TARJETA', 'PAGADO', 'PAG-000006', '2026-05-18 07:38:54'),
(4, 7, 598.00, 'TARJETA', 'PAGADO', 'PAG-000007', '2025-10-20 08:05:00'),
(5, 8, 299.00, 'TARJETA', 'PAGADO', 'PAG-000008', '2025-10-21 09:35:00'),
(6, 9, 1168.20, 'TARJETA', 'PAGADO', 'PAG-000009', '2025-09-01 07:20:00'),
(7, 10, 1666.10, 'TARJETA', 'PAGADO', 'PAG-000010', '2025-07-01 06:10:00'),
(8, 11, 835.05, 'TARJETA', 'PAGADO', 'PAG-000011', '2025-07-02 10:05:00'),
(9, 12, 1098.00, 'TARJETA', 'PAGADO', 'PAG-000012', '2025-11-10 15:10:00'),
(10, 13, 389.00, 'TARJETA', 'PAGADO', 'PAG-000013', '2026-02-15 09:10:00'),
(11, 14, 778.00, 'TARJETA', 'PAGADO', 'PAG-000014', '2026-02-16 08:10:00'),
(12, 15, 2158.20, 'TARJETA', 'PAGADO', 'PAG-000015', '2025-08-01 08:05:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquete`
--

CREATE TABLE `paquete` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `destino` varchar(100) DEFAULT NULL,
  `hotel_nombre` varchar(150) DEFAULT NULL,
  `hotel_estrellas` int(11) DEFAULT NULL,
  `hotel_regimen` varchar(100) DEFAULT NULL,
  `hotel_imagen` varchar(255) DEFAULT NULL,
  `fecha_salida` date DEFAULT NULL,
  `fecha_regreso` date DEFAULT NULL,
  `plazas_totales` int(11) DEFAULT NULL,
  `plazas_disponibles` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(5,2) DEFAULT 0.00,
  `activo` tinyint(1) DEFAULT 1,
  `imagen` varchar(255) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `vuelo_incluido` tinyint(1) DEFAULT 0,
  `salida_desde` varchar(100) DEFAULT NULL,
  `cerca_playa` tinyint(1) DEFAULT 0,
  `transporte` enum('avion','sin_transporte') DEFAULT 'avion',
  `hora_salida_avion` time DEFAULT NULL,
  `hora_llegada_avion` time DEFAULT NULL,
  `hotel_detalles` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paquete`
--

INSERT INTO `paquete` (`id`, `titulo`, `descripcion`, `destino`, `hotel_nombre`, `hotel_estrellas`, `hotel_regimen`, `hotel_imagen`, `fecha_salida`, `fecha_regreso`, `plazas_totales`, `plazas_disponibles`, `precio`, `descuento`, `activo`, `imagen`, `categoria`, `vuelo_incluido`, `salida_desde`, `cerca_playa`, `transporte`, `hora_salida_avion`, `hora_llegada_avion`, `hotel_detalles`) VALUES
(1, 'Aventura en los Pirineos', 'Descubre los paisajes más impresionantes del Pirineo aragonés. Rutas de senderismo, pueblos medievales y gastronomía local en un viaje inolvidable de 5 días.', 'Huesca, Aragón', 'Hotel Monte Perdido', 4, 'Media pensión', '../assets/img/hoteles/hotelmonteperdido.jpeg', '2026-06-15', '2026-06-20', 20, 12, 549.00, 10.00, 1, '../assets/img/huesca.jpeg', 'vuelo|verano|vacaciones', 1, 'Barcelona', 0, 'avion', NULL, NULL, NULL),
(2, 'Relax en la Costa Brava', 'Disfruta del Mediterráneo con playas de aguas cristalinas, calas escondidas y una oferta cultural única. Incluye excursión en barco y visita a Tossa de Mar.', 'Girona, Cataluña', 'Hotel Mar i Cel', 3, 'Todo incluido', '../assets/img/hoteles/hotelmaricel.jpeg', '2026-07-01', '2026-07-08', 15, 5, 789.50, 0.00, 1, '../assets/img/mallorca.jpg', 'verano|vacaciones', 0, 'Málaga', 1, 'avion', NULL, NULL, NULL),
(3, 'Escapada a Canarias', 'Vuelo + 7 noches de hotel en primera línea de playa. Sol, arena y aguas cristalinas todo el año en el paraíso canario.', 'Las Palmas, Gran Canaria', 'Hotel Playa Dorada', 4, 'Media pensión', '../assets/img/5.jpg', '2026-10-05', '2026-10-12', 30, 14, 529.00, 5.00, 1, '../assets/img/canarias.jpg', 'vuelo|vacaciones', 1, 'Madrid', 1, 'avion', NULL, NULL, NULL),
(4, 'Semana en Mallorca', 'Todo incluido desde 399€ por persona. Una semana en la joya del Mediterráneo con playas, cultura y fiesta.', 'Palma de Mallorca, Baleares', 'Hotel Mar i Cel', 3, 'Todo incluido', '../assets/img/hoteles/hotelmaricel.jpeg', '2026-08-10', '2026-08-17', 25, 9, 399.00, 15.00, 1, '../assets/img/mallorca.jpg', 'vuelo|verano|vacaciones', 1, 'Valencia', 1, 'avion', NULL, NULL, NULL),
(5, 'Fin de semana en Roma', 'Vuelos + 3 noches de hotel desde 199€. Visita el Coliseo, la Fontana di Trevi y disfruta de la mejor pasta italiana.', 'Roma, Italia', 'Hotel Colosseo', 3, 'Solo alojamiento', '../assets/img/6.jpg', '2026-11-20', '2026-11-23', 20, 6, 199.00, 0.00, 1, '../assets/img/roma.jpg', 'vuelo|fin_de_semana', 1, 'Barcelona', 0, 'avion', NULL, NULL, NULL),
(6, 'Mallorca rural', 'Escapada de fin de semana a Mallorca. Combina naturaleza, cultura y relax en pocos días por el interior de la isla.', 'Serra de Tramuntana, Mallorca', 'Agroturismo Tramuntana', 4, 'Alojamiento y desayuno', '../assets/img/1.jpg', '2026-09-11', '2026-09-13', 12, 3, 249.00, 0.00, 1, '../assets/img/1.jpg', 'fin_de_semana', 0, 'Palma de Mallorca', 0, 'avion', NULL, NULL, NULL),
(7, 'Sevilla que maravilla', 'Recorre Sevilla y sus principales monumentos. Disfruta de su cultura, gastronomía y del clima suave del otoño andaluz.', 'Sevilla, Andalucía', 'Hotel Giralda', 4, 'Alojamiento y desayuno', '../assets/img/2.jpg', '2026-11-04', '2026-11-08', 20, 14, 329.00, 5.00, 1, '../assets/img/2.jpg', 'vacaciones', 0, 'Madrid', 0, 'avion', NULL, NULL, NULL),
(8, 'Asturias', 'Viaja a la costa de Asturias, descubre su encanto marinero, sus playas salvajes y su gastronomía tradicional.', 'Costa de Asturias', 'Hotel Mirador del Cantábrico', 3, 'Media pensión', '../assets/img/3.jpg', '2026-08-18', '2026-08-23', 18, 9, 459.00, 0.00, 1, '../assets/img/3.jpg', 'verano|vacaciones', 0, 'Madrid', 1, 'avion', NULL, NULL, NULL),
(9, 'Cáceres', 'Cáceres en Diciembre. Disfruta de sus calles empedradas, su gastronomía y el encanto invernal de la ciudad medieval.', 'Cáceres, Extremadura', 'Hotel Plaza Mayor', 3, 'Alojamiento y desayuno', '../assets/img/4.jpg', '2026-12-18', '2026-12-20', 16, 11, 179.00, 10.00, 1, '../assets/img/4.jpg', 'fin_de_semana', 0, 'Madrid', 0, 'avion', NULL, NULL, NULL),
(10, 'Escapada a Lisboa', 'Un fin de semana inolvidable en la capital portuguesa. Pasea por Alfama, prueba la gastronomía local y disfruta del Tajo.', 'Lisboa, Portugal', 'Hotel Bairro Alto', 4, 'Alojamiento y desayuno', 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600', '2025-11-14', '2025-11-17', 20, 20, 299.00, 0.00, 1, 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=1173&auto=format&fit=crop', 'vuelo|fin_de_semana', 1, 'Madrid', 0, 'avion', NULL, NULL, NULL),
(11, 'Ruta por Andalucía', 'Recorre Sevilla, Córdoba y Granada en un viaje cultural lleno de historia, tapas y flamenco.', 'Sevilla, Córdoba y Granada', 'Hotel Alhambra Palace', 4, 'Media pensión', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', '2025-10-03', '2025-10-10', 25, 25, 649.00, 10.00, 1, 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?q=80&w=1170&auto=format&fit=crop', 'vacaciones', 0, 'Barcelona', 0, 'sin_transporte', NULL, NULL, NULL),
(12, 'Semana en Tenerife', 'Sol, playa y naturaleza en la isla más grande de Canarias. Visita el Teide y relájate en sus playas volcánicas.', 'Santa Cruz de Tenerife', 'Hotel Teide Mar', 4, 'Todo incluido', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', '2025-08-01', '2025-08-08', 30, 30, 879.00, 5.00, 1, 'https://images.unsplash.com/photo-1579090814807-60808035e1cb?q=80&w=1170&auto=format&fit=crop', 'vuelo|verano|vacaciones', 1, 'Madrid', 1, 'avion', NULL, NULL, NULL),
(13, 'París romántico', 'Tres noches en la ciudad del amor. Torre Eiffel, Louvre, Montmartre y la mejor gastronomía francesa.', 'París, Francia', 'Hotel Le Marais', 4, 'Alojamiento y desayuno', 'https://images.unsplash.com/photo-1551882547-ff40c63fe0f4?w=600', '2025-12-05', '2025-12-08', 18, 18, 549.00, 0.00, 1, 'https://images.unsplash.com/photo-1471623432079-b009d30b6729?q=80&w=1170&auto=format&fit=crop', 'vuelo|fin_de_semana', 1, 'Barcelona', 0, 'avion', NULL, NULL, NULL),
(14, 'Costa Tropical Granada', 'Disfruta del único microclima subtropical de Europa. Playas tranquilas, chiringuitos y pueblos con encanto.', 'Almuñécar, Granada', 'Hotel Casablanca', 3, 'Media pensión', 'https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=600', '2026-03-20', '2026-03-25', 15, 15, 389.00, 0.00, 1, 'https://images.unsplash.com/photo-1707076694847-3a59ee07fec3?q=80&w=1170&auto=format&fit=crop', 'verano|vacaciones', 0, 'Madrid', 1, 'sin_transporte', NULL, NULL, NULL),
(15, 'Islas Griegas', 'Descubre la magia del Egeo visitando Santorini y Mykonos. Playas de aguas cristalinas, pueblos blancos y atardeceres únicos en el mundo.', 'Santorini y Mykonos, Grecia', 'Hotel Aegean Blue', 4, 'Media pensión', 'https://images.unsplash.com/photo-1595942820590-f855c6b8ba88?w=600&q=80', '2025-09-10', '2025-09-17', 20, 20, 1199.00, 10.00, 1, 'https://images.unsplash.com/photo-1595942820590-f855c6b8ba88?w=800&q=80', 'vuelo|verano|vacaciones', 1, 'Madrid', 1, 'avion', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `paquete_id` int(11) DEFAULT NULL,
  `num_viajeros` int(11) DEFAULT NULL,
  `precio_total` decimal(10,2) DEFAULT NULL,
  `estado` enum('PENDIENTE','CONFIRMADA','CANCELADA') DEFAULT NULL,
  `fecha_reserva` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva`
--

INSERT INTO `reserva` (`id`, `usuario_id`, `paquete_id`, `num_viajeros`, `precio_total`, `estado`, `fecha_reserva`) VALUES
(3, 1, 1, 2, 500.00, 'CONFIRMADA', '2026-05-06 09:58:50'),
(4, 13, 3, 2, 1058.00, 'CONFIRMADA', '2026-05-08 08:34:21'),
(5, 13, 3, 2, 1058.00, 'PENDIENTE', '2026-05-13 07:28:39'),
(6, 14, 6, 3, 747.00, 'CONFIRMADA', '2026-05-18 07:37:34'),
(7, 1, 10, 2, 598.00, 'CONFIRMADA', '2025-10-20 08:00:00'),
(8, 13, 10, 1, 299.00, 'CONFIRMADA', '2025-10-21 09:30:00'),
(9, 14, 11, 2, 1168.20, 'CONFIRMADA', '2025-09-01 07:15:00'),
(10, 1, 12, 2, 1666.10, 'CONFIRMADA', '2025-07-01 06:00:00'),
(11, 13, 12, 1, 835.05, 'CONFIRMADA', '2025-07-02 10:00:00'),
(12, 14, 13, 2, 1098.00, 'CONFIRMADA', '2025-11-10 15:00:00'),
(13, 1, 14, 1, 389.00, 'CONFIRMADA', '2026-02-15 09:00:00'),
(14, 13, 14, 2, 778.00, 'CONFIRMADA', '2026-02-16 08:00:00'),
(15, 14, 15, 2, 2158.20, 'CONFIRMADA', '2025-08-01 08:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarjeta_credito`
--

CREATE TABLE `tarjeta_credito` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `titular` varchar(150) NOT NULL,
  `ultimos_4` char(4) NOT NULL,
  `vencimiento` varchar(5) NOT NULL,
  `tarjeta_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarjeta_credito`
--

INSERT INTO `tarjeta_credito` (`id`, `usuario_id`, `titular`, `ultimos_4`, `vencimiento`, `created_at`) VALUES
(1, 13, 'Pilar', '0222', '02/35', '2026-05-08 08:34:19'),
(2, 13, 'Pilar', '4244', '01/30', '2026-05-13 07:28:37'),
(3, 14, 'Lala lopez lopez', '4444', '02/35', '2026-05-18 07:37:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `rol` enum('usuario','admin') DEFAULT 'usuario',
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `apellidos`, `email`, `password_hash`, `telefono`, `foto_perfil`, `rol`, `activo`, `created_at`) VALUES
(1, 'Juan', 'Luis', 'juanlu@gmail.com', '$2y$10$2ekFL7log9944yBPcVUCK.oUoKAtJ1EKWiO3KdZl2D7HgyJ1LiJwS', '4567854545', NULL, NULL, 1, '2026-03-29 13:13:19'),
(2, 'Juan', 'Luis2', 'juanlu2@gmail.com', '$2y$10$y57LeWGwl1Wa3/O4HhuEjOo2L3jmVFCWTs1X3oYCpmHts4nqexonK', '4567854545', NULL, 'usuario', 1, '2026-03-29 13:16:48'),
(3, 'Pedro Manuel', 'Romero Justiciano', 'justiciano@gradenower.es', '$2y$10$y.A8fOXjmSS9n3W0ivpkxOeh2zf4y4r0Nk0xPOMpkUFBzvawzMy6y', '+34 628628628', NULL, 'usuario', 1, '2026-03-29 13:31:23'),
(4, 'Pedro Manuel Manolo', 'Romero Justiciano2', 'justiciano2@gradenower.es', '$2y$10$n99e0xOTaQcw7eqZjc0Ot.NlKOFcWATq4hoBr3077xD0G3Hy6AbZC', '+34 628628628', NULL, 'usuario', 1, '2026-03-29 13:33:18'),
(5, 'Juan3', 'Luis6', 'juanlu4@gmail.com', '$2y$10$HR4slFRrb3/.aOrZk/Pgm.5j7Klmtd47sroef3dB3/whGPPcA16/O', '4567854545', NULL, 'usuario', 0, '2026-03-29 13:33:44'),
(6, 'Juan47', 'Luis48', 'juanluramos45@gmail.com', '$2y$10$PRTAZj0IB9mJhKa6D59uReiQ0cM0gwBoNWM3MdGiwAGatyVefGU6i', '345346345', NULL, 'usuario', 1, '2026-03-29 13:36:26'),
(7, 'Juanillo', 'Luisillo', 'juanluramosillo@gmail.com', '$2y$10$0MPVMlPQdQAJ8w/DuBuGzOWNnW40h7NLZxxcYK6rzK6D7iXcAypQO', '+34 123456123', NULL, 'usuario', 1, '2026-03-29 13:49:58'),
(8, 'Juan', 'Luis', 'admin@admin.com', '$2y$10$IrOQdsCL49NRj82deJLjm.EBZ847t0F1JypGHNGhQPqE0HDWh7E/y', '+34 628628628', NULL, 'usuario', 1, '2026-04-06 20:34:37'),
(9, 'Gegrorio', 'Ordoñez', 'gergorio@xn--ordoez-zwa.com', '$2y$10$zirySmnhBSaVmcfyYsvGIumjQdhXFmL8Rj6oxoKKSv75zhVpnXk/m', '+34 628628628', NULL, '', 1, '2026-04-06 20:35:20'),
(10, 'Juan', 'Luisa', 'felipe@gmail.com', '$2y$10$1knQXA0BAyLkdub3JtkWJuJLYangM.F3ymk5Y.8TIV7IrxYjMd8vW', '+34 628628628', NULL, 'usuario', 1, '2026-04-08 03:37:47'),
(11, 'Lola', 'Lopez Garcia', 'lola@correo.com', '$2y$10$SSPkjloykNlMm9DnDaxcxeTuPjKeR/80ASbKQY/XFvTFkpNmKmvaG', '+34 600600600', NULL, 'admin', 1, '2026-04-17 09:49:52'),
(12, 'Paqui', 'Perez', 'paqui@correo.com', '$2y$10$rHgZ9jCQ1tYD7yfLwrh7ru39XcnGfjTq2PfvUSX7tTFj7wptsj78q', '+346', NULL, 'usuario', 1, '2026-05-04 07:17:38'),
(13, 'Lolo', 'Gomez', 'lolo@correo.com', '$2y$10$6ANELAMTL17PSVE0XIztYePTC0oAwL9uSVZmly83akrllCnjPxYXa', '+34 600700900', NULL, 'usuario', 1, '2026-05-04 07:18:16'),
(14, 'Lala', 'Lopez', 'lala@correo.com', '$2y$10$x302j8oeAKy3lNMeTihJXuZ5ent7lNWLQGfLyTc63nAdQ8nKN3phi', '+34 655 412 233', NULL, 'usuario', 1, '2026-05-17 10:33:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `viajero`
--

CREATE TABLE `viajero` (
  `id` int(11) NOT NULL,
  `reserva_id` int(11) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(150) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `viajero`
--

INSERT INTO `viajero` (`id`, `reserva_id`, `nombre`, `apellidos`, `dni`, `fecha_nacimiento`) VALUES
(1, 6, 'Manolo', 'Lopez', '555555m', '2025-12-18'),
(2, 6, 'Manuel', 'Parra', '444444444m', '2025-12-16'),
(3, 6, 'Paco', 'Gomez', '4444555454m', '2024-02-21');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comentario_usuario` (`usuario_id`),
  ADD KEY `fk_comentario_paquete` (`paquete_id`);

--
-- Indices de la tabla `excursion`
--
ALTER TABLE `excursion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paquete_id` (`paquete_id`);

--
-- Indices de la tabla `favorito`
--
ALTER TABLE `favorito`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`,`paquete_id`),
  ADD KEY `paquete_id` (`paquete_id`);

--
-- Indices de la tabla `noticia`
--
ALTER TABLE `noticia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `reserva_id` (`reserva_id`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reserva_id` (`reserva_id`);

--
-- Indices de la tabla `paquete`
--
ALTER TABLE `paquete`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `paquete_id` (`paquete_id`);

--
-- Indices de la tabla `tarjeta_credito`
--
ALTER TABLE `tarjeta_credito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tarjeta_usuario` (`usuario_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `viajero`
--
ALTER TABLE `viajero`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reserva_id` (`reserva_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `excursion`
--
ALTER TABLE `excursion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `favorito`
--
ALTER TABLE `favorito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `noticia`
--
ALTER TABLE `noticia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `paquete`
--
ALTER TABLE `paquete`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `tarjeta_credito`
--
ALTER TABLE `tarjeta_credito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `viajero`
--
ALTER TABLE `viajero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `fk_comentario_paquete` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_comentario_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `excursion`
--
ALTER TABLE `excursion`
  ADD CONSTRAINT `excursion_ibfk_1` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `favorito`
--
ALTER TABLE `favorito`
  ADD CONSTRAINT `favorito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `favorito_ibfk_2` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`);

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `notificacion_ibfk_2` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`);

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`);

--
-- Filtros para la tabla `tarjeta_credito`
--
ALTER TABLE `tarjeta_credito`
  ADD CONSTRAINT `fk_tarjeta_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `viajero`
--
ALTER TABLE `viajero`
  ADD CONSTRAINT `viajero_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

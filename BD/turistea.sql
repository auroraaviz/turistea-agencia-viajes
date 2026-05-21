-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-05-2026 a las 19:32:15
-- Versión del servidor: 10.11.14-MariaDB-0ubuntu0.24.04.1
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
(5, 1, 5, '2026-05-04 11:17:26'),
(9, 11, 3, '2026-05-05 21:00:50'),
(10, 11, 5, '2026-05-06 20:26:38');

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
(5, 6, 200.00, 'TARJETA', 'PAGADO', 'PAG-000006', '2026-05-07 17:29:28'),
(6, 7, 918.00, 'TARJETA', 'PAGADO', 'PAG-000007', '2026-05-09 16:45:46'),
(7, 8, 798.00, 'TARJETA', 'PAGADO', 'PAG-000008', '2026-05-09 16:47:34'),
(8, 9, 200.00, 'TARJETA', 'PENDIENTE', 'PAG-000009', '2026-05-09 16:47:52'),
(9, 10, 200.00, 'TARJETA', 'PAGADO', 'PAG-000010', '2026-05-12 18:36:43'),
(10, 11, 597.00, 'TARJETA', 'PENDIENTE', 'PAG-000011', '2026-05-12 18:42:41'),
(11, 12, 500.00, 'TARJETA', 'FALLIDO', 'PAG-000012', '2026-05-13 16:46:48'),
(12, 13, 300.00, 'TARJETA', 'FALLIDO', 'PAG-000013', '2026-05-13 16:52:39');

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
  `categoria` enum('vuelo','vacaciones','fin_de_semana','verano') DEFAULT NULL,
  `vuelo_incluido` tinyint(1) DEFAULT 0,
  `salida_desde` varchar(100) DEFAULT NULL,
  `cerca_playa` tinyint(1) DEFAULT 0,
  `hotel_detalles` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paquete`
--

INSERT INTO `paquete` (`id`, `titulo`, `descripcion`, `destino`, `hotel_nombre`, `hotel_estrellas`, `hotel_regimen`, `hotel_imagen`, `fecha_salida`, `fecha_regreso`, `plazas_totales`, `plazas_disponibles`, `precio`, `descuento`, `activo`, `imagen`, `categoria`, `vuelo_incluido`, `salida_desde`, `cerca_playa`, `hotel_detalles`) VALUES
(2, 'Relax en la Costa Brava', 'Disfruta del Mediterráneo con playas de aguas cristalinas, calas escondidas y una oferta cultural única. Incluye excursión en barco y visita a Tossa de Mar.', 'Girona, Cataluña', 'Hotel Mar i Cel', 3, 'Todo incluido', 'assets/img/hoteles/hotelmaricel.jpeg', '2026-07-01', '2026-07-08', 15, 5, 789.50, 0.00, 1, 'assets/img/mallorca.jpg', 'vacaciones', 0, 'Málaga', 1, 'Ubicación céntrica, habitaciones modernas y desayuno incluido.'),
(3, 'Escapada a Canarias 2', 'Vuelo + 7 noches de hotel en primera línea de playa. Sol, arena y aguas cristalinas todo el año en el paraíso canario.', 'Las Palmas, Gran Canaria', 'Hotel Playa Dorada', 5, 'Media pensión', 'assets/img/hoteles/5.jpeg', '2026-10-05', '2026-10-12', 30, 0, 100.00, 5.00, 1, 'assets/img/canarias.jpg', 'vacaciones', 1, 'Madrid', 1, 'Resort todo incluido, acceso directo a la playa y animación diaria.'),
(4, 'Semana en Mallorca', 'Todo incluido desde 399€ por persona. Una semana en la joya del Mediterráneo con playas, cultura y fiesta.', 'Palma de Mallorca, Baleares', 'Hotel Mar i Cel', 3, 'Todo incluido', 'assets/img/hoteles/hotelmaricel.jpeg', '2026-08-10', '2026-08-17', 25, 8, 399.00, 15.00, 1, 'assets/img/mallorca.jpg', 'vacaciones', 1, 'Valencia', 1, 'Hotel elegante, cerca del metro y recepción 24 horas.'),
(5, 'Fin de semana en Roma', 'Vuelos + 3 noches de hotel desde 199€. Visita el Coliseo, la Fontana di Trevi y disfruta de la mejor pasta italiana.', 'Roma, Italia', 'Hotel Colosseo', 3, 'Solo alojamiento', 'assets/img/hoteles/6.jpeg', '2026-11-20', '2026-11-23', 20, 1, 199.00, 0.00, 1, 'assets/img/roma.jpg', 'vacaciones', 1, 'Barcelona', 0, 'Alojamiento acogedor, vistas panorámicas y terraza chill out.'),
(6, 'Mallorca rural', 'Escapada de fin de semana a Mallorca. Combina naturaleza, cultura y relax en pocos días por el interior de la isla.', 'Serra de Tramuntana, Mallorca', 'Agroturismo Tramuntana', 4, 'Alojamiento y desayuno', 'assets/img/hoteles/1.jpeg', '2026-09-11', '2026-09-13', 12, 6, 249.00, 0.00, 1, 'assets/img/1.jpg', NULL, 0, 'Palma de Mallorca', 0, 'Spa completo, gimnasio equipado y restaurante gourmet.'),
(7, 'Sevilla que maravilla', 'Recorre Sevilla y sus principales monumentos. Disfruta de su cultura, gastronomía y del clima suave del otoño andaluz.', 'Sevilla, Andalucía', 'Hotel Giralda', 4, 'Alojamiento y desayuno', 'assets/img/hoteles/2.jpeg', '2026-11-04', '2026-11-08', 20, 14, 329.00, 5.00, 1, 'assets/img/2.jpg', NULL, 0, 'Madrid', 0, 'Ideal para familias, zona infantil y piscina climatizada.'),
(8, 'Asturias', 'Viaja a la costa de Asturias, descubre su encanto marinero, sus playas salvajes y su gastronomía tradicional.', 'Costa de Asturias', 'Hotel Mirador del Cantábrico', 3, 'Media pensión', 'assets/img/hoteles/3.jpeg', '2026-08-18', '2026-08-23', 18, 5, 459.00, 0.00, 1, 'assets/img/3.jpg', NULL, 0, 'Madrid', 1, 'Solo adultos, ambiente tranquilo y vistas al mar.'),
(9, 'Cáceres', 'Cáceres en Diciembre. Disfruta de sus calles empedradas, su gastronomía y el encanto invernal de la ciudad medieval.', 'Cáceres, Extremadura', 'Hotel Plaza Mayor', 3, 'Alojamiento y desayuno', 'assets/img/hoteles/4.jpeg', '2026-12-18', '2026-12-20', 16, 11, 179.00, 10.00, 0, 'assets/img/4.jpg', 'vacaciones', 0, 'Madrid', 0, 'Hotel boutique, decoración exclusiva y excelente valoración.'),
(11, 'Viajes a Cancún todo incluido', '', 'Cancún', '', 3, '', 'assets/img/hoteles/default.jpg', '2026-07-01', '2026-07-12', 10, 10, 1200.00, 0.00, 1, 'assets/img/default.jpg', 'vacaciones', 0, '', 0, ''),
(12, 'Viaje Los Angeles de Charlie', 'Buen sitio', 'Los Angeles / Estados Unidos', '', 3, '', 'assets/img/hoteles/losangeles.jpeg', '2026-08-01', '2026-08-16', 10, 10, 2200.00, 0.00, 1, 'assets/img/losangeles.jpeg', 'verano', 0, '', 0, ''),
(13, 'Viaje especial Turistea, solo ida', 'Pásatelo en grande esquivando misiles y proyectiles', 'Palestina', 'Hotel Trump', 4, 'Sólo cama', 'assets/img/hoteles/hotelmaricel.jpeg', '2026-05-01', '2026-05-08', 10, 10, 300.00, 50.00, 1, 'assets/img/palestina.jpeg', 'vacaciones', 1, 'Madrid', 0, 'Habitaciones sin paredes, recepción en escombros');

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
(1, 1, 3, 2, 200.00, 'PENDIENTE', '2026-05-05 21:19:04'),
(6, 11, 3, 2, 200.00, 'CANCELADA', '2026-05-06 21:11:37'),
(7, 11, 8, 2, 918.00, 'CONFIRMADA', '2026-05-07 17:30:19'),
(8, 11, 4, 2, 798.00, 'CONFIRMADA', '2026-05-09 16:46:54'),
(9, 11, 3, 2, 200.00, 'CONFIRMADA', '2026-05-09 16:47:52'),
(10, 11, 3, 2, 200.00, 'CONFIRMADA', '2026-05-12 17:58:18'),
(11, 11, 5, 3, 597.00, 'PENDIENTE', '2026-05-12 18:42:41'),
(12, 11, 3, 5, 500.00, 'CANCELADA', '2026-05-13 16:46:48'),
(13, 11, 3, 3, 300.00, 'CANCELADA', '2026-05-13 16:52:39');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarjeta_credito`
--

INSERT INTO `tarjeta_credito` (`id`, `usuario_id`, `titular`, `ultimos_4`, `vencimiento`, `created_at`) VALUES
(1, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-06 20:23:21'),
(2, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-06 20:28:10'),
(3, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-06 20:53:58'),
(4, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-06 21:01:19'),
(5, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-06 21:11:35'),
(6, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-07 17:30:17'),
(7, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-09 16:46:52'),
(8, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-09 16:47:50'),
(9, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-12 17:58:16'),
(10, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-12 18:42:17'),
(11, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-12 18:42:39'),
(12, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-13 16:46:46'),
(13, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-13 16:52:37'),
(14, 11, 'Yolanda Saez', '6666', '18/05', '2026-05-13 16:52:59');

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
(1, 'Juan', 'Luis', 'juanlu@gmail.com', '$2y$10$2ekFL7log9944yBPcVUCK.oUoKAtJ1EKWiO3KdZl2D7HgyJ1LiJwS', '4567854545', NULL, 'admin', 1, '2026-03-29 13:13:19'),
(2, 'Juan', 'Luis2', 'juanlu2@gmail.com', '$2y$10$y57LeWGwl1Wa3/O4HhuEjOo2L3jmVFCWTs1X3oYCpmHts4nqexonK', '4567854545', NULL, 'usuario', 1, '2026-03-29 13:16:48'),
(3, 'Pedro Manuel', 'Romero Justiciano', 'justiciano@gradenower.es', '$2y$10$y.A8fOXjmSS9n3W0ivpkxOeh2zf4y4r0Nk0xPOMpkUFBzvawzMy6y', '+34 628628628', NULL, 'usuario', 1, '2026-03-29 13:31:23'),
(4, 'Pedro Manuel2', 'Romero Justiciano2', 'justiciano2@gradenower.es', '$2y$10$n99e0xOTaQcw7eqZjc0Ot.NlKOFcWATq4hoBr3077xD0G3Hy6AbZC', '+34 628628628', NULL, 'usuario', 1, '2026-03-29 13:33:18'),
(5, 'Juan3', 'Luis3', 'juanlu4@gmail.com', '$2y$10$HR4slFRrb3/.aOrZk/Pgm.5j7Klmtd47sroef3dB3/whGPPcA16/O', '4567854545', NULL, 'usuario', 0, '2026-03-29 13:33:44'),
(6, 'Juan46', 'Luis45', 'juanluramos45@gmail.com', '$2y$10$PRTAZj0IB9mJhKa6D59uReiQ0cM0gwBoNWM3MdGiwAGatyVefGU6i', '345346345', NULL, 'usuario', 0, '2026-03-29 13:36:26'),
(7, 'Juanillo', 'Luisillo', 'juanluramosillo@gmail.com', '$2y$10$0MPVMlPQdQAJ8w/DuBuGzOWNnW40h7NLZxxcYK6rzK6D7iXcAypQO', '+34 123456123', NULL, 'usuario', 1, '2026-03-29 13:49:58'),
(8, 'Juan', 'Luis', 'admin@admin.com', '$2y$10$IrOQdsCL49NRj82deJLjm.EBZ847t0F1JypGHNGhQPqE0HDWh7E/y', '+34 628628628', NULL, 'usuario', 1, '2026-04-06 20:34:37'),
(9, 'Gegrorio', 'Ordoñez', 'gergorio@xn--ordoez-zwa.com', '$2y$10$zirySmnhBSaVmcfyYsvGIumjQdhXFmL8Rj6oxoKKSv75zhVpnXk/m', '+34 628628628', NULL, 'usuario', 1, '2026-04-06 20:35:20'),
(10, 'Juan', 'Luis', 'felipe@gmail.com', '$2y$10$1knQXA0BAyLkdub3JtkWJuJLYangM.F3ymk5Y.8TIV7IrxYjMd8vW', '+34 628628628', NULL, 'admin', 1, '2026-04-08 03:37:47'),
(11, 'Yolanda', 'Saez Muñoz', 'yolsamu@yahoo.es', '$2y$10$p1ETF2er51r4yChIrUuuv.8prkcRMyDuMh/w1TQicGa/sZ1Dp2ULq', '696031000', NULL, 'usuario', 1, '2026-05-04 10:48:48');

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
(1, 10, 'Juan', 'Luis', '442696621', '2015-01-13'),
(2, 10, 'Nola', 'Luis', 'asdfasdfasdf', '2026-05-15');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_comentario_usuario_paquete` (`usuario_id`,`paquete_id`),
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tarjeta_credito`
--
ALTER TABLE `tarjeta_credito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `viajero`
--
ALTER TABLE `viajero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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

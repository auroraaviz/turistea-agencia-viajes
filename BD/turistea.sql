-- phpMyAdmin SQL Dump
-- version 5.2.1deb1+deb12u1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 01-04-2026 a las 14:34:15
-- Versión del servidor: 10.11.14-MariaDB-0+deb12u2
-- Versión de PHP: 8.2.30

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
  `descuento` decimal(5,2) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(4, 'Pedro Manuel2', 'Romero Justiciano2', 'justiciano2@gradenower.es', '$2y$10$n99e0xOTaQcw7eqZjc0Ot.NlKOFcWATq4hoBr3077xD0G3Hy6AbZC', '+34 628628628', NULL, 'usuario', 1, '2026-03-29 13:33:18'),
(5, 'Juan3', 'Luis3', 'juanlu4@gmail.com', '$2y$10$HR4slFRrb3/.aOrZk/Pgm.5j7Klmtd47sroef3dB3/whGPPcA16/O', '4567854545', NULL, 'usuario', 1, '2026-03-29 13:33:44'),
(6, 'Juan46', 'Luis45', 'juanluramos45@gmail.com', '$2y$10$PRTAZj0IB9mJhKa6D59uReiQ0cM0gwBoNWM3MdGiwAGatyVefGU6i', '345346345', NULL, 'usuario', 1, '2026-03-29 13:36:26'),
(7, 'Juanillo', 'Luisillo', 'juanluramosillo@gmail.com', '$2y$10$0MPVMlPQdQAJ8w/DuBuGzOWNnW40h7NLZxxcYK6rzK6D7iXcAypQO', '+34 123456123', NULL, 'usuario', 1, '2026-03-29 13:49:58');

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
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `excursion`
--
ALTER TABLE `excursion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `favorito`
--
ALTER TABLE `favorito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `paquete`
--
ALTER TABLE `paquete`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `viajero`
--
ALTER TABLE `viajero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

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
-- Filtros para la tabla `viajero`
--
ALTER TABLE `viajero`
  ADD CONSTRAINT `viajero_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

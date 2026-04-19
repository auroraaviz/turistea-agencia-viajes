-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-04-2026 a las 21:13:28
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
(1, 'Aventura en los Pirineos', 'Descubre los paisajes más impresionantes del Pirineo aragonés. Rutas de senderismo, pueblos medievales y gastronomía local en un viaje inolvidable de 5 días.', 'Huesca, Aragón', 'Hotel Monte Perdido', 4, 'Media pensión', 'assets/img/hoteles/hotelmonteperdido.jpeg', '2026-06-15', '2026-06-20', 20, 12, 549.00, 10.00, 1, 'assets/img/huesca.jpeg', NULL, 1, 'Barcelona', 0, 'WiFi gratis, piscina exterior, desayuno buffet y parking privado.'),
(2, 'Relax en la Costa Brava', 'Disfruta del Mediterráneo con playas de aguas cristalinas, calas escondidas y una oferta cultural única. Incluye excursión en barco y visita a Tossa de Mar.', 'Girona, Cataluña', 'Hotel Mar i Cel', 3, 'Todo incluido', 'assets/img/hoteles/hotelmaricel.jpeg', '2026-07-01', '2026-07-08', 15, 5, 789.50, 0.00, 1, 'assets/img/mallorca.jpg', NULL, 0, 'Málaga', 1, 'Ubicación céntrica, habitaciones modernas y desayuno incluido.'),
(3, 'Escapada a Canarias', 'Vuelo + 7 noches de hotel en primera línea de playa. Sol, arena y aguas cristalinas todo el año en el paraíso canario.', 'Las Palmas, Gran Canaria', 'Hotel Playa Dorada', 4, 'Media pensión', 'assets/img/hoteles/5.jpeg', '2026-10-05', '2026-10-12', 30, 18, 529.00, 5.00, 1, 'assets/img/canarias.jpg', NULL, 1, 'Madrid', 1, 'Resort todo incluido, acceso directo a la playa y animación diaria.'),
(4, 'Semana en Mallorca', 'Todo incluido desde 399€ por persona. Una semana en la joya del Mediterráneo con playas, cultura y fiesta.', 'Palma de Mallorca, Baleares', 'Hotel Mar i Cel', 3, 'Todo incluido', 'assets/img/hoteles/hotelmaricel.jpeg', '2026-08-10', '2026-08-17', 25, 10, 399.00, 15.00, 1, 'assets/img/mallorca.jpg', NULL, 1, 'Valencia', 1, 'Hotel elegante, cerca del metro y recepción 24 horas.'),
(5, 'Fin de semana en Roma', 'Vuelos + 3 noches de hotel desde 199€. Visita el Coliseo, la Fontana di Trevi y disfruta de la mejor pasta italiana.', 'Roma, Italia', 'Hotel Colosseo', 3, 'Solo alojamiento', 'assets/img/hoteles/6.jpeg', '2026-11-20', '2026-11-23', 20, 8, 199.00, 0.00, 1, 'assets/img/roma.jpg', NULL, 1, 'Barcelona', 0, 'Alojamiento acogedor, vistas panorámicas y terraza chill out.'),
(6, 'Mallorca rural', 'Escapada de fin de semana a Mallorca. Combina naturaleza, cultura y relax en pocos días por el interior de la isla.', 'Serra de Tramuntana, Mallorca', 'Agroturismo Tramuntana', 4, 'Alojamiento y desayuno', 'assets/img/hoteles/1.jpeg', '2026-09-11', '2026-09-13', 12, 6, 249.00, 0.00, 1, 'assets/img/1.jpg', NULL, 0, 'Palma de Mallorca', 0, 'Spa completo, gimnasio equipado y restaurante gourmet.'),
(7, 'Sevilla que maravilla', 'Recorre Sevilla y sus principales monumentos. Disfruta de su cultura, gastronomía y del clima suave del otoño andaluz.', 'Sevilla, Andalucía', 'Hotel Giralda', 4, 'Alojamiento y desayuno', 'assets/img/hoteles/2.jpeg', '2026-11-04', '2026-11-08', 20, 14, 329.00, 5.00, 1, 'assets/img/2.jpg', NULL, 0, 'Madrid', 0, 'Ideal para familias, zona infantil y piscina climatizada.'),
(8, 'Asturias', 'Viaja a la costa de Asturias, descubre su encanto marinero, sus playas salvajes y su gastronomía tradicional.', 'Costa de Asturias', 'Hotel Mirador del Cantábrico', 3, 'Media pensión', 'assets/img/hoteles/3.jpeg', '2026-08-18', '2026-08-23', 18, 9, 459.00, 0.00, 1, 'assets/img/3.jpg', NULL, 0, 'Madrid', 1, 'Solo adultos, ambiente tranquilo y vistas al mar.'),
(9, 'Cáceres', 'Cáceres en Diciembre. Disfruta de sus calles empedradas, su gastronomía y el encanto invernal de la ciudad medieval.', 'Cáceres, Extremadura', 'Hotel Plaza Mayor', 3, 'Alojamiento y desayuno', 'assets/img/hoteles/4.jpeg', '2026-12-18', '2026-12-20', 16, 11, 179.00, 10.00, 1, 'assets/img/4.jpg', NULL, 0, 'Madrid', 0, 'Hotel boutique, decoración exclusiva y excelente valoración.');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `paquete`
--
ALTER TABLE `paquete`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `paquete`
--
ALTER TABLE `paquete`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Migración: tabla tarjeta_credito
CREATE TABLE IF NOT EXISTS `tarjeta_credito` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `titular` varchar(150) NOT NULL,
  `ultimos_4` char(4) NOT NULL,
  `vencimiento` varchar(5) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_tarjeta_usuario` (`usuario_id`),
  CONSTRAINT `fk_tarjeta_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Migracion: tabla comentario
CREATE TABLE IF NOT EXISTS `comentario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `paquete_id` int(11) DEFAULT NULL,
  `titulo_viaje` varchar(150) NOT NULL,
  `comentario` text NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `valoracion_viaje` tinyint(1) NOT NULL,
  `valoracion_compania` tinyint(1) NOT NULL,
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_comentario_usuario_paquete` (`usuario_id`, `paquete_id`),
  KEY `fk_comentario_usuario` (`usuario_id`),
  KEY `fk_comentario_paquete` (`paquete_id`),
  CONSTRAINT `fk_comentario_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comentario_paquete` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_comentario_valoracion_viaje` CHECK (`valoracion_viaje` BETWEEN 1 AND 5),
  CONSTRAINT `chk_comentario_valoracion_compania` CHECK (`valoracion_compania` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

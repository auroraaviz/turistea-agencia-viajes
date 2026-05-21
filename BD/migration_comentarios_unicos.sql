-- Migracion: una reseña por usuario y paquete
ALTER TABLE `comentario`
  ADD UNIQUE KEY `uq_comentario_usuario_paquete` (`usuario_id`, `paquete_id`);

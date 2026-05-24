-- Migración: añade hash no reversible a las tarjetas guardadas
ALTER TABLE `tarjeta_credito`
  ADD COLUMN IF NOT EXISTS `tarjeta_hash` varchar(255) DEFAULT NULL AFTER `vencimiento`;

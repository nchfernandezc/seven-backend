-- Sentencia SQL para crear la tabla a_usuario
-- Basada en la entidad Usuario de TypeORM

CREATE TABLE `a_usuario` (
  `xxx` INT NOT NULL AUTO_INCREMENT,
  `id` INT NOT NULL COMMENT 'id_apk (Company ID)',
  `usuario` VARCHAR(100) NOT NULL,
  `detalle` VARCHAR(200) DEFAULT NULL,
  `vendedor` VARCHAR(50) NOT NULL COMMENT 'vendedor_apk',
  `clave` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`xxx`),
  UNIQUE INDEX `IDX_UNIQUE_ID_VENDEDOR` (`id`, `vendedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

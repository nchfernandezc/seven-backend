-- Database: seven_backend
-- Structure and Data Dump for Company 001

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- GLOBAL TABLES
-- --------------------------------------------------------

--
-- Table structure for table `empresas`
--

CREATE TABLE IF NOT EXISTS `empresas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT current_timestamp(6),
  `updated_at` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `nombre` varchar(100) NOT NULL,
  `identificacion` varchar(50) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_identificacion` (`identificacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `empresas`
--

INSERT INTO `empresas` (`id`, `nombre`, `identificacion`, `direccion`, `telefono`) VALUES
(1, 'Empresa Demo S.A.', 'J-12345678-9', 'Av. Principal Las Mercedes', '0212-9999999');

-- --------------------------------------------------------

--
-- Table structure for table `a_usuario`
--

CREATE TABLE IF NOT EXISTS `a_usuario` (
  `xxx` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL COMMENT 'id_apk',
  `usuario` varchar(100) NOT NULL,
  `detalle` varchar(200) DEFAULT NULL,
  `vendedor` varchar(50) NOT NULL COMMENT 'vendedor_apk',
  `contraseña` varchar(100) NOT NULL,
  PRIMARY KEY (`xxx`),
  UNIQUE KEY `IDX_usuario_vendedor` (`id`, `vendedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `a_usuario`
--

INSERT INTO `a_usuario` (`id`, `usuario`, `detalle`, `vendedor`, `contraseña`) VALUES
(1, 'Vendedor 1', 'Usuario Movil 1', 'VEN001', '1234');

-- --------------------------------------------------------
-- COMPANY SPECIFIC TABLES (XXX_TABLE)
-- Company ID: 001
-- --------------------------------------------------------

--
-- Table structure for table `001_articulo`
--

CREATE TABLE IF NOT EXISTS `001_articulo` (
  `xxx` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL DEFAULT 1,
  `ccod` varchar(50) NOT NULL,
  `cdet` varchar(200) NOT NULL,
  `cuni` varchar(20) DEFAULT '',
  `cref` varchar(50) DEFAULT '',
  `npre1` decimal(18,3) DEFAULT 0.000,
  `npre2` decimal(18,3) DEFAULT 0.000,
  `ncan1` decimal(18,3) DEFAULT 0.000,
  `ides` int(11) DEFAULT 0,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `last_synced_at` datetime DEFAULT NULL,
  `device_id` varchar(100) DEFAULT NULL,
  `dfec` datetime DEFAULT NULL,
  PRIMARY KEY (`xxx`),
  UNIQUE KEY `IDX_001_articulo_codigo` (`ccod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `001_articulo`
--

INSERT INTO `001_articulo` (`id`, `ccod`, `cdet`, `cuni`, `cref`, `npre1`, `ncan1`, `ides`, `dfec`) VALUES
(1, 'TEST-001', 'Samsung Galaxy S24', 'UND', 'REF-S24', 1200.000, 100.000, 0, NOW()),
(1, 'TEST-002', 'iPhone 15 Pro', 'UND', 'REF-IP15', 1300.000, 50.000, 0, NOW()),
(1, 'TEST-003', 'Laptop Dell XPS', 'UND', 'REF-XPS', 1500.000, 20.000, 0, NOW());

-- --------------------------------------------------------

--
-- Table structure for table `001_cliente`
--

CREATE TABLE IF NOT EXISTS `001_cliente` (
  `xxx` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL DEFAULT 1,
  `ccod` varchar(20) NOT NULL,
  `cdet` varchar(200) NOT NULL,
  `cdir` varchar(200) DEFAULT NULL,
  `ctel` varchar(100) DEFAULT NULL,
  `cven` varchar(10) NOT NULL DEFAULT '',
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `last_synced_at` datetime DEFAULT NULL,
  `device_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`xxx`),
  UNIQUE KEY `IDX_001_cliente_codigo` (`ccod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `001_cliente`
--

INSERT INTO `001_cliente` (`id`, `ccod`, `cdet`, `cdir`, `ctel`, `cven`) VALUES
(1, 'C-001', 'Cliente Mostrador', 'Av. Bolivar', '0414-1234567', 'VEN001'),
(1, 'C-002', 'Inversiones XYZ', 'Centro Comercial City Market', '0412-7654321', 'VEN001');

-- --------------------------------------------------------

--
-- Table structure for table `001_cxc`
--

CREATE TABLE IF NOT EXISTS `001_cxc` (
  `xxx` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL DEFAULT 1,
  `cdoc` varchar(10) NOT NULL,
  `inum` int(11) NOT NULL,
  `dfec` datetime NOT NULL,
  `nsal` decimal(12,2) NOT NULL,
  `ccli` varchar(20) NOT NULL,
  `ista` int(11) DEFAULT 0,
  `cven` varchar(10) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `last_synced_at` datetime DEFAULT NULL,
  `device_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`xxx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `001_cxc`
--

INSERT INTO `001_cxc` (`id`, `cdoc`, `inum`, `dfec`, `nsal`, `ccli`, `ista`, `cven`) VALUES
(1, 'FAC', 1001, NOW(), 500.00, 'C-001', 0, 'VEN001'),
(1, 'FAC', 1002, NOW(), 120.50, 'C-001', 0, 'VEN001'),
(1, 'ENT', 2001, NOW(), 1500.00, 'C-002', 0, 'VEN001');

-- --------------------------------------------------------

--
-- Table structure for table `001_pedido`
--

CREATE TABLE IF NOT EXISTS `001_pedido` (
  `xxx` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL DEFAULT 1,
  `num` varchar(30) NOT NULL,
  `ven` varchar(10) DEFAULT '',
  `fic` varchar(20) DEFAULT '',
  `cod` varchar(30) NOT NULL,
  `des` varchar(100) DEFAULT '',
  `obs` text DEFAULT NULL,
  `ctra` varchar(50) DEFAULT '',
  `ccho` varchar(50) DEFAULT '',
  `cayu` varchar(50) DEFAULT '',
  `cche` varchar(50) DEFAULT '',
  `cdep` varchar(10) DEFAULT '',
  `cdes` varchar(50) DEFAULT '',
  `rep` varchar(10) DEFAULT '',
  `ibul` int(11) DEFAULT 0,
  `ihor1` int(11) DEFAULT 0,
  `cli` varchar(20) NOT NULL,
  `cusu` varchar(30) DEFAULT '',
  `can` decimal(12,2) DEFAULT 0.00,
  `pre` decimal(18,2) DEFAULT 0.00,
  `ifac` int(11) DEFAULT 0,
  `nmon` decimal(18,2) DEFAULT 0.00,
  `ngra` decimal(18,2) DEFAULT 0.00,
  `ntax` decimal(18,2) DEFAULT 0.00,
  `pvp` decimal(18,2) DEFAULT 0.00,
  `pcli` decimal(18,2) DEFAULT 0.00,
  `pvol` decimal(18,2) DEFAULT 0.00,
  `bac` decimal(18,2) DEFAULT 0.00,
  `ndolar` decimal(18,2) DEFAULT 0.00,
  `dfec` datetime NOT NULL,
  `dgui` datetime DEFAULT NULL,
  `iprt` int(11) DEFAULT 0,
  `itip` int(11) DEFAULT 0,
  `ifor` int(11) DEFAULT 0,
  `imar` int(11) DEFAULT 0,
  `igui` int(11) DEFAULT 0,
  `iprefac` int(11) DEFAULT 0,
  `imin1` int(11) DEFAULT 0,
  `iam1` int(11) DEFAULT 0,
  `ihor2` int(11) DEFAULT 0,
  `imin2` int(11) DEFAULT 0,
  `iam2` int(11) DEFAULT 0,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `last_synced_at` datetime DEFAULT NULL,
  `device_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`xxx`),
  KEY `IDX_001_pedido_num` (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `001_pedido`
--

INSERT INTO `001_pedido` (`id`, `num`, `ven`, `cod`, `des`, `can`, `pre`, `cli`, `dfec`, `itip`) VALUES
(1, 'PED-1001', 'VEN001', 'TEST-001', 'Samsung Galaxy S24', 2.00, 1200.00, 'C-001', NOW(), 1);

COMMIT;

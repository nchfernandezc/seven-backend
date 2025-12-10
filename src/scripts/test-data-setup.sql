-- Script de Prueba para Configuración Inicial
-- Base de datos: sistema

USE sistema;

-- Limpiar datos de prueba anteriores (opcional)
-- DELETE FROM vendedores WHERE codigo LIKE 'VEN-%';
-- DELETE FROM empresas WHERE identificacion LIKE 'J-TEST%';

-- Insertar empresas de prueba
INSERT INTO empresas (nombre, identificacion, direccion, telefono) 
VALUES 
    ('Distribuidora El Sol C.A.', 'J-12345678-9', 'Av. Libertador, Caracas', '0212-5551234'),
    ('Comercial La Luna S.A.', 'J-98765432-1', 'Calle Principal, Valencia', '0241-5554321'),
    ('Importadora Estrella', 'J-11223344-5', 'Zona Industrial, Maracay', '0243-5556789')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Obtener los IDs de las empresas insertadas
SET @empresa1_id = (SELECT id FROM empresas WHERE identificacion = 'J-12345678-9');
SET @empresa2_id = (SELECT id FROM empresas WHERE identificacion = 'J-98765432-1');
SET @empresa3_id = (SELECT id FROM empresas WHERE identificacion = 'J-11223344-5');

-- Insertar vendedores de prueba
INSERT INTO vendedores (nombre, codigo, telefono, empresa_id) 
VALUES 
    -- Vendedores de Distribuidora El Sol
    ('Juan Pérez', 'VEN-001', '0414-1234567', @empresa1_id),
    ('María González', 'VEN-002', '0424-2345678', @empresa1_id),
    ('Carlos Rodríguez', 'VEN-003', '0412-3456789', @empresa1_id),
    
    -- Vendedores de Comercial La Luna
    ('Ana Martínez', 'VEN-001', '0416-4567890', @empresa2_id),
    ('Luis Fernández', 'VEN-002', '0426-5678901', @empresa2_id),
    
    -- Vendedores de Importadora Estrella
    ('Pedro Sánchez', 'VEN-001', '0414-6789012', @empresa3_id),
    ('Laura Torres', 'VEN-002', '0424-7890123', @empresa3_id)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), telefono = VALUES(telefono);

-- Verificar los datos insertados
SELECT 
    v.id,
    v.codigo AS 'Código Vendedor',
    v.nombre AS 'Nombre Vendedor',
    v.telefono AS 'Teléfono',
    e.id AS 'ID Empresa',
    e.nombre AS 'Nombre Empresa',
    e.identificacion AS 'RIF'
FROM vendedores v
INNER JOIN empresas e ON v.empresa_id = e.id
ORDER BY e.nombre, v.codigo;

-- Mostrar resumen
SELECT 
    '=== DATOS DE PRUEBA PARA CONFIGURACIÓN INICIAL ===' AS '';

SELECT 
    CONCAT('Empresa ID: ', id, ' | Nombre: ', nombre, ' | RIF: ', identificacion) AS 'Empresas Disponibles'
FROM empresas
WHERE identificacion LIKE 'J-%';

SELECT '' AS '';

SELECT 
    CONCAT('Empresa: ', e.nombre, ' | Código: ', v.codigo, ' | Vendedor: ', v.nombre) AS 'Vendedores Disponibles'
FROM vendedores v
INNER JOIN empresas e ON v.empresa_id = e.id
WHERE v.codigo LIKE 'VEN-%'
ORDER BY e.nombre, v.codigo;

SELECT '' AS '';
SELECT 'Para probar la configuración inicial, usa:' AS '';
SELECT 'ID Empresa: 1 (o el ID mostrado arriba)' AS '';
SELECT 'Código Vendedor: VEN-001' AS '';
SELECT 'Nombre: Tu nombre' AS '';

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/seeds/seed.ts
const database_1 = require("../config/database");
const Articulo_1 = require("../entities/Articulo");
const Cliente_1 = require("../entities/Cliente");
const Cxcobrar_1 = require("../entities/Cxcobrar");
const Pedido_1 = require("../entities/Pedido");
// Generate CREATE TABLE SQL dynamically based on Entity Metadata and a prefix
function generateCreateTableSql(metadata, tableName) {
    const columns = metadata.columns.map(col => {
        let colSql = `\`${col.databaseName}\` `;
        let type = 'VARCHAR(255)';
        // CORRECCIÓN: Detectar explícitamente PKs generadas e IDs como INT
        if ((col.isPrimary && col.isGenerated) || col.databaseName === 'xxx' || col.databaseName === 'id' || col.propertyName === 'empresaId') {
            type = 'INT';
        }
        else if (col.type === 'int')
            type = 'INT';
        else if (col.type === 'decimal')
            type = `DECIMAL(${col.precision || 18},${col.scale || 2})`;
        else if (col.type === 'varchar')
            type = `VARCHAR(${col.length || 255})`;
        else if (col.type === 'text')
            type = 'TEXT';
        else if (col.type === 'datetime')
            type = 'DATETIME';
        else if (col.type === 'date')
            type = 'DATE';
        else if (col.type === 'boolean')
            type = 'TINYINT(1)';
        colSql += type;
        if (!col.isNullable)
            colSql += ' NOT NULL';
        if (col.default !== undefined) {
            if (typeof col.default === 'string')
                colSql += ` DEFAULT '${col.default}'`;
            else
                colSql += ` DEFAULT ${col.default}`;
        }
        else if (col.isNullable) {
            colSql += ' DEFAULT NULL';
        }
        if (col.isGenerated && col.generationStrategy === 'increment') {
            colSql += ' AUTO_INCREMENT';
        }
        return colSql;
    });
    const pkCols = metadata.primaryColumns.map(c => `\`${c.databaseName}\``).join(', ');
    if (pkCols) {
        columns.push(`PRIMARY KEY (${pkCols})`);
    }
    return `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columns.join(', ')});`;
}
async function seedDatabase() {
    const queryRunner = database_1.AppDataSource.createQueryRunner();
    try {
        await database_1.AppDataSource.initialize();
        console.log('Conexión a la base de datos establecida');
        await queryRunner.connect();
        await queryRunner.startTransaction();
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryRunner.query("SET SESSION sql_mode='NO_AUTO_VALUE_ON_ZERO';");
        try {
            console.log('1. Preparando tablas estáticas (empresas, vendedores)...');
            // Aseguramos que existan las tablas estáticas
            await queryRunner.query(`DELETE FROM empresas`);
            await queryRunner.query(`ALTER TABLE empresas AUTO_INCREMENT = 1`);
            await queryRunner.query(`DELETE FROM vendedores`);
            await queryRunner.query(`ALTER TABLE vendedores AUTO_INCREMENT = 1`);
            // Insertar Empresa 1
            console.log('   - Creando Empresa "Seven App Demo" (ID: 1)...');
            await queryRunner.query(`
            INSERT INTO empresas (id, nombre, identificacion, direccion, telefono, created_at, updated_at)
            VALUES (1, 'Seven App Demo', '001', 'Dirección Local', '555-0001', NOW(), NOW())
        `);
            // Insertar Vendedor VEN001
            console.log('   - Creando Vendedor "VEN001" (Login)...');
            await queryRunner.query(`
            INSERT INTO vendedores (id, nombre, codigo, empresa_id, created_at, updated_at)
            VALUES (1, 'Usuario Demo', 'VEN001', 1, NOW(), NOW())
        `);
            // Insertar Vendedor 07 (Referenciado en los pedidos de ejemplo)
            console.log('   - Creando Vendedor "07" (Referencias)...');
            await queryRunner.query(`
            INSERT INTO vendedores (id, nombre, codigo, empresa_id, created_at, updated_at)
            VALUES (2, 'Vendedor Referencia', '07', 1, NOW(), NOW())
        `);
            // --- PROCESO PARA EMPRESA 001 ---
            const companyId = '001';
            const companyIdInt = 1;
            console.log(`2. Configurando tablas dinámicas para empresa ${companyId}...`);
            const dynamicTables = [
                { entity: Articulo_1.Articulo, name: `${companyId}_articulo` },
                { entity: Cliente_1.Cliente, name: `${companyId}_cliente` },
                { entity: Cxcobrar_1.Cxcobrar, name: `${companyId}_cxc` },
                { entity: Pedido_1.Pedido, name: `${companyId}_pedido` }
            ];
            for (const tbl of dynamicTables) {
                const metadata = database_1.AppDataSource.getMetadata(tbl.entity);
                const createSql = generateCreateTableSql(metadata, tbl.name);
                await queryRunner.query(`DROP TABLE IF EXISTS \`${tbl.name}\``);
                await queryRunner.query(createSql);
                console.log(`   - Tabla ${tbl.name} recreada.`);
            }
            console.log('3. Insertando datos de prueba en tablas dinámicas...');
            // 1. Articulos (Creando todos los productos necesarios para los pedidos)
            console.log('   - Insertando Artículos...');
            const articulosData = [
                `('52077210', 'GOTAS CHOCOLATE LECHE 250 GR', 3.00, 10.00)`,
                `('J02136', 'SALCHICHA T/VIENA ARICHUNA 450GRX12UND', 52.47, 100.00)`,
                `('A02004', 'PIERNA ARICHUNA 4X5.9KG', 13.00, 50.00)`,
                `('B02003', 'ESPALDA VIGOR 4X5.1KG', 6.86, 40.00)`,
                `('A02067', 'JAMON PIERNA FELIZ GIIOS', 7.96, 30.00)`
            ];
            for (const art of articulosData) {
                // Parseamos manualmente para flexibilidad
                // art es un string "(code, name, price, stock)"
                const parts = art.replace(/[()']/g, '').split(', ');
                const code = parts[0];
                const name = parts[1];
                const price = parts[2];
                await queryRunner.query(`
                INSERT INTO \`${companyId}_articulo\` (id, ccod, cdet, npre1, ncan1, cuni, ccodx, cmod, cusu, cmaq, npre2, npre3, npre4, npre5, npre6, npor1, npor2, ncos, ncan2, ncan3, itip, cref, iiva, cdep, ccla, ccol, cmar, ncan4, npes, ndolar, ivid, imix, cpre, cubi, cest, cniv, cpos, cfor1, cfor2, cfor3, cfor4, iroj, icon, nroj, ncan5, ncan7, ncan8, ncan9, ncan10, ncan11, ncan12, ivac, ipal, ifis, ific, ides, ncan6, ihas, ista, isube, dfec)
                VALUES (${companyIdInt}, '${code}', '${name}', ${price}, 100, '', '', '', 'ADMIN', 'LOCALHOST', 0,0,0,0,0, 0.01, 0, 1.00, 0,0, 1, '', 0, '', '', '', '', 0, 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-01-01 00:00:00')
             `);
            }
            // 2. Cliente (Usaremos código 'CL001' para consistencia)
            console.log('   - Insertando Cliente Consistente...');
            const clienteCodigo = 'CL001';
            await queryRunner.query(`
          INSERT INTO \`${companyId}_cliente\` (id, ccod, cdet, cdir, ctel, cven, crif, cruc, cmai, ccon, ctvt, czon, ccir, csup, csada, iblo, imas, itas, dfecn, dfec, nfle, ndes, icon, idob, igec, iprt, isube, ivip, ipag, ifor, iequ, ican, ccoc, cblo, icos, ifre, isec, clat, clon, cenc, nlim, i_lun, i_mar, i_mie, i_jue, i_vie, cciu, isup, ccan, ccal, csec, cmov, cban1, cnum1, cban2, cnum2, cban3, cnum3, isuc, ise, ista, cpur, ccas, ific, cvia1, cvia2, cpro, ipve, npve, cpve, cven1, csup1, cent1, cven2, csup2, cent2, clave, ncom1) 
          VALUES (${companyIdInt}, '${clienteCodigo}', 'CLIENTE DEMOSTRACION', 'AV. PRINCIPAL', '0414-1234567', 'VEN001', 'J-12345678-9', '', 'cliente@demo.com', '', '', '', 'VEN001', '', '', 0, 0, 0, '2000-01-01', '2025-01-01 00:00:00', 0.00, 0.00, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', 0, 0, 0, '', '', '', 1000.00, 0, 0, 0, 0, 0, 'CIUDAD', 0, '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', '', 0, '', '', '', 0, 0.00, '', '', '', '', '', '', '', '', 0.00)
        `);
            // 3. CxC (Asociada al cliente CL001)
            console.log('   - Insertando Cuenta por Cobrar...');
            await queryRunner.query(`
          INSERT INTO \`${companyId}_cxc\` (id, cdoc, ccli, inum, nnet, niva, dfec, nsal, idia, ista, ival, iprt, ifis, ccon, cven, iafe, cafe, ifor, cinf, cnro, nret1, nret2, cnro1, cnro2, ipp, isube, nexe, nnetyx, nivax, nsalx, nexex, itip, ipag, imon, idoc, imar, cfac, cnum, cche, cfr1, cfr2, cdet, dven, dfac, nsal2, nbolivar, ndolar, crel, cusu, csuc) 
          VALUES (${companyIdInt}, 'FAC', '${clienteCodigo}', 5001, 100.00, 16.00, '2025-01-05 00:00:00', 116.00, 0, 0, 0, 0, 0, '', 'VEN001', 0, '', 0, '', '', 0, 0, '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', 'FACTURA PENDIENTE', NULL, NULL, 0, 0, 0, '', 'ADMIN', '01')
        `);
            // 4. Pedidos (Pedido único 'PED-1010' con múltiples items, asociado a CL001)
            console.log('   - Insertando Pedido con múltiples items...');
            const pedidoNum = 'PED-1010';
            // (num, ven, cod, des, cantidad, precio)
            const itemsPedido = [
                `('${pedidoNum}', 'VEN001', 'J02136', 'SALCHICHA T/VIENA', 2, 52.47)`, // Item 1
                `('${pedidoNum}', 'VEN001', 'A02004', 'PIERNA ARICHUNA', 1, 13.00)`, // Item 2
                `('${pedidoNum}', 'VEN001', '52077210', 'GOTAS CHOCOLATE', 5, 3.00)` // Item 3
            ];
            for (const item of itemsPedido) {
                const parts2 = item.replace(/[()']/g, '').split(', ');
                const pNum = parts2[0];
                const pVen = parts2[1];
                const pCod = parts2[2];
                const pDes = parts2[3];
                const pCan = parts2[4];
                const pPre = parts2[5];
                await queryRunner.query(`
              INSERT INTO \`${companyId}_pedido\` (num, ven, cod, des, can, pre, cli, id, fic, obs, ctra, ccho, cayu, cche, cdep, cdes, rep, ibul, ihor1, cusu, ifac, nmon, ngra, ntax, pvp, pcli, pvol, bac, ndolar, dfec, dgui, iprt, itip, ifor, imar, igui, iprefac, imin1, iam1, ihor2, imin2, iam2) 
              VALUES ('${pNum}', '${pVen}', '${pCod}', '${pDes}', ${pCan}, ${pPre}, '${clienteCodigo}', ${companyIdInt}, '', 'Pedido multi-item demo', '', '', '', '', '', '', '', 0, 0, 'ADMIN', 0, 0, 0, 0, 0, 0, 0, 0, 0, '2025-01-09 00:00:00', NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            `);
            }
            await queryRunner.commitTransaction();
            console.log(`✅ Base de datos Consistentemente restaurada para empresa ${companyId}.`);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ Error en seed:', error);
            throw error;
        }
    }
    catch (error) {
        console.error('Error general:', error);
    }
    finally {
        try {
            await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
        }
        catch (e) { }
        if (database_1.AppDataSource.isInitialized)
            await database_1.AppDataSource.destroy();
    }
}
seedDatabase();

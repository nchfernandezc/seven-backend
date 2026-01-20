"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
const typeorm_1 = require("typeorm");
const Cxcobrar_1 = require("./Cxcobrar");
const Pedido_1 = require("./Pedido");
const Vendedor_1 = require("./Vendedor");
const Empresa_1 = require("./Empresa");
let Cliente = class Cliente {
    constructor() {
        // Campos App
        this.isDeleted = false;
    }
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'xxx' }),
    __metadata("design:type", Number)
], Cliente.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cliente.prototype, "empresaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccod', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Cliente.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdet', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], Cliente.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdir', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ctel', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'crif', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "rif", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cruc', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "ruc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cmai', type: 'varchar', length: 100, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccon', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "contacto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ctvt', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "ctvt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'czon', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "zona", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cven', type: 'varchar', length: 10, nullable: false, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "vendedorCodigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccir', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "ccir", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'csup', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "csup", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'csada', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "csada", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iblo', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "iblo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imas', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "imas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'itas', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "itas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dfecn', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Cliente.prototype, "fechaNacimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dfec', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Cliente.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nfle', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "nfle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ndes', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ndes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'icon', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idob', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "idob", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'igec', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "igec", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iprt', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "iprt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isube', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "isube", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ivip', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ivip", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ipag', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ipag", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ifor', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ifor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iequ', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "iequ", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ican', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ican", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccoc', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "ccoc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cblo', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cblo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'icos', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "icos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ifre', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ifre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isec', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "isec", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clat', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "latitud", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clon', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "longitud", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cenc', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cenc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nlim', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "limiteCredito", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'i_lun', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "iLun", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'i_mar', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "iMar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'i_mie', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "iMie", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'i_jue', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "iJue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'i_vie', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "iVie", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cciu', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isup', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "isup", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccan', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "ccan", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccal', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "ccal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'csec', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cmov', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "movil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cban1', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "banco1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cnum1', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cuenta1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cban2', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "banco2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cnum2', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cuenta2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cban3', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "banco3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cnum3', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cuenta3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isuc', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "isuc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ise', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ise", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ista', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ista", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cpur', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cpur", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccas', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "ccas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ific', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ific", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cvia1', type: 'varchar', length: 100, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cvia1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cvia2', type: 'varchar', length: 100, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cvia2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cpro', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cpro", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ipve', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ipve", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npve', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "npve", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cpve', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cpve", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cven1', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cven1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'csup1', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "csup1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cent1', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cent1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cven2', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cven2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'csup2', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "csup2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cent2', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cent2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clave', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "clave", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncom1', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cliente.prototype, "ncom1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Cliente.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_synced_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Cliente.prototype, "lastSyncedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Empresa_1.Empresa),
    (0, typeorm_1.JoinColumn)({ name: 'id' }),
    __metadata("design:type", Empresa_1.Empresa)
], Cliente.prototype, "empresa", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Vendedor_1.Vendedor, (vendedor) => vendedor.clientes),
    (0, typeorm_1.JoinColumn)([
        { name: 'id', referencedColumnName: 'empresaId' },
        { name: 'cven', referencedColumnName: 'codigo' }
    ]),
    __metadata("design:type", Vendedor_1.Vendedor)
], Cliente.prototype, "vendedor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Cxcobrar_1.Cxcobrar, (cxc) => cxc.cliente, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Cliente.prototype, "cuentasPorCobrar", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Pedido_1.Pedido, (pedido) => pedido.cliente, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Cliente.prototype, "pedidos", void 0);
exports.Cliente = Cliente = __decorate([
    (0, typeorm_1.Entity)('clientes'),
    (0, typeorm_1.Index)(['empresaId', 'codigo'], { unique: true })
], Cliente);

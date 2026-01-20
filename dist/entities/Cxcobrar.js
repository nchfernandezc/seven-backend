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
exports.Cxcobrar = void 0;
const typeorm_1 = require("typeorm");
const Cliente_1 = require("./Cliente");
let Cxcobrar = class Cxcobrar {
    constructor() {
        // App required fields
        this.isDeleted = false;
    }
};
exports.Cxcobrar = Cxcobrar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'xxx' }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "empresaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdoc', type: 'varchar', length: 10, nullable: false }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "tipoDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccli', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "clienteCodigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inum', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nnet', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nnet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'niva', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "niva", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dfec', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], Cxcobrar.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nsal', type: 'decimal', precision: 12, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "saldo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idia', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "dias", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'ista',
        type: 'int',
        default: 0,
        transformer: {
            to: (value) => value === 'pagado' ? 1 : 0,
            from: (value) => value === 1 ? 'pagado' : 'pendiente'
        }
    }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ival', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "ival", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iprt', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "iprt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ifis', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "ifis", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccon', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "ccon", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cven', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cven", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iafe', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "iafe", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cafe', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cafe", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ifor', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "ifor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cinf', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cinf", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cnro', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cnro", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nret1', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nret1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nret2', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nret2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cnro1', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cnro1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cnro2', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cnro2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ipp', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "ipp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isube', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "isube", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nexe', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nexe", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nnetyx', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nnetyx", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nivax', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nivax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nsalx', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nsalx", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nexex', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nexex", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'itip', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "itip", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ipag', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "ipag", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imon', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "imon", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idoc', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "idoc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imar', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "imar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cfac', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cfac", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cnum', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cnum", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cche', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cche", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cfr1', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cfr1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cfr2', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cfr2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdet', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cdet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dven', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Cxcobrar.prototype, "fechaVencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dfac', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Cxcobrar.prototype, "fechaFactura", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nsal2', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nsal2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nbolivar', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nbolivar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ndolar', type: 'decimal', precision: 12, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "ndolar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'crel', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "crel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cusu', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cusu", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'csuc', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "csuc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Cxcobrar.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_synced_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Cxcobrar.prototype, "lastSyncedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cliente_1.Cliente, cliente => cliente.cuentasPorCobrar, {
        eager: true,
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)([
        { name: 'id', referencedColumnName: 'empresaId' },
        { name: 'ccli', referencedColumnName: 'codigo' }
    ]),
    __metadata("design:type", Cliente_1.Cliente)
], Cxcobrar.prototype, "cliente", void 0);
exports.Cxcobrar = Cxcobrar = __decorate([
    (0, typeorm_1.Entity)('cxcobrar')
], Cxcobrar);

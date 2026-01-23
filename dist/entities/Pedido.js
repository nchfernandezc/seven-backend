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
exports.Pedido = void 0;
const typeorm_1 = require("typeorm");
let Pedido = class Pedido {
};
exports.Pedido = Pedido;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'xxx' }),
    __metadata("design:type", Number)
], Pedido.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'num', type: 'varchar', length: 30, nullable: false }),
    (0, typeorm_1.Index)({ unique: false }),
    __metadata("design:type", String)
], Pedido.prototype, "num", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ven', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "ven", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fic', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "ficha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cod', type: 'varchar', length: 30, nullable: false }),
    __metadata("design:type", String)
], Pedido.prototype, "cod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'des', type: 'varchar', length: 100, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "des", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'obs', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pedido.prototype, "obs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ctra', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "transporte", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccho', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "chofer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cayu', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "ayudante", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cche', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "chequeador", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdep', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "departamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdes', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "destino", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rep', type: 'varchar', length: 10, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "rep", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ibul', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "bultos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ihor1', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "ihor1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cli', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Pedido.prototype, "cli", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cusu', type: 'varchar', length: 30, default: '' }),
    __metadata("design:type", String)
], Pedido.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can', type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pre', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Pedido.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ifac', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "ifac", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nmon', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "nmon", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ngra', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "ngra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ntax', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "ntax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pvp', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "pvp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pcli', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "pcli", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pvol', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "pvol", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bac', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "bac", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ndolar', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "ndolar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dfec', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], Pedido.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dgui', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Pedido.prototype, "fechaGuia", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iprt', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "iprt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'itip', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ifor', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "ifor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imar', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "imar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'igui', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "igui", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iprefac', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "iprefac", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imin1', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "imin1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iam1', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "iam1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ihor2', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "ihor2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imin2', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "imin2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iam2', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "iam2", void 0);
exports.Pedido = Pedido = __decorate([
    (0, typeorm_1.Entity)('pedidos')
], Pedido);

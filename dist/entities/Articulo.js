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
exports.Articulo = void 0;
const typeorm_1 = require("typeorm");
const Empresa_1 = require("./Empresa");
let Articulo = class Articulo {
    constructor() {
        // Campos de BaseModel que quizás necesitemos mantener para la app offline
        this.isDeleted = false;
    }
};
exports.Articulo = Articulo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'xxx' }),
    __metadata("design:type", Number)
], Articulo.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Articulo.prototype, "empresaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccod', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Articulo.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccodx', type: 'varchar', length: 50, nullable: false, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "codigoAlterno", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdet', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], Articulo.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cuni', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "unidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cmod', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "modelo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cusu', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cmaq', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "maquina", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npre1', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "precio1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npre2', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "precio2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npre3', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "precio3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npre4', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "precio4", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npre5', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "precio5", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npre6', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "precio6", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npor1', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "porcentaje1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npor2', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "porcentaje2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncos', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "costo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan1', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan2', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "cantidad2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan3', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "cantidad3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'itip', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cref', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "referencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iiva', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "impuesto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdep', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "departamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccla', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "clase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccol', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cmar', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Articulo.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan4', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "cantidad4", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npes', type: 'decimal', precision: 18, scale: 4, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "peso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ndolar', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "dolar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ivid', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ivid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'imix', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "imix", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cpre', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cpre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cubi', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cubi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cest', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cest", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cniv', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cniv", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cpos', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cpos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cfor1', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cfor1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cfor2', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cfor2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cfor3', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cfor3", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cfor4', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cfor4", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'iroj', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "iroj", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'icon', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nroj', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "nroj", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan5', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ncan5", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan7', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ncan7", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan8', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ncan8", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan9', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ncan9", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan10', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ncan10", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan11', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ncan11", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan12', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ncan12", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ivac', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ivac", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ipal', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ipal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ifis', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ifis", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ific', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ific", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ides', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ides", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan6', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ncan6", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ihas', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ihas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ista', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ista", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'isube', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "isube", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Articulo.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_synced_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Articulo.prototype, "lastSyncedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Articulo.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dfec', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Articulo.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Empresa_1.Empresa, (empresa) => empresa.articulos, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'id' }),
    __metadata("design:type", Empresa_1.Empresa)
], Articulo.prototype, "empresa", void 0);
exports.Articulo = Articulo = __decorate([
    (0, typeorm_1.Entity)('articulos'),
    (0, typeorm_1.Index)(['empresaId', 'codigo'], { unique: true })
], Articulo);

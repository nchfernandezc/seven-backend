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
const BaseModel_1 = require("./BaseModel");
const Empresa_1 = require("./Empresa");
let Articulo = class Articulo extends BaseModel_1.BaseModel {
};
exports.Articulo = Articulo;
__decorate([
    (0, typeorm_1.Column)({ name: 'ccod', type: 'varchar', length: 30, nullable: false }),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", String)
], Articulo.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdet', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Articulo.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan1', type: 'decimal', precision: 18, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npre1', type: 'decimal', precision: 18, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Articulo.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cmar', type: 'varchar', length: 40, nullable: true }),
    __metadata("design:type", String)
], Articulo.prototype, "marca", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccla', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Articulo.prototype, "clase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'empresa_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Articulo.prototype, "empresaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Empresa_1.Empresa, (empresa) => empresa.articulos, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'empresa_id' }),
    __metadata("design:type", Empresa_1.Empresa)
], Articulo.prototype, "empresa", void 0);
exports.Articulo = Articulo = __decorate([
    (0, typeorm_1.Entity)('articulos')
], Articulo);

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
exports.Vendedor = void 0;
const typeorm_1 = require("typeorm");
const BaseModel_1 = require("./BaseModel");
const Empresa_1 = require("./Empresa");
const Cliente_1 = require("./Cliente");
let Vendedor = class Vendedor extends BaseModel_1.BaseModel {
};
exports.Vendedor = Vendedor;
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Vendedor.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Vendedor.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Vendedor.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'empresa_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Vendedor.prototype, "empresaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Empresa_1.Empresa, (empresa) => empresa.vendedores, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'empresa_id' }),
    __metadata("design:type", Empresa_1.Empresa)
], Vendedor.prototype, "empresa", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Cliente_1.Cliente, (cliente) => cliente.vendedor),
    __metadata("design:type", Array)
], Vendedor.prototype, "clientes", void 0);
exports.Vendedor = Vendedor = __decorate([
    (0, typeorm_1.Entity)('vendedores'),
    (0, typeorm_1.Index)(['empresaId', 'codigo'], { unique: true })
], Vendedor);

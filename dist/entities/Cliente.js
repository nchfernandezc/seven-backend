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
const BaseModel_1 = require("./BaseModel");
const Cxcobrar_1 = require("./Cxcobrar");
const Pedido_1 = require("./Pedido");
const Vendedor_1 = require("./Vendedor");
let Cliente = class Cliente extends BaseModel_1.BaseModel {
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.Column)({ name: 'ccod', type: 'varchar', length: 20, nullable: false }),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", String)
], Cliente.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdet', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Cliente.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdir', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ctel', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cven', type: 'varchar', length: 10, nullable: false }),
    __metadata("design:type", String)
], Cliente.prototype, "vendedorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Vendedor_1.Vendedor, (vendedor) => vendedor.clientes),
    (0, typeorm_1.JoinColumn)({ name: 'cven', referencedColumnName: 'codigo' }),
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
    (0, typeorm_1.Entity)('clientes')
], Cliente);

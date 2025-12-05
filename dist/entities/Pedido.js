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
const BaseModel_1 = require("./BaseModel");
const Cliente_1 = require("./Cliente");
const Articulo_1 = require("./Articulo");
let Pedido = class Pedido extends BaseModel_1.BaseModel {
};
exports.Pedido = Pedido;
__decorate([
    (0, typeorm_1.Column)({ name: 'num', type: 'varchar', length: 20, nullable: false }),
    (0, typeorm_1.Index)({ unique: true }),
    __metadata("design:type", String)
], Pedido.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cod', type: 'varchar', length: 30, nullable: false }),
    __metadata("design:type", String)
], Pedido.prototype, "articuloCodigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can', type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Pedido.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pvp', type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Pedido.prototype, "precioVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccli', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Pedido.prototype, "clienteCodigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ista', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Pedido.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dfec', type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], Pedido.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cusu', type: 'varchar', length: 30, nullable: false }),
    __metadata("design:type", String)
], Pedido.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idx', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pedido.prototype, "indice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'empresa_id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Pedido.prototype, "empresaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cliente_1.Cliente, { createForeignKeyConstraints: false }),
    (0, typeorm_1.JoinColumn)([
        { name: 'empresa_id', referencedColumnName: 'empresaId' },
        { name: 'ccli', referencedColumnName: 'codigo' }
    ]),
    __metadata("design:type", Cliente_1.Cliente)
], Pedido.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Articulo_1.Articulo, { createForeignKeyConstraints: false }),
    (0, typeorm_1.JoinColumn)([
        { name: 'empresa_id', referencedColumnName: 'empresaId' },
        { name: 'cod', referencedColumnName: 'codigo' }
    ]),
    __metadata("design:type", Articulo_1.Articulo)
], Pedido.prototype, "articulo", void 0);
exports.Pedido = Pedido = __decorate([
    (0, typeorm_1.Entity)('pedidos')
], Pedido);

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
const BaseModel_1 = require("./BaseModel");
const Cliente_1 = require("./Cliente");
let Cxcobrar = class Cxcobrar extends BaseModel_1.BaseModel {
};
exports.Cxcobrar = Cxcobrar;
__decorate([
    (0, typeorm_1.Column)({ name: 'cdoc', type: 'varchar', length: 3, nullable: false }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "tipoDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inum', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nsal', type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "saldo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccli', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "clienteCodigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dfec', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], Cxcobrar.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cliente_1.Cliente, cliente => cliente.cuentasPorCobrar),
    (0, typeorm_1.JoinColumn)({ name: 'ccli', referencedColumnName: 'codigo' }),
    __metadata("design:type", Cliente_1.Cliente)
], Cxcobrar.prototype, "cliente", void 0);
exports.Cxcobrar = Cxcobrar = __decorate([
    (0, typeorm_1.Entity)('cxcobrar')
], Cxcobrar);

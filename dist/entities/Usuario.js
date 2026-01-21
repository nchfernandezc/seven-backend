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
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
let Usuario = class Usuario {
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'xxx' }),
    __metadata("design:type", Number)
], Usuario.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'detalle', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "detalle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vendedor', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "vendedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contraseña', type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "contra", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)('a_usuario'),
    (0, typeorm_1.Index)(['id', 'vendedor'], { unique: true }) // Based on the query logic
], Usuario);

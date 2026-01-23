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
let Articulo = class Articulo {
};
exports.Articulo = Articulo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'xxx' }),
    __metadata("design:type", Number)
], Articulo.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Articulo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccod', type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Articulo.prototype, "ccod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdet', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], Articulo.prototype, "cdet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cuni', type: 'varchar', length: 20, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cuni", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cref', type: 'varchar', length: 50, default: '' }),
    __metadata("design:type", String)
], Articulo.prototype, "cref", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npre1', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "npre1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'npre2', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "npre2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ncan1', type: 'decimal', precision: 18, scale: 3, default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ncan1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ides', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Articulo.prototype, "ides", void 0);
exports.Articulo = Articulo = __decorate([
    (0, typeorm_1.Entity)('articulos'),
    (0, typeorm_1.Index)(['id', 'ccod'], { unique: true })
], Articulo);

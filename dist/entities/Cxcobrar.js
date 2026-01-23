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
let Cxcobrar = class Cxcobrar {
};
exports.Cxcobrar = Cxcobrar;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'xxx' }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdoc', type: 'varchar', length: 10, nullable: false }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cdoc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inum', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "inum", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dfec', type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], Cxcobrar.prototype, "dfec", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nsal', type: 'decimal', precision: 12, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "nsal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccli', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "ccli", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ista', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Cxcobrar.prototype, "ista", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cven', type: 'varchar', length: 10, nullable: false }),
    __metadata("design:type", String)
], Cxcobrar.prototype, "cven", void 0);
exports.Cxcobrar = Cxcobrar = __decorate([
    (0, typeorm_1.Entity)('cxcobrar')
], Cxcobrar);

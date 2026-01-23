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
;
let Cliente = class Cliente {
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'xxx' }),
    __metadata("design:type", Number)
], Cliente.prototype, "internalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Cliente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ccod', type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Cliente.prototype, "ccod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdet', type: 'varchar', length: 200, nullable: false }),
    __metadata("design:type", String)
], Cliente.prototype, "cdet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cdir', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "cdir", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ctel', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Cliente.prototype, "ctel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cven', type: 'varchar', length: 10, nullable: false, default: '' }),
    __metadata("design:type", String)
], Cliente.prototype, "cven", void 0);
exports.Cliente = Cliente = __decorate([
    (0, typeorm_1.Entity)('clientes'),
    (0, typeorm_1.Index)(['id', 'ccod'], { unique: true })
], Cliente);

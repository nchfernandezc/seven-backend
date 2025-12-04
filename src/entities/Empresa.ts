import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Vendedor } from './Vendedor';
import { Articulo } from './Articulo';

@Entity('empresas')
export class Empresa extends BaseModel {
    @Column({ type: 'varchar', length: 100, nullable: false })
    nombre!: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    identificacion!: string; // ID Empresa (RIF, NIT, etc.)

    @Column({ type: 'varchar', length: 200, nullable: true })
    direccion?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    telefono?: string;

    @OneToMany(() => Vendedor, (vendedor) => vendedor.empresa)
    vendedores!: Vendedor[];

    @OneToMany(() => Articulo, (articulo) => articulo.empresa)
    articulos!: Articulo[];
}

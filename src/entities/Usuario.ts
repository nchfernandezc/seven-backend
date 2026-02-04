import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('a_usuario')
@Index(['id', 'vendedor'], { unique: true }) // Based on the query logic
export class Usuario {
    @PrimaryGeneratedColumn({ name: 'xxx' })
    internalId!: number;

    @Column({ name: 'id', type: 'int', nullable: false })
    id!: number; // id_apk (Company ID)

    @Column({ name: 'usuario', type: 'varchar', length: 100, nullable: false })
    usuario!: string;

    @Column({ name: 'detalle', type: 'varchar', length: 200, nullable: true })
    detalle!: string;

    @Column({ name: 'vendedor', type: 'varchar', length: 50, nullable: false })
    vendedor!: string; // vendedor_apk

    @Column({ name: 'clave', type: 'varchar', length: 100, nullable: false })
    clave!: string; // El campo en la BDD y en el código ahora es 'clave'
}
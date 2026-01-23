import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';;

@Entity('clientes')
@Index(['id', 'ccod'], { unique: true })
export class Cliente {
    @PrimaryGeneratedColumn({ name: 'xxx' })
    internalId!: number;

    @Column({ name: 'id', type: 'int', nullable: false })
    id!: number;

    @Column({ name: 'ccod', type: 'varchar', length: 20, nullable: false })
    ccod!: string;

    @Column({ name: 'cdet', type: 'varchar', length: 200, nullable: false })
    cdet!: string;

    @Column({ name: 'cdir', type: 'varchar', length: 200, nullable: true })
    cdir?: string;

    @Column({ name: 'ctel', type: 'varchar', length: 100, nullable: true })
    ctel?: string;

    @Column({ name: 'cven', type: 'varchar', length: 10, nullable: false, default: '' })
    cven!: string;
}
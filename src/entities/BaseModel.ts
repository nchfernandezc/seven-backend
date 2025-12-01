import { 
    BaseEntity as TypeOrmBaseEntity,  
    CreateDateColumn, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from 'typeorm';

export abstract class BaseModel extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

}
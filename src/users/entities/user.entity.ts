import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  targetType: string;

  @Column('uuid')
  targetId: string;
}

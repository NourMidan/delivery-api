import { Client } from '../../clients/entities/client.entity';
import { Item } from '../../item/entities/item.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Item, (item) => item.cart, {
    eager: true,
  })
  @JoinTable()
  items: Item[];

  @Column({ nullable: true })
  menuId: string;

  @OneToOne(() => Client, (client) => client.cart, {
    onDelete: 'CASCADE',
  })
  client: Client;
}

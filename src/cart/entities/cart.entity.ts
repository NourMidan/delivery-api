import { Client } from 'src/clients/entities/client.entity';
import { Item } from 'src/item/entities/item.entity';
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
    onDelete: 'CASCADE',
  })
  @JoinTable()
  items: Item[];

  @Column({ nullable: true })
  menuId: string;

  @OneToOne(() => Client, (client) => client.cart, { eager: false })
  client: Client;
}

import { Client } from 'src/clients/entities/client.entity';
import { Owner } from 'src/owners/entities/owner.entity';

export interface userData {
  email: string;
  password: string;
}

export type Userable = Client | Owner;

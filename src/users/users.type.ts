import { Client } from '../clients/entities/client.entity';
import { Owner } from '../owners/entities/owner.entity';

export interface userData {
  email: string;

  password: string;
}

export type Userable = Client | Owner;

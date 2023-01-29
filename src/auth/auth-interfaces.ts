import { User } from '../users/entities/user.entity';
import { Userable } from '../users/users.type';

export interface UserWithUserable extends User {
  userable: Userable;
}

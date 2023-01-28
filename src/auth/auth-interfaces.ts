import { User } from 'src/users/entities/user.entity';
import { Userable } from 'src/users/users.type';

export interface UserWithUserable extends User {
  userable: Userable;
}

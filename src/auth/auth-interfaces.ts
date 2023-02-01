import { User } from '../users/entities/user.entity';
import { Userable } from '../users/users.type';

export class UserWithUserable extends User {
  userable: Userable;
}

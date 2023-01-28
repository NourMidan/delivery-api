import { Repository } from 'typeorm';

export abstract class EntityRepository<T> extends Repository<T> {}

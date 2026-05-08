import { User } from '../models/user.model';

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
}

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
}

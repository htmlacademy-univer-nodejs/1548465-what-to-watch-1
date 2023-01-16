import CreateUserDto from '../dto/create-user.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {UserEntity} from '../user.entity.js';
import UpdateUserDto from '../dto/update-user.dto.js';
import LoginUserDto from '../dto/login-user.dto.js';
import {MovieEntity} from '../../movie/movie.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>

  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>

  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;

  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;

  findToWatch(userId: string): Promise<DocumentType<MovieEntity>[]>;

  addToWatch(userId: string, movieId: string): Promise<void | null>;

  deleteToWatch(movieId: string, userId: string): Promise<void | null>;
}

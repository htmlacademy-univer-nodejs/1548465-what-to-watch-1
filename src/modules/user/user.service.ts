import {UserServiceInterface} from './user-service.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import UpdateUserDto from './dto/update-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';
import {MovieEntity} from '../movie/movie.entity.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private userModel: types.ModelType<UserEntity>,
    @inject(Component.MovieModel) private movieModel: types.ModelType<MovieEntity>
  ) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);
    return existedUser ? existedUser : this.create(dto, salt);
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async findToWatch(userId: string): Promise<DocumentType<MovieEntity>[]> {
    const result = await this.userModel.findById(userId).select('toWatchMovies');
    return this.movieModel.find({_id: {$in: result?.toWatchMovies}});
  }

  public async addToWatch(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $addToSet: {toWatchMovies: movieId}
    });
  }

  public async deleteToWatch(movieId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {
      $pull: {toWatchMovies: movieId}
    });
  }
}

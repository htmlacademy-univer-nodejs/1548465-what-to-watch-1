import {MovieServiceInterface} from './movie-service.interface.js';
import {MovieEntity} from './movie.entity.js';
import {DocumentType, types} from '@typegoose/typegoose';
import CreateMovieDto from './dto/create-movie.dto.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {inject, injectable} from 'inversify';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {MAX_MOVIES_COUNT} from './movie.constants.js';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`New movie created: ${dto.title}`);
    return result;
  }

  public findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findById(movieId)
      .populate(['userId'])
      .exec();
  }

  public async find(limit?: number): Promise<DocumentType<MovieEntity>[]> {
    const movieListCount = limit ?? MAX_MOVIES_COUNT;
    return this.movieModel
      .find({}, {limit: movieListCount})
      .populate(['userId'])
      .exec();
  }

  public async deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndDelete(movieId)
      .exec();
  }

  public async updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async findByGenre(genre: string, limit?: number): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel
      .find({genre: genre}, {}, {limit})
      .populate(['userId'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.movieModel
      .exists({_id: documentId})) !== null;
  }

  public async incrementCommentsCount(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async updateMovieRating(movieId: string, newRating: number): Promise<DocumentType<MovieEntity> | null> {
    const movie = await this.findById(movieId);
    const oldRating = movie?.rating ?? 0;
    const ratingsCount = movie?.commentsCount ?? 0;
    const actualRating = (newRating + oldRating * ratingsCount) / (ratingsCount + 1);
    return this.updateById(movieId, {rating: actualRating});
  }
}

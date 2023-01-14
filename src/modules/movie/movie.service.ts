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

  public async find(): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: {movieId: '$_id'},
          pipeline: [
            {$match: {$expr: {$in: ['$$movieId', '$movies']}}},
            {$project: {_id: 1}}
          ],
          as: 'comments'
        },
      },
      {
        $addFields: {
          id: {$toString: '$_id'},
          commentsCount: {$size: '$comments'},
          rating: {$avg: '$comments.rating'}
        }
      },
      {$unset: 'comments'},
      {$limit: MAX_MOVIES_COUNT}
    ]);
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
    return this.movieModel
      .findByIdAndUpdate(movieId, {rating: newRating})
      .exec();
  }
}

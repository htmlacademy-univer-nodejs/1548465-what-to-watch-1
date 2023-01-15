import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {MovieServiceInterface} from './movie-service.interface.js';
import {fillDTO} from '../../utils/common.js';
import {MovieResponse} from './response/movie.response.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import HttpError from '../../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import * as core from 'express-serve-static-core';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {RequestQuery} from '../../types/request-query.js';


type ParamsGetMovie = {
  movieId: string;
}

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController...');

    this.addRoute({path: '/:limit?', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:movieId', method: HttpMethod.Get, handler: this.show});
    this.addRoute({path: '/:movieId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/:movieId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:limit&:genre', method: HttpMethod.Patch, handler: this.update});
  }

  public async index({query}: Request<core.ParamsDictionary | ParamsGetMovie, unknown, unknown, RequestQuery>, res: Response) {
    const movies = await this.movieService.find(query.limit);
    this.ok(res, fillDTO(MovieResponse, movies));
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>,
    res: Response): Promise<void> {

    const result = await this.movieService.create(body);
    const movie = await this.movieService.findById(result.id);
    this.created(res, fillDTO(MovieResponse, movie));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response
  ): Promise<void> {
    const {movieId} = params;
    const movie = await this.movieService.findById(movieId);

    if (!movie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${movieId} not found.`,
        'MovieController'
      );
    }

    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response
  ): Promise<void> {
    const {movieId} = params;
    const movie = await this.movieService.deleteById(movieId);

    if (!movie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${movieId} not found.`,
        'MovieController'
      );
    }

    this.noContent(res, movie);
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, UpdateMovieDto>,
    res: Response
  ): Promise<void> {
    const updateMovie = await this.movieService.updateById(params.movieId, body);

    if (!updateMovie) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${params.movieId} not found.`,
        'MovieController'
      );
    }

    this.ok(res, fillDTO(MovieResponse, updateMovie));
  }
}

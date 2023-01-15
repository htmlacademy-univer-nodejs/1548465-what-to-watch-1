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

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:movieId', method: HttpMethod.Get, handler: this.show});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const movies = await this.movieService.find();
    const movieResponse = fillDTO(MovieResponse, movies);
    this.ok(res, movieResponse);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>,
    res: Response): Promise<void> {

    const movie = await this.movieService.create(body);
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
}

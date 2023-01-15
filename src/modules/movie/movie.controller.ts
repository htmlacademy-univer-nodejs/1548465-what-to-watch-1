import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {MovieServiceInterface} from './movie-service.interface.js';

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
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const categories = await this.movieService.find();
    this.ok(res, categories);
  }

  public create(_req: Request, _res: Response): void {
    // Код обработчика
  }
}

import {Controller} from '../../common/controller/controller.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import {UserServiceInterface} from './user-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {createJWT, fillDTO} from '../../utils/common.js';
import UserResponse from './response/user.response.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import LoginUserDto from './dto/login-user.dto.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../common/middlewares/validate-objectid.middleware.js';
import {UploadFileMiddleware} from '../../common/middlewares/upload-file.middleware.js';
import LoggedUserResponse from './response/logged-user.response.js';
import {JWT_ALGORITM} from './user.constant.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import {MovieResponse} from '../movie/response/movie.response.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController...');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });

    this.addRoute({
      path: '/to_watch',
      method: HttpMethod.Get,
      handler: this.getToWatch,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/to_watch',
      method: HttpMethod.Post,
      handler: this.addToWatch,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/to_watch',
      method: HttpMethod.Delete,
      handler: this.deleteToWatch,
      middlewares: [new PrivateRouteMiddleware()]
    });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);
    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(UserResponse, result)
    );
  }

  public async checkAuthenticate(req: Request, res: Response) {
    const user = await this.userService.findByEmail(req.user.email);
    this.ok(res, fillDTO(LoggedUserResponse, user));
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITM,
      this.configService.get('JWT_SECRET'),
      {email: user.email, id: user.id}
    );

    this.ok(res, fillDTO(LoggedUserResponse, {token}));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  public async getToWatch(req: Request<Record<string, unknown>, Record<string, unknown>>, _res: Response): Promise<void> {
    const {user} = req;
    const result = await this.userService.findToWatch(user.id);
    this.ok(_res, fillDTO(MovieResponse, result));
  }

  public async addToWatch({body}: Request<Record<string, unknown>,
    Record<string, unknown>, {userId: string, movieId: string}>, _res: Response): Promise<void> {
    await this.userService.addToWatch(body.movieId, body.userId);
    this.noContent(_res, {message: 'Фильм добавлен в список "К просмотру".'});
  }

  public async deleteToWatch(req: Request<Record<string, unknown>, Record<string, unknown>, { movieId: string }>, _res: Response): Promise<void> {
    const {body, user} = req;
    await this.userService.deleteToWatch(body.movieId, user.id);
    this.noContent(_res, {message: 'Успешно. Фильм удален из списка "К просмотру".'});
  }
}

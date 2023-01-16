import {NextFunction, Request, Response} from 'express';
import * as jose from 'jose';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import HttpError from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
// eslint-disable-next-line node/prefer-global/text-encoder
import {TextEncoder} from 'util';

export class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const {payload} = await jose.jwtVerify(token, new TextEncoder().encode(this.jwtSecret));
      req.user = { email: String(payload.email), id: String(payload.id) };

      return next();
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}

import crypto from 'crypto';
import {Movie} from '../types/entities/movie.type.js';
import {Genre} from '../types/enums/genre-type.enum.js';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import * as jose from 'jose';
// eslint-disable-next-line node/prefer-global/text-encoder
import {TextEncoder} from 'util';
import {ValidationErrorField} from '../types/validation-error-field.type.js';
import {ValidationError} from 'class-validator';
import {ServiceError} from '../types/enums/service-error.enum.js';
import {DEFAULT_STATIC_IMAGES} from '../app/application.constant.js';
import {UnknownObject} from '../types/unknown-object.type.js';

export const createMovie = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, publicationDate, genre, releaseYear, rating, preview, video, actors, director, durationInMinutes, commentsCount, name, email, avatarPath, password, poster, backgroundImage, backgroundColor] = tokens;
  const movie: Movie = {
    title,
    description,
    publicationDate: new Date(publicationDate),
    genre: <Genre>genre,
    releaseYear: Number(releaseYear),
    rating: Number(rating),
    preview,
    video,
    actors: String(actors).split(';'),
    director,
    durationInMinutes: Number(durationInMinutes),
    commentsCount: Number(commentsCount),
    user: {name, email, avatarPath, password},
    poster,
    backgroundImage,
    backgroundColor
  };
  return movie;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';


export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});


export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algorithm: string, jwtSecret: string, payload: object): Promise<string> => {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(jwtSecret);
  return new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(secretKey);
};

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};

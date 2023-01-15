import crypto from 'crypto';
import {Movie} from '../types/movie.type.js';
import {Genre} from '../types/genre-type.enum.js';
import {ClassConstructor, plainToInstance} from 'class-transformer';

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


export const createErrorObject = (message: string) => ({
  error: message,
});

import {Genre} from './genre-type.enum.js';
import {User} from './user.type.js';

export type Movie = {
  title: string,
  description: string,
  publicationDate: string,
  genre: Genre,
  releaseYear: number,
  rating: number,
  preview: string,
  video: string,
  actors: string[],
  director: string,
  durationInMinutes: number,
  commentsCount: number,
  user: User,
  poster: string,
  backgroundImage: string,
  backgroundColor: string,
}

import {Genre} from '../../../types/genre-type.enum.js';
import {User} from '../../../types/user.type.js';

export default class CreateMovieDto {
  title!: string;
  description!: string;
  publicationDate!: Date;
  genre!: Genre;
  releaseYear!: number;
  rating!: number;
  preview!: string;
  video!: string;
  actors!: string[];
  director!: string;
  durationInMinutes!: number;
  commentsCount!: number;
  user!: User;
  poster!: string;
  backgroundImage!: string;
  backgroundColor!: string;
}

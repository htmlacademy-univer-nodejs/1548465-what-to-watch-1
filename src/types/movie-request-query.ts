import {Genre} from './enums/genre-type.enum.js';

export type MovieRequestQuery = {
  limit?: number;
  genre?: Genre;
}

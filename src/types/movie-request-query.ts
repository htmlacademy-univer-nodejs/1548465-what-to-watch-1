import {Genre} from './genre-type.enum.js';

export type MovieRequestQuery = {
  limit?: number;
  genre?: Genre;
}

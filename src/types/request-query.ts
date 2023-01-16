import {Genre} from './genre-type.enum.js';

export type RequestQuery = {
  limit?: number;
  genre?: Genre;
}

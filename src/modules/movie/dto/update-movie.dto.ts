import {Genre} from '../../../types/genre-type.enum.js';

export default class UpdateMovieDto {
  title?: string;
  description?: string;
  publicationDate?: Date;
  genre?: Genre;
  releaseYear?: number;
  rating?: number;
  preview?: string;
  video?: string;
  actors?: string[];
  director?: string;
  durationInMinutes?: number;
  commentsCount?: number;
  userId?: string;
  poster?: string;
  backgroundImage?: string;
  backgroundColor?: string;
}

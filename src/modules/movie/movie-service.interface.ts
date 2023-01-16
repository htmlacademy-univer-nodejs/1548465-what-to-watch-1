import {DocumentType} from '@typegoose/typegoose';
import CreateMovieDto from './dto/create-movie.dto.js';
import {MovieEntity} from './movie.entity.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';


export interface MovieServiceInterface extends DocumentExistsInterface {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  find(limit?: number): Promise<DocumentType<MovieEntity>[]>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  findByGenre(genre: string, limit?: number): Promise<DocumentType<MovieEntity>[]>;
  incrementCommentsCount(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  updateMovieRating(movieId: string, newRating: number): Promise<DocumentType<MovieEntity> | null>;
  findPromo(): Promise<DocumentType<MovieEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}

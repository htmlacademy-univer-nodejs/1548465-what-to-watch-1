import {Expose, Type} from 'class-transformer';
import {Genre} from '../../../types/genre-type.enum.js';
import UserResponse from '../../user/response/user.response.js';

export class MovieResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  public genre!: Genre;

  @Expose()
  public releaseYear!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public preview!: string;

  @Expose()
  public video!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public durationInMinutes!: number;

  @Expose()
  public commentsCount!: number;

  @Expose({name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public poster!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;
}

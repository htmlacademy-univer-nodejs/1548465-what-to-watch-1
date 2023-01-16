import {Genre} from '../../../../src/types/enums/genre-type.enum.js';

export default class MovieDto {
  public title!: string;

  public description!: string;

  public publicationDate!: Date;

  public genre!: Genre;

  public releaseYear!: number;

  public rating!: number;

  public preview!: string;

  public video!: string;

  public actors!: string[];

  public director!: string;

  public durationInMinutes!: number;

  public commentsCount!: number;

  public userId!: string;

  public poster!: string;

  public backgroundImage!: string;

  public backgroundColor!: string;

  public isPromo?: boolean;
}

import {Genre} from '../../../types/genre-type.enum.js';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber, IsString,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export default class CreateMovieDto {
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsDateString({}, {message: 'publicationDate must be valid ISO date'})
  public publicationDate!: Date;

  @IsEnum(Genre, {message: 'type must be one of: comedy, crime, documentary, drama, horror, family, romance, scifi, thriller'})
  public genre!: Genre;

  @IsInt()
  public releaseYear!: number;

  @IsNumber()
  public rating!: number;

  @IsString()
  public preview!: string;

  @IsString()
  public video!: string;

  @IsArray({message: 'Field actors must be an array'})
  public actors!: string[];

  @IsString()
  @MinLength(2, {message: 'Minimum director name length must be 2'})
  @MaxLength(50, {message: 'Maximum director name length must be 50'})
  public director!: string;

  @IsInt()
  @Min(0, {message: 'durationInMinutes can\'t be equal 0'})
  public durationInMinutes!: number;

  @IsInt()
  public commentsCount!: number;

  public userId!: string;

  @IsString()
  public poster!: string;

  @IsString()
  public backgroundImage!: string;

  @IsString()
  public backgroundColor!: string;
}

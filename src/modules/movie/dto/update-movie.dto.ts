import {Genre} from '../../../types/enums/genre-type.enum.js';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber, IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export default class UpdateMovieDto {
  @IsOptional()
  @MinLength(2, {message: 'Minimum title length must be 2'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'publicationDate must be valid ISO date'})
  public publicationDate?: Date;

  @IsOptional()
  @IsEnum(Genre, {message: 'type must be one of: comedy, crime, documentary, drama, horror, family, romance, scifi, thriller'})
  public genre?: Genre;

  @IsOptional()
  @IsInt()
  public releaseYear?: number;

  @IsOptional()
  @IsNumber()
  public rating?: number;

  @IsOptional()
  @IsString()
  public preview?: string;

  @IsOptional()
  @IsString()
  public video?: string;

  @IsOptional()
  @IsArray({message: 'Field actors must be an array'})
  public actors?: string[];

  @IsOptional()
  @IsString()
  @MinLength(2, {message: 'Minimum director name length must be 2'})
  @MaxLength(50, {message: 'Maximum director name length must be 50'})
  public director?: string;

  @IsOptional()
  @IsInt()
  @Min(0, {message: 'durationInMinutes can\'t be equal 0'})
  public durationInMinutes?: number;

  @IsOptional()
  @IsInt()
  public commentsCount?: number;

  @IsOptional()
  @IsMongoId({message: 'userId field must be valid an id'})
  public userId?: string;

  @IsOptional()
  @IsString()
  public poster?: string;

  @IsOptional()
  @IsString()
  public backgroundImage?: string;

  @IsOptional()
  @IsString()
  public backgroundColor?: string;

  @IsOptional()
  public isPromo?: boolean;
}

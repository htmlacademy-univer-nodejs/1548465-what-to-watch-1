import typegoose, {defaultClasses, getModelForClass} from '@typegoose/typegoose';
import {Genre} from '../../types/genre-type.enum.js';
import {Movie} from '../../types/movie.type.js';
import {User} from '../../types/user.type.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})

export class MovieEntity extends defaultClasses.TimeStamps implements Movie {

  constructor(data: Movie) {
    super();

    this.title = data.title;
    this.description = data.description;
    this.publicationDate = data.publicationDate;
    this.genre = data.genre;
    this.releaseYear = data.releaseYear;
    this.rating = data.rating;
    this.preview = data.preview;
    this.video = data.video;
    this.actors = data.actors;
    this.director = data.director;
    this.durationInMinutes = data.durationInMinutes;
    this.commentsCount = data.commentsCount;
    this.user = data.user;
    this.poster = data.poster;
    this.backgroundImage = data.backgroundImage;
    this.backgroundColor = data.backgroundColor;
  }

  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true})
  public description!: string;

  @prop()
  public publicationDate!: Date;

  @prop({
    type: () => String,
    enum: Genre
  })
  public genre!: Genre;

  @prop()
  public releaseYear!: number;

  @prop()
  public rating!: number;

  @prop()
  public preview!: string;

  @prop()
  public video!: string;

  @prop()
  public actors!: string[];

  @prop()
  public director!: string;

  @prop()
  public durationInMinutes!: number;

  @prop()
  public commentsCount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public user!: User;

  @prop()
  public poster!: string;

  @prop()
  public backgroundImage!: string;

  @prop()
  public backgroundColor!: string;

}

export const MovieModel = getModelForClass(MovieEntity);

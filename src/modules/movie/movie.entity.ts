import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {Genre} from '../../types/genre-type.enum.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})

export class MovieEntity extends defaultClasses.TimeStamps {
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
  public userId!: Ref<UserEntity>;

  @prop()
  public poster!: string;

  @prop()
  public backgroundImage!: string;

  @prop()
  public backgroundColor!: string;

}

export const MovieModel = getModelForClass(MovieEntity);

import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import {Genre} from '../../types/enums/genre-type.enum.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})

export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true, required: true, default: ''})
  public description!: string;

  @prop({required: true, default: ''})
  public publicationDate!: Date;

  @prop({
    type: () => String,
    enum: Genre
  })
  public genre!: Genre;

  @prop({required: true, default: ''})
  public releaseYear!: number;

  @prop({required: true, default: ''})
  public rating!: number;

  @prop({required: true, default: ''})
  public preview!: string;

  @prop({required: true, default: ''})
  public video!: string;

  @prop({required: true, default: ''})
  public actors!: string[];

  @prop({required: true, default: ''})
  public director!: string;

  @prop({required: true, default: ''})
  public durationInMinutes!: number;

  @prop({required: true, default: ''})
  public commentsCount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({required: true, default: ''})
  public poster!: string;

  @prop({default: ''})
  public backgroundImage!: string;

  @prop({required: true, default: ''})
  public backgroundColor!: string;

  @prop({required: true, default: false})
  public isPromo?: boolean;

}

export const MovieModel = getModelForClass(MovieEntity);

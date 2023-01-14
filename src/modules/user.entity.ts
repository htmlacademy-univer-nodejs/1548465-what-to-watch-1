import {User} from '../types/user.type.js';
import typegoose, {defaultClasses, getModelForClass} from '@typegoose/typegoose';

const {prop} = typegoose;

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({unique: true, required: true})
  public avatarPath!: string;

  @prop()
  public email!: string;

  @prop()
  public name!: string;

  @prop()
  public password!: string;
}

export const UserModel = getModelForClass(UserEntity);

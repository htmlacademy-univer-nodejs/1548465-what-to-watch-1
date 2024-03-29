import {User} from '../../types/entities/user.type.js';
import typegoose, {defaultClasses, getModelForClass} from '@typegoose/typegoose';
import {createSHA256} from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {

  constructor(data: User) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatarPath = data.avatarPath;
  }

  @prop({required: true, default: ''})
  public name!: string;

  @prop({unique: true, required: true})
  public email!: string;

  @prop({required: true, default: ''})
  public avatarPath!: string;

  @prop({required: true, default: ''})
  public password!: string;

  @prop({required: true, default: []})
  public toWatchMovies!: string[];

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);

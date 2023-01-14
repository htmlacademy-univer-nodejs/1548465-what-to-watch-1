import {User} from '../types/user.type.js';
import mongoose from 'mongoose';

export interface UserDocument extends User, mongoose.Document {
  createdAt: Date,
  updatedAt: Date
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'],
  },
  avatarImage: {
    type: String,
    required: true,
    minlength: [5, 'Min length for avatar path is 5'],
  },
  firstname: {
    type: String,
    required: true,
    minlength: [2, 'Min length for firstname is 2']
  },
  lastName: String,
}, {
  timestamps: true
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);

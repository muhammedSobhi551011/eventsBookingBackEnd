import {Document} from "mongoose";

export interface IUser extends Document {
  _id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}
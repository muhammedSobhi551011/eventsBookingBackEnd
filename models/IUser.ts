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
  created_at?: string;
  updated_at?: string;
}
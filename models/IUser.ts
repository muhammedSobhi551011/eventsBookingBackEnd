import { Document } from "mongoose";
import { IEvent } from "./IEvent";

export interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  username: string;
  password?: string;
  avatar?: string;
  eventsBooked: IEvent[];
  isAdmin: boolean;
}
export interface IUserM extends Document, IUser {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}


import { Document } from "mongoose";

export interface IEvent {
  title: string;
  body: string;
  price?: number;
  type: string;
  image: string;
}
export interface IEventM extends Document, IEvent {
  _id?: string;
  created_at?: string;
  updated_at?: string;
}

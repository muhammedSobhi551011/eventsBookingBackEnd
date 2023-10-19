import { Document } from "mongoose";

export interface IEvents extends Document {
  _id?: string;
  title: string;
  body: string;
  price: number;
  type: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

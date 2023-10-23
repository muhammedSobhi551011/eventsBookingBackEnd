import { Schema, model } from "mongoose";
import { IEventM } from "./IEvent";

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: String,
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Event = model<IEventM>("Events", EventSchema);
export default Event;

import jwt, { JwtPayload } from "jsonwebtoken";
import { IEvent, IEventM } from "../models/IEvent";
import express from "express";
import { body, validationResult } from "express-validator";
import Event from "../models/event";
import { createEventMiddle } from "../middlewares/createEventM";
import { IUser } from "../models/IUser";
import User from "../models/user";

const eventsRouter: express.Router = express.Router();

eventsRouter
  .post(
    "/",
    createEventMiddle,
    [
      body("title").not().isEmpty().withMessage("title is required."),
      body("body").not().isEmpty().withMessage("body is required."),
      body("price").not().isEmpty().withMessage("price is required."),
      body("type").not().isEmpty().withMessage("type is required."),
      body("type").custom(async (value) => {
        if (value === "free" || value === "pro") {
          return value;
        } else {
          throw new Error("type should be free or pro.");
        }
      }),
      body("image").not().isEmpty().withMessage("image is required."),
    ],
    async (req: express.Request, res: express.Response) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.status(500).json(result);
      } else {
        try {
          //create an event
          const { title, body, price, type, image } = req.body;
          const event: IEvent = await Event.create({
            title: title,
            body: body,
            price: price,
            type: type,
            image: image,
          });
          res.status(201).json({ message: "Event created.", event: event });
        } catch (error) {
          console.log(error);
          res.status(500).json(error);
        }
      }
    }
  )
  .get("/", async (req: express.Request, res: express.Response) => {
    try {
      const { eventId } = req.query;
      if (eventId) {
        const event = await Event.findById(eventId);
        if (event != null) {
          res.status(200).json(event);
        } else {
          throw new Error("Couldn't find an event with this id.");
        }
      } else {
        const events = await Event.find();
        res.status(200).json(events);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  })
  .get("/free", async (req: express.Request, res: express.Response) => {
    const freeEvents = await Event.find().where({ type: "free" });
    res.status(200).json(freeEvents);
  })
  .get("/pro", async (req: express.Request, res: express.Response) => {
    const proEvents = await Event.find().where({ type: "pro" });
    res.status(200).json(proEvents);
  })
  .put(
    "/",
    [body("title").not().isEmpty().withMessage("At least title is required.")],
    async (req: express.Request, res: express.Response) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.status(400).json(result);
      } else {
        // Update event

        const { eventId } = req.query;
        try {
          const { title, body, price, type, image }: IEvent = req.body;

          if (eventId) {
            const event: IEvent | null = await Event.findById(eventId);
            if (event != null) {
              const newEvent: IEvent = {
                title: title || event.title,
                body: body || event.body,
                price: price || event.price,
                type: type || event.type,
                image: image || event.image,
              };
              await Event.updateOne(event, newEvent);
              const updatedEvent: IEvent | null = await Event.findById(eventId);
              res
                .status(201)
                .json({ message: "Successful update.", event: updatedEvent });
            } else {
              res.status(401).json({ message: "event not found." });
            }
          } else {
            res.status(500).json({
              errors: {
                message: "Send eventId in query.",
              },
            });
          }
        } catch (error) {
          console.log(error);
          res.status(500).json(error);
        }
      }
    }
  )
  .delete("/:eventId", async (req: express.Request, res: express.Response) => {
    // delete event

    try {
      const { eventId } = req.params;
      const event = await Event.findById(eventId).deleteOne();
      if (event) {
        res.status(200).json(event);
      } else {
        throw new Error("Couldn't find an event with this id.");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  })
  .post("/book", async (req: express.Request, res: express.Response) => {
    // book an event
    try {
      const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
      const { eventId } = req.query;
      const token: string | undefined = req
        .header("Authorization")
        ?.split(" ")[1];
      if (eventId && token && secretKey) {
        const event: IEvent | null = await Event.findById(eventId);
        const authoredUser: string | JwtPayload = jwt.verify(token, secretKey);
        if (event && typeof authoredUser === "object") {
          const user = await User.findById(authoredUser.id)
          if (user){
            let eventExist: boolean = false
            for (const ev of user.eventsBooked){
              if (ev._id?.toString()===event._id?.toString()){
                eventExist = true;
              }
            }
            if (eventExist){
              res.status(400).json({message: "Event aleardy booked."})
            }else{
              user.eventsBooked.push(event);
              const updated = await User.updateOne(
                { _id: user.id },
                { $set: { eventsBooked: user.eventsBooked } }
              );
              if (updated.modifiedCount > 0) {
                res.status(201).json({ message: "Event booked." });
              } else {
                throw new Error("Book failed.");
              }
            }
          }else {
            throw new Error("User not found.");
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).json(error.message);
    }
  });

export default eventsRouter;

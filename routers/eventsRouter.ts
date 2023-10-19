import express from "express";
import { body, validationResult } from "express-validator";
import Event from "../models/event";

const eventsRouter: express.Router = express.Router();

eventsRouter
  .post(
    "/",
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
          const event = await Event.create({
            title: title,
            body: body,
            price: price,
            type: type,
            image: image,
          });
          res.status(201).json(event);
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
        if (event) {
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
  .put("/:eventId", (req: express.Request, res: express.Response) => {
    const { eventId } = req.params;
    // TODO edit event info logic
    res.status(201).json({
      message: "Hi from edit event: " + eventId + ". info",
    });
  })
  .delete("/:eventId", async (req: express.Request, res: express.Response) => {
    try {
      const { eventId } = req.query;
      if (eventId) {
        const event = await Event.findById(eventId).deleteOne();
        if (event) {
          res.status(200).json(event);
        } else {
          throw new Error("Couldn't find an event with this id.");
        }
      } else {
        res.status(404).json({ message: "404 not found." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

export default eventsRouter;

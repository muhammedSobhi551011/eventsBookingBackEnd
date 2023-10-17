import express from "express";

const eventsRouter: express.Router = express.Router();

eventsRouter.post("/",(req:express.Request, res: express.Response)=>{
    const {title, body, price, type, image, created_at} = req.body;
    // TODO make event logic
    res.status(201).json({
        message: "Hi from make an event"
    })
}).get("/free",(req:express.Request, res: express.Response)=>{
    // TODO get free events logic
    res.status(200).json({
        message: "Hi from get free events"
    })
}).get("/pro",(req:express.Request, res: express.Response)=>{

    // TODO get pro events logic
    res.status(200).json({
        message: "Hi from get pro events"
    })
}).get("/:eventId",(req:express.Request, res: express.Response)=>{
    const {eventId} = req.params;
    // TODO get event info logic
    res.status(201).json({
        message: "Hi from get event: "+eventId+". info"
    })
}).put("/:eventId",(req:express.Request, res: express.Response)=>{
    const {eventId} = req.params;
    // TODO edit event info logic
    res.status(201).json({
        message: "Hi from edit event: "+eventId+". info"
    })
}).delete("/:eventId",(req:express.Request, res: express.Response)=>{
    const {eventId} = req.params;
    // TODO delete event info logic
    res.status(201).json({
        message: "Hi from delete event: "+eventId+". info"
    })
})

export default eventsRouter;
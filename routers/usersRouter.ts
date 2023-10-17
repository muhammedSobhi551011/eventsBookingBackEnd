import express from "express";

const usersRouter: express.Router = express.Router();

usersRouter.post("/registe",(req:express.Request, res: express.Response)=>{
    const {firstName, lastName, email, password, username} = req.body;
    // TODO registe logic
    res.status(201).json({
        message: "Hi from registe"
    })
}).post("/login",(req:express.Request, res: express.Response)=>{
    const {username, password} = req.body;
    // TODO login logic
    res.status(200).json({
        message: "Hi from login"
    })
}).get("/",(req:express.Request, res: express.Response)=>{

    // TODO get all users logic
    res.status(200).json({
        message: "Hi from get all users"
    })
}).put("/:userId",(req:express.Request, res: express.Response)=>{
    const {userId} = req.params;
    // TODO edit user info logic
    res.status(201).json({
        message: "Hi from edit user: "+userId+". info"
    })
}).delete("/:userId",(req:express.Request, res: express.Response)=>{
    const {userId} = req.params;
    // TODO delete user info logic
    res.status(201).json({
        message: "Hi from delete user: "+userId+". info"
    })
})

export default usersRouter;
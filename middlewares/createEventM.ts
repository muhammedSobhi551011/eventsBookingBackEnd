import express  from 'express';


export const createEventMiddle = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.body.type==="free"){
        req.body.price =0;
    }
    next()
}
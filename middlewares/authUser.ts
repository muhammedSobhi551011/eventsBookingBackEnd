import express from "express";
import User from "../models/user";
import bcryptjs from "bcryptjs"

export const authUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
    try {
        const { username, password } = req.body;
        const user: any = await User.findOne().where({ username: username });
        if (user) {
          if (!await bcryptjs.compare(password, user.password)) {
            res.status(401).json({ message: "Credentals are incorrect." });
          } else {
            req.body.user = user;
            next()
          }
        }else{
            throw new Error("User not found.")
        }
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
};

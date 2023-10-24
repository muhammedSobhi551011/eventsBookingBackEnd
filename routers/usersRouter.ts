import express from "express";
import bcryptjs from "bcryptjs";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { authUser } from "../middlewares/authUser";

const usersRouter: express.Router = express.Router();
let rejectedTokens: Array<string> = new Array();

usersRouter
  .post(
    "/registe",
    [
      body("firstName").not().isEmpty().withMessage("firstName is required."),
      body("username").not().isEmpty().withMessage("username is required."),
      body("email").not().isEmpty().withMessage("email is required."),
      body("email").isEmail().withMessage("email must be correct."),
      body("password").notEmpty().withMessage("password is required."),
    ],
    async (req: express.Request, res: express.Response) => {
      // Registe
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.status(500).json(result);
      } else {
        try {
          const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
          const { firstName, lastName, email, password, username } = req.body;
          const hashedPassword: string = await bcryptjs.hash(password, 10);
          const initialUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: hashedPassword,
            isAdmin: false,
          });
          const naturalUser = {
            id: initialUser.id,
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            isAdmin: initialUser.isAdmin,
            eventsBooked: [],
          };
          if (secretKey && naturalUser) {
            const token = jwt.sign(JSON.stringify(naturalUser), secretKey, {
              expiresIn: "2d",
            });
            res.status(201).json({ token: token, user: naturalUser });
          } else {
            throw new Error("Error in developement.");
          }
        } catch (error: any) {
          console.log(error);
          if (error.code === 11000) {
            res.status(401).json({ message: "User aleardy exits." });
          } else {
            res.status(500).json(error);
          }
        }
      }
    }
  )
  .post(
    "/login",
    [
      body("username").not().isEmpty().withMessage("username is required."),
      body("password").notEmpty().withMessage("password is required."),
    ],
    authUser,
    async (req: express.Request, res: express.Response) => {
      // Login

      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.status(500).json(result);
      } else {
        try {
          const secretKey: string | undefined = process.env.JWT_SECRET_KEY;
          const user = req.body.user;
          if (secretKey && user) {
            const token = jwt.sign(JSON.stringify(user), secretKey, {
              expiresIn: "2d",
            });
            res.status(201).json({ token: token, user: user });
          }
        } catch (error) {
          console.log(error);
          res.status(500).json(error);
        }
      }
    }
  )
  .get("/logout", (req: express.Request, res: express.Response) => {
    // TODO: logout functionality
    res.status(200).json({ message: "Logged out successfully." });
  })
  .get("/", async (req: express.Request, res: express.Response) => {
    // Get a specific user info

    try {
      const { userId } = req.query;
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "No user found to get." });
        }
      } else {
        // Get all users (for admins only)

        const users = await User.find();
        res.status(200).json(users);
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).json(error.message);
    }
  })
  .delete("/", async (req: express.Request, res: express.Response) => {
    // Delete a specific user

    try {
      const { userId } = req.query;
      if (userId) {
        const { deleteCount } = await User.findById(userId).deleteOne();
        if (deleteCount > 0) {
          res.status(201).json({ deleteCount: deleteCount });
        } else {
          res.status(404).json({
            message: "No user found to delete.",
          });
        }
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).json(error.message);
    }
  });

export default usersRouter;

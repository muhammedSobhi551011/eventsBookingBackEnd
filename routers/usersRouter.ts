import express from "express";
import bcryptjs from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/user";

const usersRouter: express.Router = express.Router();

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
          const { firstName, lastName, email, password, username } = req.body;
          const hashedPassword: string = await bcryptjs.hash(password, 10);
          const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: hashedPassword,
          });
          res.status(201).json(user);
        } catch (error: any) {
          console.log(error);
          res.status(500).json(error.message);
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
    async (req: express.Request, res: express.Response) => {
      // Login

      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.status(500).json(result);
      } else {
        try {
          const { username, password } = req.body;
          const user: any = await User.findOne().where({ username: username });
          if (user) {
            if (await bcryptjs.compare(password, user.password)) {
              res.status(202).json({ token: user.id });
            } else {
              res.status(401).json({ message: "Credentals are incorrect." });
            }
          }
        } catch (error: any) {
          console.log(error);
          res.status(500).json(error.message);
        }
      }
    }
  )
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

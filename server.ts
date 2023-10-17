import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotEnv from "dotenv";
import usersRouter from "./routers/usersRouter";
import eventsRouter from "./routers/eventsRouter";

// start express application
const app: express.Application = express();

// configure app to receive form data
app.use(express.json());

// cors
app.use(cors());

// configure env file
dotEnv.config({ path: "./.env" });

// conntect to MONGO_DB
// const mongoLocal: string | undefined = process.env.MONGO_DB_LOCAL;
// if (mongoLocal) {
//   mongoose
//     .connect(mongoLocal)
//     .then(() => {
//       console.log("Connected to MongoDB successfully.....");
//     })
//     .catch((err) => {
//       console.log(err);
//       process.exit(1);
//     });
// }

//---------------------------------
// ROUTERS
// test home router with GET request
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send("Welcome to events booking express app.");
});

// usersRouter
app.use("/users", usersRouter);

// eventsRouter
app.use("/events", eventsRouter);
//---------------------------------

// define hostname and port
const hostname: string | undefined = process.env.HOST_NAME;
const port: string | undefined = process.env.PORT;

// listen to express application
if (hostname && port) {
  app.listen(Number(port), hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
} else {
  console.log("Check hostname and port!");
}

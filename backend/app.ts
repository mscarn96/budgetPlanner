import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";

import Controller from "./common/controller";
import errorMiddleware from "./middleware/error.middleware";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Array<Controller>, port: number) {
    this.app = express();
    this.port = port;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Array<Controller>) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private connectToDatabase() {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected");
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;

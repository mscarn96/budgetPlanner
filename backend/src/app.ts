import cookieParser from "cookie-parser";
import express from "express";
import { Server } from "http";
import mongoose from "mongoose";

import Controller from "./common/controller";
import errorMiddleware from "./middleware/error.middleware";

class App {
  public app: express.Application;
  public port: number;
  public dbconnection: typeof mongoose;

  constructor(controllers: Array<Controller>, port: number = 5000) {
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

  private async connectToDatabase() {
    try {
      this.dbconnection = await mongoose.connect(
        process.env.MONGO_URI as string,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log("Database connected");
    } catch (error) {
      console.error(error);
    }
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen(): Server {
    return this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  public async disconnectDatabase() {
    await this.dbconnection.connection.close(true);
  }
}

export default App;

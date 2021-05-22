import express from "express";
import jwt from "jsonwebtoken";

import Controller from "../common/controller";
import User from "../users/user.interface";
import userModel from "../users/user.model";

class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // todo
  }

  private registration() {
    //todo
  }

  private login() {
    //todo
  }

  private createToken(user: User) {
    const expiresIn = 60 * 60; //hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
      expiresIn,
    };
  }
}

export default AuthController;

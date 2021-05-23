import express, { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";

import Controller from "../common/controller";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistExceptions";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "../users/user.dto";
import User from "../users/user.interface";
import userModel from "../users/user.model";
import LogInDto from "./login.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import { DataStoredInToken, TokenData } from "../interfaces/token.interfaces";
import HttpException from "../exceptions/HttpException";

class AuthController implements Controller {
  public path = "/auth";
  public router = express.Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.login
    );
    this.router.post(`${this.path}/logout`, this.logOut);
  }

  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userData: CreateUserDto = req.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      try {
        const user = await this.user.create({
          ...userData,
          password: hashedPassword,
        });
        user.password = "";
        const tokenData = this.createToken(user);
        if (tokenData) {
          res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        }
        res.send(user);
      } catch (error) {
        next(new HttpException(400, "Something went wrong"));
      }
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction) => {
    const loginData: LogInDto = req.body;
    const user = await this.user.findOne({ email: loginData.email });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(
        loginData.password,
        user.password
      );
      if (isPasswordCorrect) {
        user.password = "";
        const tokenData = this.createToken(user);
        if (tokenData) {
          res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
        }

        res.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  };

  private createToken(user: User) {
    const secret = process.env.JWT_SECRET as Secret;
    const expiresIn = 60 * 60; //hour
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      token: jwt.sign(dataStoredInToken, secret, {
        expiresIn,
      }),
      expiresIn,
    };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private logOut = (request: express.Request, response: express.Response) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };
}

export default AuthController;

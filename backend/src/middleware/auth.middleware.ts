import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import RequestWithUser from "../interfaces/requestWithUser.interface";
import userModel from "../users/user.model";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verifyResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verifyResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        //todo tbc
        next();
      } else {
        next();
      }
    } catch (error) {}
  }
}

export default authMiddleware;

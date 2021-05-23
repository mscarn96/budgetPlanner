import { NextFunction, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import WrongAuthTokenException from "../exceptions/WrongAuthTokenException";

import RequestWithUser from "../interfaces/requestWithUser.interface";
import userModel from "../users/user.model";

interface DataStoredInToken {
  _id: string;
}

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET as Secret;
    try {
      const verifyResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verifyResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthTokenException());
      }
    } catch (error) {
      next(new WrongAuthTokenException());
    }
  } else next(new NotAuthorizedException());
}

export default authMiddleware;

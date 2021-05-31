import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import express from "express";
import HttpException from "../exceptions/HttpException";

function validationMiddleware(
  type: any,
  skipMissingProperties = false
): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), {
      skipMissingProperties,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) =>
            error.constraints ? Object.values(error.constraints) : ""
          )
          .join(", ");
        next(new HttpException(400, message));
      } else next();
    });
  };
}

export default validationMiddleware;

import express from "express";
import { Document } from "mongoose";

import Controller from "../common/controller";
import ExpenditureNotFoundException from "../exceptions/ExpenditureNotFoundException";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateExpenditureDto from "./expenditure.dto";
import Expenditure from "./expenditure.interface";
import expenditureModel from "./expenditure.model";

class ExpenditureController implements Controller {
  public path = "/expenditures";
  public router = express.Router();
  private expenditure = expenditureModel;

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes() {
    this.router.get(this.path, this.getAllExpenditures);
    this.router.get(`${this.path}/:id`, this.getExpenditureById);

    this.router
      .all(`${this.path}/*`, authMiddleware)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreateExpenditureDto),
        this.createExpenditure
      )
      .delete(`${this.path}/:id`, authMiddleware, this.deleteExpenditure)
      .put(`${this.path}/:id`, authMiddleware, this.modifyExpenditure);
  }

  private getAllExpenditures = (
    req: RequestWithUser,
    res: express.Response
  ) => {
    this.expenditure
      .find({ User: req.user?._id })
      .then((expenditures) => res.send(expenditures));
  };

  private getExpenditureById = (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    this.expenditure.findById(req.params.id).then((expenditure) => {
      if (expenditure) {
        if (this.checkExpenditureOwner(req, expenditure)) {
          res.send(expenditure);
        } else {
          next(new NotAuthorizedException());
        }
      } else {
        next(new ExpenditureNotFoundException(req.params.id));
      }
    });
  };

  private modifyExpenditure = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const expenditureData: Expenditure = req.body;
    this.expenditure
      .findByIdAndUpdate(req.params.id, expenditureData, { new: true })
      .then((expenditure) => {
        if (expenditure) {
          if (this.checkExpenditureOwner(req, expenditure)) {
            res.send(expenditure);
          } else {
            next(new NotAuthorizedException());
          }
        } else {
          next(new ExpenditureNotFoundException(req.params.id));
        }
      });
  };

  private createExpenditure = (req: RequestWithUser, res: express.Response) => {
    const expenditureData: Expenditure = req.body;
    const createdExpenditure = new this.expenditure(expenditureData);
    if (req.user) {
      createdExpenditure.User = req.user?._id;
    }
    createdExpenditure.save().then((savedExpenditure) => {
      res.send(savedExpenditure);
    });
  };

  private deleteExpenditure = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const expenditureToDelete = await this.expenditure.findById(req.params.id);
    if (this.checkExpenditureOwner(req, expenditureToDelete)) {
      this.expenditure
        .findByIdAndDelete(req.params.id)
        .then((successResponse) => {
          if (successResponse) {
            res.sendStatus(200);
          } else {
            next(new ExpenditureNotFoundException(req.params.id));
          }
        });
    } else {
      next(new NotAuthorizedException());
    }
  };

  private checkExpenditureOwner = (
    req: RequestWithUser,
    expenditure: (Expenditure & Document<any, any>) | null
  ) => {
    const userId = req.user?._id as unknown as object;
    const expenditureOwnersId = expenditure?.User as unknown as object;
    return JSON.stringify(userId) === JSON.stringify(expenditureOwnersId);
  };
}

export default ExpenditureController;

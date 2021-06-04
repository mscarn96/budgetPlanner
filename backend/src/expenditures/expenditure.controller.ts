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
    this.router.get(this.path, authMiddleware, this.getAllExpenditures);
    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      this.getExpenditureById
    );

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

  private getExpenditureById = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const currentExpenditure = await this.expenditure.findById(req.params.id);
      if (this.checkExpenditureOwner(req, currentExpenditure)) {
        res.send(currentExpenditure);
      } else {
        next(new NotAuthorizedException());
      }
    } catch (error) {
      next(new ExpenditureNotFoundException(req.params.id));
    }
  };

  private modifyExpenditure = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const expenditureData: Expenditure = req.body;

    try {
      const expenditureToUpdate = await this.expenditure.findById(
        req.params.id
      );
      if (this.checkExpenditureOwner(req, expenditureToUpdate)) {
        const updatedExpenditure = await this.expenditure.findByIdAndUpdate(
          req.params.id,
          expenditureData,
          { new: true }
        );
        res.send(updatedExpenditure);
      } else next(new NotAuthorizedException());
    } catch (error) {
      next(new ExpenditureNotFoundException(req.params.id));
    }
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
    try {
      const expenditureToDelete = await this.expenditure.findById(
        req.params.id
      );
      if (this.checkExpenditureOwner(req, expenditureToDelete)) {
        await this.expenditure.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
      } else next(new NotAuthorizedException());
    } catch (error) {
      next(new ExpenditureNotFoundException(req.params.id));
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

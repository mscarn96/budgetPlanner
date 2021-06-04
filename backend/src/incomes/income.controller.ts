import express from "express";
import { Document } from "mongoose";

import Controller from "../common/controller";
import IncomeNotFoundException from "../exceptions/IncomeNotFoundException";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateIncomeDto from "./income.dto";
import Income from "./income.interface";
import incomeModel from "./income.model";

class IncomeController implements Controller {
  public path = "/incomes";
  public router = express.Router();
  private income = incomeModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAllIncomes);
    this.router.get(`${this.path}/:id`, authMiddleware, this.getIncomeById);

    this.router
      .all(`${this.path}/:*`, authMiddleware)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreateIncomeDto),
        this.createIncome
      )
      .delete(`${this.path}/:id`, authMiddleware, this.deleteIncome)
      .put(`${this.path}/:id`, authMiddleware, this.modifyIncome);
  }

  private getAllIncomes = (req: RequestWithUser, res: express.Response) => {
    this.income
      .find({ User: req.user?._id })
      .then((incomes) => res.send(incomes));
  };

  private getIncomeById = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const currentIncome = await this.income.findById(req.params.id);
      if (this.checkIncomeOwner(req, currentIncome)) {
        res.send(currentIncome);
      } else {
        next(new NotAuthorizedException());
      }
    } catch (error) {
      next(new IncomeNotFoundException(req.params.id));
    }
  };

  private modifyIncome = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const incomeData: Income = req.body;

    try {
      const incomeToUpdate = await this.income.findById(req.params.id);
      if (this.checkIncomeOwner(req, incomeToUpdate)) {
        const updatedInome = await this.income.findByIdAndUpdate(
          req.params.id,
          incomeData,
          { new: true }
        );
        res.send(updatedInome);
      } else next(new NotAuthorizedException());
    } catch (error) {
      next(new IncomeNotFoundException(req.params.id));
    }
  };

  private createIncome = (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const incomeData: Income = req.body;
    const createdIncome = new this.income(incomeData);
    if (req.user) {
      createdIncome.User = req.user?._id;
      createdIncome.save().then((savedIncome) => {
        res.send(savedIncome);
      });
    } else next(new NotAuthorizedException());
  };

  private deleteIncome = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const incomeToDelete = await this.income.findById(req.params.id);
      if (this.checkIncomeOwner(req, incomeToDelete)) {
        await this.income.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
      } else next(new NotAuthorizedException());
    } catch (error) {
      next(new IncomeNotFoundException(req.params.id));
    }
  };

  private checkIncomeOwner = (
    req: RequestWithUser,
    income: (Income & Document<any, any>) | null
  ) => {
    const userId = req.user?._id as unknown as object;
    const incomeOwnersId = income?.User as unknown as object;
    return JSON.stringify(userId) === JSON.stringify(incomeOwnersId);
  };
}

export default IncomeController;

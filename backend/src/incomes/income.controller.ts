import express from "express";

import Controller from "../common/controller";
import IncomeNotFoundException from "../exceptions/IncomeNotFoundException";
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
    this.router.get(this.path, this.getAllIncomes);
    this.router.get(`${this.path}/:id`, this.getIncomeById);

    this.router
      .all(`${this.path}/:*`, authMiddleware)
      .post(this.path, validationMiddleware(CreateIncomeDto), this.createIncome)
      .delete(`${this.path}/:id`, this.deleteIncome)
      .put(`${this.path}/:id`, this.modifyIncome);
  }

  private getAllIncomes = (req: express.Request, res: express.Response) => {
    this.income.find().then((incomes) => res.send(incomes));
  };

  private getIncomeById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    this.income.findById(req.params.id).then((income) => {
      if (income) {
        res.send(income);
      } else {
        next(new IncomeNotFoundException(req.params.id));
      }
    });
  };

  private modifyIncome = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const incomeData: Income = req.body;
    this.income
      .findByIdAndUpdate(req.params.id, incomeData, { new: true })
      .then((income) => {
        if (income) {
          res.send(income);
        } else {
          next(new IncomeNotFoundException(req.params.id));
        }
      });
  };

  private createIncome = (req: express.Request, res: express.Response) => {
    const incomeData: Income = req.body;
    const createdIncome = new this.income(incomeData);
    createdIncome.save().then((savedIncome) => {
      res.send(savedIncome);
    });
  };

  private deleteIncome = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    this.income.findByIdAndDelete(req.params.id).then((successResponse) => {
      if (successResponse) {
        res.send(200);
      } else {
        next(new IncomeNotFoundException(req.params.id));
      }
    });
  };
}

export default IncomeController;

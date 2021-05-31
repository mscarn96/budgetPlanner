import express from "express";

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

  private getIncomeById = (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    this.income.findById(req.params.id).then((income) => {
      if (income) {
        if (income.User === req.user?._id) {
          res.send(income);
        } else {
          next(new NotAuthorizedException());
        }
      } else {
        next(new IncomeNotFoundException(req.params.id));
      }
    });
  };

  private modifyIncome = (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const incomeData: Income = req.body;
    this.income
      .findByIdAndUpdate(req.params.id, incomeData, { new: true })
      .then((income) => {
        if (income) {
          console.log(income.User);
          console.log(req.user?._id);
          if (income.User === req.user?._id) {
            res.send(income);
            // !! whyyyyy
          } else {
            next(new NotAuthorizedException());
          }
        } else {
          next(new IncomeNotFoundException(req.params.id));
        }
      });
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
    const incomeToDelete = await this.income.findById(req.params._id);
    if (incomeToDelete?.User === req.user?._id) {
      this.income.findByIdAndDelete(req.params.id).then((successResponse) => {
        if (successResponse) {
          res.send(200);
        } else {
          next(new IncomeNotFoundException(req.params.id));
        }
      });
    } else next(new NotAuthorizedException());
  };
}

export default IncomeController;

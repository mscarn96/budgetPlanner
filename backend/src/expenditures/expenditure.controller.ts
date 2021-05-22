import express from "express";
import Controller from "../common/controller";
import ExpenditureNotFoundException from "../exceptions/ExpenditureNotFoundException";
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
    this.router.post(
      this.path,
      validationMiddleware(CreateExpenditureDto),
      this.createExpenditure
    );
    this.router.delete(`${this.path}/:id`, this.deleteExpenditure);
    this.router.put(`${this.path}/:id`, this.modifyExpenditure);
    this.router.get(`${this.path}/:id`, this.getExpenditureById);
  }

  //todo test

  private getAllExpenditures = (
    req: express.Request,
    res: express.Response
  ) => {
    this.expenditure.find().then((expenditures) => res.send(expenditures));
  };

  private getExpenditureById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    this.expenditure.findById(req.params.id).then((expenditure) => {
      if (expenditure) {
        res.send(expenditure);
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
          res.send(expenditure);
        } else {
          next(new ExpenditureNotFoundException(req.params.id));
        }
      });
  };

  private createExpenditure = (req: express.Request, res: express.Response) => {
    const expenditureData: Expenditure = req.body;
    const createdExpenditure = new this.expenditure(expenditureData);
    createdExpenditure.save().then((savedExpenditure) => {
      res.send(savedExpenditure);
    });
  };

  private deleteExpenditure = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    this.expenditure
      .findByIdAndDelete(req.params.id)
      .then((successResponse) => {
        if (successResponse) {
          res.send(200);
        } else {
          next(new ExpenditureNotFoundException(req.params.id));
        }
      });
  };
}

export default ExpenditureController;

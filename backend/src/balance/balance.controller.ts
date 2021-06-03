import express from "express";

import Controller from "../common/controller";
import BalanceAlreadyExistsException from "../exceptions/BalanceAlreadyExistsException";
import BalanceNotFoundException from "../exceptions/BalanceNotFoundException";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import Balance from "./balance.interface";
import balanceModel from "./balance.model";

class BalanceController implements Controller {
  public path = "/balance";
  public router = express.Router();
  private balance = balanceModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .all(this.path, authMiddleware)
      .get(this.path, this.getUserBalance)
      .post(this.path, this.createBalance)
      .put(this.path, this.modifyBalance)
      .delete(this.path, this.deleteBalance);
  }

  private getUserBalance = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userBalance = await this.balance.findOne({ User: req.user?._id });
    if (userBalance) {
      res.status(200).send(userBalance);
    } else {
      next(new BalanceNotFoundException(req.user?._id));
    }
  };

  private createBalance = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.user?._id) {
      const isBalanceAlreadyCreated = await this.balance.findOne({
        user: req.user._id,
      });
      if (isBalanceAlreadyCreated) {
        next(new BalanceAlreadyExistsException(req.user._id));
      } else {
        const balanceData: Balance = {
          state: 0,
          User: req.user?._id,
        };
        const newBalance = await this.balance.create(balanceData);

        res.status(200).send(newBalance);
      }
    } else next(new NotAuthorizedException());
  };

  private modifyBalance = async (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const balanceData: Balance = req.body;

    const balanceToModify = await this.balance.findOne({
      User: req.user?._id,
    });

    if (balanceToModify) {
      this.balance
        .findByIdAndUpdate(balanceToModify._id, balanceData, { new: true })
        .then((balance) => {
          if (balance) {
            res.status(200).send(balance);
          } else next(new BalanceNotFoundException(req.user?._id));
        });
    } else next(new BalanceNotFoundException(req.user?._id));
  };

  private deleteBalance = (
    req: RequestWithUser,
    res: express.Response,
    next: express.NextFunction
  ) => {
    this.balance.findOneAndDelete({ User: req.user?._id }).then((balance) => {
      if (balance) {
        res.sendStatus(200);
      } else {
        next(new BalanceNotFoundException(req.user?._id));
      }
    });
  };
}

export default BalanceController;

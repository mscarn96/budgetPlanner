import "dotenv/config";

import App from "./app";
import AuthController from "./auth/auth.controller";
import ExpenditureController from "./expenditures/expenditure.controller";
import BalanceController from "./balance/balance.controller"
import IncomeController from "./incomes/income.controller"
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App(
  [new ExpenditureController(), new AuthController(), new BalanceController(), new IncomeController()],
  parseInt(process.env.PORT as string, 10)
);

const server = app.listen();

server.on("close", async () => await app.disconnectDatabase());

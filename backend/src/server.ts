import "dotenv/config";

import App from "./app";
import ExpenditureController from "./expenditures/expenditure.controller";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App(
  [new ExpenditureController()],
  parseInt(process.env.PORT, 10)
);

app.listen();

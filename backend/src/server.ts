import "dotenv/config";

import App from "./app";
import AuthController from "./auth/auth.controller";
import ExpenditureController from "./expenditures/expenditure.controller";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App(
  [new ExpenditureController(), new AuthController()],
  parseInt(process.env.PORT as string, 10)
);

app.listen();

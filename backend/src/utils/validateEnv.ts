import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    MONGO_URI: str(),
    PORT: port(),
    JWT_SECRET: str(),
  });
};

export default validateEnv;

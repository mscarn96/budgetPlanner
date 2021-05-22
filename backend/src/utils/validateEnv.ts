import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    MONGO_URI: str(),
    PORT: port(),
  });
};

export default validateEnv;

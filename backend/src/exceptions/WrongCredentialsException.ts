import HttpException from "./HttpException";

class WrongCredentialsException extends HttpException {
  constructor() {
    super(400, `Wrong email or password`);
  }
}

export default WrongCredentialsException;

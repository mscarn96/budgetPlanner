import HttpException from "./HttpException";

class WrongAuthTokenException extends HttpException {
  constructor(id: string) {
    super(401, `Wrong authentication token`);
  }
}

export default WrongAuthTokenException;

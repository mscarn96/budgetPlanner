import HttpException from "./HttpException";

class BalanceAlreadyExistsException extends HttpException {
  constructor(userId: string | undefined) {
    super(400, `Balance for user with id ${userId} already exists!`);
  }
}

export default BalanceAlreadyExistsException;

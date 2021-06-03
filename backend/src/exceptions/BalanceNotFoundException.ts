import HttpException from "./HttpException";

class BalanceNotFoundException extends HttpException {
  constructor(userId: string | undefined) {
    super(404, `Balance for user with id ${userId} not found`);
  }
}

export default BalanceNotFoundException;

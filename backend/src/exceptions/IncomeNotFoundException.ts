import HttpException from "./HttpException";

class IncomeNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Income with id ${id} not found`);
  }
}

export default IncomeNotFoundException;

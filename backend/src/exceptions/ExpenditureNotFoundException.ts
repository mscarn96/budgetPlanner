import HttpException from "./HttpException";

class ExpenditureNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Expenditure with id ${id} not found`);
  }
}

export default ExpenditureNotFoundException;

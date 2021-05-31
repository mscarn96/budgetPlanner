import {
  SingleExpenditure,
  Subscription,
} from "../expenditures/expenditure.interface";
import { RegularIncome, SingleIncome } from "../incomes/income.interface";

export interface Budget {
  balance: number;
  incomes: Array<RegularIncome>;
  subscriptions: Array<Subscription>;
  history: Array<
    SingleExpenditure | Subscription | SingleIncome | RegularIncome
  >;
  userId: string;
}

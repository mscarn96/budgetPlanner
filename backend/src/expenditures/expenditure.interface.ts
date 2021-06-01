export default interface Expenditure {
  name: string;
  cyclic: boolean;
  dayPeriod?: number;
  value: number;
  createdAt: Date;
  User: string;
}

export type SingleExpenditure = Expenditure & {
  cyclic: false;
};

export type Subscription = Expenditure & {
  cyclic: true;
  dayPeriod: number;
  icon: string;
};

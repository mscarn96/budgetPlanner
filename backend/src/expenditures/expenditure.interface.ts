interface Expenditure {
  name: string;
  cyclic: boolean;
  dayPeriod?: number;
  value: number;
  createdAt: Date;
}
export default Expenditure;

export type SingleExpenditure = Expenditure & {
  cyclic: false;
};

export type Subscription = Expenditure & {
  cyclic: true;
  dayPeriod: number;
  icon: string;
};

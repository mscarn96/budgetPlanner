export default interface Income {
  name: string;
  value: number;
  cyclic: boolean;
  dayPeriod?: number;
  createdAt: Date;
}

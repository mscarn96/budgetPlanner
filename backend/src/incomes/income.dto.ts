import {
  IsBoolean,
  IsDate,
  IsNumber,
  Length,
  ValidateIf,
} from "class-validator";

class CreateIncomeDto {
  @Length(3, 20)
  public name: string;

  @IsNumber()
  public value: number;

  @IsBoolean()
  public cyclic: string;

  @ValidateIf((o) => o.cyclic)
  @IsNumber()
  public dayPeriod: number;

  @IsDate()
  createdAt: string;
}

export default CreateIncomeDto;

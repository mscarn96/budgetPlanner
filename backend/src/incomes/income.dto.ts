import {
  IsBoolean,
  IsDateString,
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
  public cyclic: boolean;

  @ValidateIf((o) => o.cyclic)
  @IsNumber()
  public dayPeriod?: number;

  @IsDateString()
  public createdAt: Date;
}

export default CreateIncomeDto;

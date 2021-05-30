import {
  IsBoolean,
  IsDateString,
  IsNumber,
  Length,
  ValidateIf,
} from "class-validator";

class CreateExpenditureDto {
  @Length(3, 20)
  public name: string;

  @IsBoolean()
  public cyclic: boolean;

  @ValidateIf((o) => o.cyclic)
  @IsNumber()
  public dayPeriod?: number;

  @IsNumber()
  public value: number;

  @IsDateString()
  createdAt: Date;
}

export default CreateExpenditureDto;

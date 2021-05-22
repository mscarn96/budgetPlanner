import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  ValidateIf,
} from "class-validator";

class CreateExpenditureDto {
  @IsString()
  public name: string;

  @IsBoolean()
  public cyclic: string;

  @ValidateIf((o) => o.cyclic)
  @IsNumber()
  public dayPeriod: number;

  @IsString()
  public icon: string;

  @IsDate()
  createdAt: string;
}

export default CreateExpenditureDto;

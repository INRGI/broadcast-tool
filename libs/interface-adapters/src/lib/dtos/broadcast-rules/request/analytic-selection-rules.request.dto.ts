import { IsNumber } from "class-validator";

export class AnalyticSelectionRulesRequestDto {
  @IsNumber()
  public clickableCopiesDaysInterval: number;

  @IsNumber()
  public convertibleCopiesDaysInterval: number;

  @IsNumber()
  public domainRevenueDaysInterval: number;

  @IsNumber()
  public warmUpCopiesDaysInterval: number;

  @IsNumber()
  public testCopiesDaysInterval: number;
}

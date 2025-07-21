import { IsNumber } from "class-validator";

export class TestingRulesRequestDto {
  @IsNumber()
  public maxSendsToBeTestCopy: number;

  @IsNumber()
  public similarTestCopyLimitPerDay: number;
}

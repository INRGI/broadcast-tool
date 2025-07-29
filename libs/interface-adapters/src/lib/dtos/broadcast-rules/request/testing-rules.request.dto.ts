import { IsArray, IsNumber } from "class-validator";

export class TestingRulesRequestDto {
  @IsNumber()
  public maxSendsToBeTestCopy: number;

  @IsNumber()
  public similarTestCopyLimitPerDay: number;

  @IsArray()
  public newTestCopiesGroupNames: string[];
}

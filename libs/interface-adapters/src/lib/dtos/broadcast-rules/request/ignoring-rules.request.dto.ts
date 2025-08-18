import { IsArray } from "class-validator";

export class IgnoringRulesRequestDto {
  @IsArray()
  public productIndicators: string[];
}

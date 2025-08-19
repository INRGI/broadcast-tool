import { IsArray } from "class-validator";

export class IgnoringRulesRequestDto {
  @IsArray()
  public productIndicators: string[];

  @IsArray()
  public broadcastsTabs: string[];

  @IsArray()
  public broadcasts: string[];
}

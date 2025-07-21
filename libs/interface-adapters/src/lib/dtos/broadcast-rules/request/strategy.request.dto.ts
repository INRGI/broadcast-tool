import { IsArray, IsString } from "class-validator";

export class StrategyRequestDto {
  @IsString()
  public domain: string;

  @IsArray()
  public copiesTypes: Array<"click" | "conversion" | "test" | "warmup">;
}

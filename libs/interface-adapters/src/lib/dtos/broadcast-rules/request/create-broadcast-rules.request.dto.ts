import { IsString, Length } from "class-validator";
import { UsageRulesRequestDto } from "./usage-rules.request.dto";
import { ProductRulesRequestDto } from "./product-rules.request.dto";
import { CopyAssignmentStrategyRulesRequestDto } from "./copy-assignment-strategy-rules.request.dto";

export class CreateBroadcastRulesRequestDto {
  @IsString()
  @Length(1, 50)
  public name: string;

  @IsString()
  public broadcastSpreadsheetId: string;

  public usageRules: UsageRulesRequestDto;

  public productRules: ProductRulesRequestDto;

  public copyAssignmentStrategyRules: CopyAssignmentStrategyRulesRequestDto;
}

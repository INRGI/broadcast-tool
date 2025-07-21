import { IsString, Length } from "class-validator";
import { UsageRulesRequestDto } from "../request/usage-rules.request.dto";
import { ProductRulesRequestDto } from "../request/product-rules.request.dto";
import { CopyAssignmentStrategyRulesRequestDto } from "../request/copy-assignment-strategy-rules.request.dto";

export class BroadcastRulesResponseDto {
  @IsString()
  @Length(1, 50)
  public name: string;

  @IsString()
  public broadcastSpreadsheetId: string;

  public usageRules: UsageRulesRequestDto;

  public productRules: ProductRulesRequestDto;

  public copyAssignmentStrategyRules: CopyAssignmentStrategyRulesRequestDto;
}

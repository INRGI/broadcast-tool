import { CopyAssignmentStrategyRules } from "./copy-assignment-strategy-rules.interface";
import { ProductRules } from "./product-rules.interface";
import { UsageRules } from "./usage-rules.interface";

export interface BroadcastRulesEntity {
  _id: string;
  name: string;
  broadcastSpreadsheetId: string;
  usageRules: UsageRules; 
  productRules: ProductRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

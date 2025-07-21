import {
  CopyAssignmentStrategyRules,
  ProductRules,
  UsageRules,
} from "../../../types/broadcast-tool";

export interface CreateBroadcastRulesRequest {
  name: string;
  broadcastSpreadsheetId: string;
  usageRules: UsageRules;
  productRules: ProductRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

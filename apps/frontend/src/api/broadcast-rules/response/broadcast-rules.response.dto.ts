import {
  AnalyticSelectionRules,
  CopyAssignmentStrategyRules,
  ProductRules,
  UsageRules,
} from "../../../types/broadcast-tool";

export interface BroadcastRulesResponse {
  _id: string;
  name: string;
  broadcastSpreadsheetId: string;
  usageRules: UsageRules
  productRules: ProductRules;
  analyticSelectionRules: AnalyticSelectionRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

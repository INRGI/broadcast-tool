import {
  CopyAssignmentStrategyRules,
  ProductRules,
  UsageRules,
} from "../../../types/broadcast-tool";

export interface CreateBroadcastRulesRequest {
  name: string;
  useOnlyTeamAnalytics: boolean;
  broadcastSpreadsheetId: string;
  usageRules: UsageRules;
  productRules: ProductRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

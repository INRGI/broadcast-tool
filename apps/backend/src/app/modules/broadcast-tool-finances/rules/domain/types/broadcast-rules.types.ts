import {
  CopyAssignmentStrategyRules,
  ProductRules,
  UsageRules,
} from '@epc-services/interface-adapters';

export interface CreateBroadcastRulesProps {
  name: string;
  broadcastSpreadsheetId: string;
  useOnlyTeamAnalytics: boolean;
  usageRules: UsageRules;
  productRules: ProductRules;
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

export type BroadcastRulesProps = CreateBroadcastRulesProps

export interface UpdateBroadcastRulesProps {
  readonly name: string;
  readonly useOnlyTeamAnalytics: boolean;
  readonly broadcastSpreadsheetId: string;
  readonly usageRules: UsageRules;
  readonly productRules: ProductRules;
  readonly copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

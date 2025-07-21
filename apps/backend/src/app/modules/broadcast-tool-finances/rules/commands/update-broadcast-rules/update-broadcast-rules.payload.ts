import {
  CopyAssignmentStrategyRules,
  ProductRules,
  UsageRules,
} from '@epc-services/interface-adapters';

export interface UpdateBroadcastRulesPayload {
  readonly _id: string;
  readonly broadcastSpreadsheetId: string;
  readonly name: string;
  readonly usageRules: UsageRules;
  readonly productRules: ProductRules;
  readonly copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

import { IgnoringRules } from "@epc-services/interface-adapters";

export interface CheckIfProductPriorityPayload {
  product: string;
  priorityCopiesData: string[];
  ignoringRules: IgnoringRules;
}

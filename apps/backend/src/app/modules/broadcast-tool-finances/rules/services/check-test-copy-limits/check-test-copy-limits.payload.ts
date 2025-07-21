import { GetAllDomainsResponseDto, TestingRules } from "@epc-services/interface-adapters";

export interface CheckTestCopyLimitsPayload {
  copyName: string;
  broadcast: GetAllDomainsResponseDto;
  testingRules: TestingRules;
  sendingDate: string;
}

import {
  CopyAssignmentStrategyRules,
  Strategy,
} from '@epc-services/interface-adapters';

export function getCopyStrategyForDomain(
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules,
  domain: string
): Strategy | null {
  return (
    copyAssignmentStrategyRules.domainStrategies.find(
      (s) => s.domain === domain
    ) ?? null
  );
}


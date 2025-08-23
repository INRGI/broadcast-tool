import { DomainTabPriorities } from './domain-tab-priorities.interface';
import { Strategy } from './strategy.interface';

export interface CopyAssignmentStrategyRules {
  domainStrategies: Strategy[];
  domainPriorities: DomainTabPriorities[];
}

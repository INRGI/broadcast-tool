import {
  BroadcastDomain,
  GetAllDomainsResponseDto,
  GetDomainDataResponse,
  GetProductDataResponse,
} from '@epc-services/interface-adapters';
import { BroadcastRulesProps } from '../../../rules/domain/types/broadcast-rules.types';
import { AdminBroadcastConfigProps } from '../../../rules/domain/types/admin-broadcast-config.types';

export interface VerifyCopyWithoutQueuePayload {
  broadcast: GetAllDomainsResponseDto;
  broadcastDomain: BroadcastDomain;
  copyName: string;
  sheetName: string;
  sendingDate: string;
  priorityCopiesData: string[];
  broadcastRules: BroadcastRulesProps;
  adminBroadcastConfig: AdminBroadcastConfigProps,
  domainsData: GetDomainDataResponse[];
  productsData: GetProductDataResponse[];
}

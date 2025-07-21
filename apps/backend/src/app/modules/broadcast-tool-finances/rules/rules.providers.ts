import { Provider } from "@nestjs/common";
import { GetBroadcastRulesByIdQueryService } from "./queries/get-broadcast-rules-by-id/get-broadcast-rules-by-id.query-service";
import { UpdateBroadcastRulesService } from "./commands/update-broadcast-rules/update-broadcast-rules.service";
import { BroadcastRulesMessageController } from "./controllers/broadcast-rules.message.controller";
import { DeleteBroadcastRulesService } from "./commands/delete-broadcast-rules/delete-broadcast-rules.service";
import { CreateBroadcastRulesService } from "./commands/create-broadcast-rules/create-broadcast-rules.service";
import { CheckCopyLastSendService } from "./services/check-copy-last-send/check-copy-last-send.service";
import { CheckIfCopyCanBeTestedService } from "./services/check-if-copy-can-be-tested/check-if-copy-can-be-tested.service";
import { CheckIfProductCanBeSendService } from "./services/check-if-product-can-be-send/check-if-product-can-be-send.service";
import { CheckProductLastSendService } from "./services/check-product-last-send/check-product-last-send.service";
import { GetPaginatedBroadcastRulesQueryService } from "./queries/get-paginated-broadcast-rules/get-paginated-broadcast-rules.query-service";
import { CheckIfCopyCanBeSendService } from "./services/check-if-copy-can-be-send/check-if-copy-can-be-send.service";
import { CheckIfDomainActiveService } from "./services/check-if-domain-active/check-if-domain-active.service";
import { CheckIfCopyBlacklistedService } from "./services/check-if-copy-blacklisted/check-if-copy-blacklisted.service";
import { CheckIfDomainWarmupService } from "./services/check-if-domain-warmup/check-if-domain-warmup.service";
import { CheckWarmupCopyLimitsService } from "./services/check-warmup-copy-limits/check-warmup-copy-limits.service";
import { CheckIfProductPriorityService } from "./services/check-if-product-priority/check-if-product-priority.service";
import { CheckIfPartnerCanBeSendService } from "./services/check-if-partner-can-be-send/check-if-partner-can-be-send.service";
import { CheckIfSectorCanBeSendService } from "./services/check-if-sector-can-be-send/check-if-sector-can-be-send.service";
import { CheckTestCopyLimitsService } from "./services/check-test-copy-limits/check-test-copy-limits.service";
import { CreateAdminBroadcastConfigService } from "./commands/create-admin-broadcast-config/create-admin-broadcast-config.service";
import { UpdateAdminBroadcastConfigService } from "./commands/update-admin-broadcast-config/update-admin-broadcast-config.service";
import { AdminBroadcastConfigMessageController } from "./controllers/admin-broadcast-config.controller";
import { GetAdminBroadcastConfigByNicheQueryService } from "./queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";
import { RecheckCopyService } from "./services/recheck-copy/recheck-copy.service";

export const messageControllers = [
  BroadcastRulesMessageController,
  AdminBroadcastConfigMessageController,
];

export const queryProviders: Provider[] = [
  GetBroadcastRulesByIdQueryService,
  GetPaginatedBroadcastRulesQueryService,
  GetAdminBroadcastConfigByNicheQueryService,
];

export const serviceProviders: Provider[] = [
  UpdateBroadcastRulesService,
  UpdateAdminBroadcastConfigService,
  DeleteBroadcastRulesService,
  CreateBroadcastRulesService,
  CreateAdminBroadcastConfigService,
  CheckCopyLastSendService,
  CheckIfCopyCanBeTestedService,
  CheckIfProductCanBeSendService,
  CheckProductLastSendService,
  CheckIfCopyCanBeSendService,
  CheckIfDomainActiveService,
  CheckIfCopyBlacklistedService,
  CheckIfDomainWarmupService,
  CheckWarmupCopyLimitsService,
  CheckIfProductPriorityService,
  CheckIfPartnerCanBeSendService,
  CheckIfSectorCanBeSendService,
  CheckTestCopyLimitsService,
  RecheckCopyService,
];

import { Injectable } from "@nestjs/common";
import {
  CopyType,
  MakeBroadcastResponseDto,
} from "@epc-services/interface-adapters";
import { RedoBroadcastPayload } from "./redo-broadcast.payload";
import { getDateRange } from "../../utils/getDateRange";
import { GetUnavailableBroadcastCopiesService } from "../get-unavailable-broadcast-copies/get-unavailable-broadcast-copies.service";
import { GetBroadcastRulesByIdQueryService } from "../../../rules/queries/get-broadcast-rules-by-id/get-broadcast-rules-by-id.query-service";
import { GetAdminBroadcastConfigByNicheQueryService } from "../../../rules/queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";
import { GetAllDomainsService } from "../get-all-domains/get-all-domains.service";
import { GetAllProductsDataService } from "../../../monday/services/get-all-products-data/get-all-products-data.service";
import { GetConvertableCopiesService } from "../get-convertable-copies/get-convertable-copies.service";
import { GetAllDomainsDataService } from "../../../monday/services/get-all-domains-data/get-all-domains-data.service";
import { VerifyConvCopyForDomainService } from "../../../copy-verify/services/verify-conv-copy-for-domain/verify-conv-copy-for-domain.service";
import { cleanCopyName } from "../../../rules/utils/cleanCopyName";
import { GetAllPriorityProductsService } from "../../../priority/services/get-all-priority-products/get-all-priority-products.service";
import { GetPossibleReplacementCopiesService } from "../get-possible-replacement-copies/get-possible-replacement-copies.service";
import { AddCustomLinkIndicatorService } from "../add-custom-link-indicator/add-custom-link-indicator.service";
import { AddPriorityCopyIndicatorService } from "../add-priority-copy-indicator/add-priority-copy-indicator.service";
import { CheckIfProductPriorityService } from "../../../rules/services/check-if-product-priority/check-if-product-priority.service";
import { cleanProductName } from "../../../rules/utils/cleanProductName";
import { CalculateBroadcastSendingService } from "../calculate-broadcast-sending/calculate-broadcast-sending.service";
import { GetBlacklistedCopiesService } from "../../../bigQuery/services/get-blacklisted-copies/get-blacklisted-copies.service";

@Injectable()
export class RedoBroadcastService {
  constructor(
    private readonly getUnavailableBroadcastCopiesService: GetUnavailableBroadcastCopiesService,
    private readonly getBroadcastRulesByIdQueryService: GetBroadcastRulesByIdQueryService,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService,
    private readonly getBroadcastService: GetAllDomainsService,
    private readonly getAllMondayProductsDataService: GetAllProductsDataService,
    private readonly getConvertableCopiesService: GetConvertableCopiesService,
    private readonly getAllMondayDomainsDataService: GetAllDomainsDataService,
    private readonly verifyConvCopyForDomainService: VerifyConvCopyForDomainService,
    private readonly getAllPriorityProductsService: GetAllPriorityProductsService,
    private readonly getPossibleReplacementCopiesService: GetPossibleReplacementCopiesService,
    private readonly addCustomLinkIndicatorService: AddCustomLinkIndicatorService,
    private readonly addPriorityCopyIndicatorService: AddPriorityCopyIndicatorService,
    private readonly checkIfProductPriorityService: CheckIfProductPriorityService,
    private readonly calculateBroadcastSendingService: CalculateBroadcastSendingService,
    private readonly getBlacklistedCopiesService: GetBlacklistedCopiesService
  ) {}
  public async execute(
    payload: RedoBroadcastPayload
  ): Promise<MakeBroadcastResponseDto> {
    const { broadcastRuleId, fromDate, toDate } = payload;

    const dateRange = getDateRange(fromDate, toDate);

    const broadcastRule = await this.getBroadcastRulesByIdQueryService.execute({
      broadcastRulesId: broadcastRuleId,
    });

    const adminConfig =
      await this.getAdminBroadcastConfigByNicheQueryService.execute({
        niche: "finance",
      });

    const broadcast = await this.getBroadcastService.execute({
      broadcastId: broadcastRule.broadcastSpreadsheetId,
      usageRules: broadcastRule.usageRules,
      ignoringRules: adminConfig.ignoringRules,
    });

    const productsData = await this.getAllMondayProductsDataService.execute();

    const domainsData = await this.getAllMondayDomainsDataService.execute();

    const convertibleCopies = await this.getConvertableCopiesService.execute({
      daysBeforeInterval:
        adminConfig.analyticSelectionRules.convertibleCopiesDaysInterval,
      broadcastName: broadcastRule.useOnlyTeamAnalytics
        ? broadcastRule.name
        : undefined,
    });

    const priorityCopiesData =
      await this.getAllPriorityProductsService.execute();

    const blacklistedCopies = await this.getBlacklistedCopiesService.execute();
    broadcastRule.productRules.blacklistedCopies = [
      ...broadcastRule.productRules.blacklistedCopies,
      ...blacklistedCopies,
    ];

    const unavailableCopies =
      await this.getUnavailableBroadcastCopiesService.execute({
        broadcast,
        dateRange,
        adminBroadcastConfig: adminConfig,
        broadcastRules: broadcastRule,
        productsData,
      });

    const added: string[] = [];

    for (const date of dateRange) {
      for (const sheet of broadcast.sheets) {
        const tabCopyLimit = broadcastRule.usageRules.copyTabLimit?.find(
          (tab) => tab.sheetName === sheet.sheetName
        );

        if (!tabCopyLimit?.limit || tabCopyLimit.limit === 0) continue;

        for (let i = 0; i < sheet.domains.length; i++) {
          const domain = sheet.domains[i];
          const broadcastForDate = domain.broadcastCopies.find(
            (c) => c.date === date
          );
          if (!broadcastForDate) continue;

          const unavailableCopiesInDomain = broadcastForDate.copies.filter(
            (c) => unavailableCopies.includes(cleanCopyName(c.name))
          );
          if (unavailableCopiesInDomain.length === 0) continue;

          const newCopies = [...broadcastForDate.copies];

          for (const copy of unavailableCopiesInDomain) {
            let validCopy: string | null = null;

            for (const convertibleCopy of convertibleCopies) {
              if (added.includes(convertibleCopy)) continue;

              const result = await this.verifyConvCopyForDomainService.execute({
                broadcast,
                broadcastDomain: domain,
                adminBroadcastConfig: adminConfig,
                copyName: convertibleCopy,
                sheetName: sheet.sheetName,
                broadcastRules: broadcastRule,
                sendingDate: date,
                productsData,
                domainsData,
                priorityCopiesData,
              });

              if (result.isValid) {
                validCopy = convertibleCopy;
                break;
              }
            }

            if (validCopy) {
              const copyIndex = newCopies.findIndex(
                (c) => c.name === copy.name
              );
              const isCopyPriority =
                await this.checkIfProductPriorityService.execute({
                  product: cleanProductName(copy.name),
                  priorityCopiesData,
                  ignoringRules: adminConfig.ignoringRules,
                });
              if (copyIndex !== -1) {
                newCopies[copyIndex] = {
                  ...newCopies[copyIndex],
                  name: validCopy,
                  copyType: CopyType.Conversion,
                  isPriority: isCopyPriority,
                };
                added.push(validCopy);
              }
            }
          }

          if (
            newCopies.some(
              (c, idx) => c.name !== broadcastForDate.copies[idx].name
            )
          ) {
            sheet.domains[i] = {
              ...domain,
              broadcastCopies: domain.broadcastCopies.map((entry) =>
                entry.date === date
                  ? { ...entry, copies: newCopies, isModdified: true }
                  : entry
              ),
            };
          }
        }
      }
    }

    const broadcastWithPossibleCopies =
      await this.getPossibleReplacementCopiesService.execute({
        broadcast: broadcast,
        broadcastRules: broadcastRule,
        adminBroadcastConfig: adminConfig,
        dateRange,
        domainsData,
        productsData,
        priorityCopiesData,
        clickableCopies: [],
        convertibleCopies,
        warmupCopies: [],
        testCopies: [],
      });

    const broadcastWithPriorityIndicator =
      await this.addPriorityCopyIndicatorService.execute({
        broadcast: broadcastWithPossibleCopies,
        dateRange,
        ignoringRules: adminConfig.ignoringRules,
      });

    const broadcastWithCustomLinkIndicator =
      await this.addCustomLinkIndicatorService.execute({
        broadcast: broadcastWithPriorityIndicator,
        dateRange,
        productsData,
        ignoringRules: adminConfig.ignoringRules,
      });

    const calculatedChanges =
      await this.calculateBroadcastSendingService.execute({
        broadcast: broadcastWithCustomLinkIndicator,
        dateRange,
        broadcastName: broadcastRule.name,
        productsData,
        calculateOnlyModdified: true,
      });

    return {
      sheets: broadcastWithCustomLinkIndicator.sheets,
      calculatedChanges,
    };
  }
}

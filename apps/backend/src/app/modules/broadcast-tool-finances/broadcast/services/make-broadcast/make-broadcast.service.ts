import { Injectable } from "@nestjs/common";
import { MakeBroadcaastPayload } from "./make-broadcast.payload";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";
import { GetBroadcastRulesByIdQueryService } from "../../../rules/queries/get-broadcast-rules-by-id/get-broadcast-rules-by-id.query-service";
import { GetAllDomainsService } from "../get-all-domains/get-all-domains.service";
import { GetClickableCopiesService } from "../get-clickable-copies/get-clickable-copies.service";
import { GetConvertableCopiesService } from "../get-convertable-copies/get-convertable-copies.service";
import { GetWarmupCopiesService } from "../get-warmup-copies/get-warmup-copies.service";
import { GetTestableCopiesService } from "../get-testable-copies/get-testable-copies.service";
import { BroadcastAssignerService } from "../broadcast-assigner/broadcast-assigner.service";
import { GetAllDomainsDataService } from "../../../monday/services/get-all-domains-data/get-all-domains-data.service";
import { GetAllProductsDataService } from "../../../monday/services/get-all-products-data/get-all-products-data.service";
import { GetDomainsRevenueService } from "../../../bigQuery/services/get-domains-revenue/get-domains-revenue.service";
import { GetAllPriorityProductsService } from "../../../priority/services/get-all-priority-products/get-all-priority-products.service";
import { AddPriorityCopyIndicatorService } from "../add-priority-copy-indicator/add-priority-copy-indicator.service";
import { ForceCopiesToRandomDomainsService } from "../force-copies-to-random-domains/force-copies-to-random-domains.service";
import { GetPossibleReplacementCopiesService } from "../get-possible-replacement-copies/get-possible-replacement-copies.service";
import { GetAdminBroadcastConfigByNicheQueryService } from "../../../rules/queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";
import { AddCustomLinkIndicatorService } from "../add-custom-link-indicator/add-custom-link-indicator.service";
import { getDateRange } from "../../utils/getDateRange";
import { normalizeDomain } from "../../../rules/utils/normalizeDomain";

@Injectable()
export class MakeBroadcastService {
  constructor(
    private readonly getBroadcastRulesByIdQueryService: GetBroadcastRulesByIdQueryService,
    private readonly getBroadcastService: GetAllDomainsService,
    private readonly getClickableCopiesService: GetClickableCopiesService,
    private readonly getConvertableCopiesService: GetConvertableCopiesService,
    private readonly getWarmupCopiesService: GetWarmupCopiesService,
    private readonly broadcastAssignerService: BroadcastAssignerService,
    private readonly getAllMondayDomainsDataService: GetAllDomainsDataService,
    private readonly getAllMondayProductsDataService: GetAllProductsDataService,
    private readonly getAllPriorityProductsService: GetAllPriorityProductsService,
    private readonly addPriorityCopyIndicatorService: AddPriorityCopyIndicatorService,
    private readonly getTestableCopiesService: GetTestableCopiesService,
    private readonly forceCopiesToRandomDomainsService: ForceCopiesToRandomDomainsService,
    private readonly getPossibleReplacementCopiesService: GetPossibleReplacementCopiesService,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService,
    private readonly getDomainsRevenueService: GetDomainsRevenueService,
    private readonly addCustomLinkIndicatorService: AddCustomLinkIndicatorService
  ) {}
  public async execute(
    payload: MakeBroadcaastPayload
  ): Promise<GetAllDomainsResponseDto> {
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
    });

    const originalDomainOrderBySheet = new Map<string, string[]>();

    for (const sheet of broadcast.sheets) {
      originalDomainOrderBySheet.set(
        sheet.sheetName,
        sheet.domains.map((d) => d.domain)
      );
    }

    const domainsRevenue = await this.getDomainsRevenueService.execute({
      days: adminConfig.analyticSelectionRules.domainRevenueDaysInterval,
    });

    const clickableCopies = await this.getClickableCopiesService.execute({
      daysBeforeInterval:
        adminConfig.analyticSelectionRules.clickableCopiesDaysInterval,
    });

    const convertibleCopies = await this.getConvertableCopiesService.execute({
      daysBeforeInterval:
        adminConfig.analyticSelectionRules.convertibleCopiesDaysInterval,
    });

    const warmupCopies = await this.getWarmupCopiesService.execute({
      daysBeforeInterval:
        adminConfig.analyticSelectionRules.warmUpCopiesDaysInterval,
    });

    const testCopies = await this.getTestableCopiesService.execute({
      daysBeforeInterval:
        adminConfig.analyticSelectionRules.testCopiesDaysInterval,
      maxSendsToBeTestCopy: adminConfig.testingRules.maxSendsToBeTestCopy,
    });

    const priorityCopiesData =
      await this.getAllPriorityProductsService.execute();

    const domainsData = await this.getAllMondayDomainsDataService.execute();

    const productsData = await this.getAllMondayProductsDataService.execute();

    const CLICK_WEIGHT = 1;
    const CONVERSION_WEIGHT = 1000;

    const domainPriorityMap = new Map<string, number>();

    domainsRevenue.data.forEach((entry) => {
      const key = normalizeDomain(entry.Domain ?? "");
      const clicks = Number(entry.UC ?? 0);
      const conversions = Number(entry.Conversion ?? 0);

      const score = CLICK_WEIGHT * clicks + CONVERSION_WEIGHT * conversions;

      if (key) {
        domainPriorityMap.set(key, score);
      }
    });

    for (const date of dateRange) {
      for (const sheet of broadcast.sheets) {
        sheet.domains.sort((a, b) => {
          const priorityA =
            domainPriorityMap.get(normalizeDomain(a.domain)) ?? 0;
          const priorityB =
            domainPriorityMap.get(normalizeDomain(b.domain)) ?? 0;
          return priorityB - priorityA;
        });
        for (let i = 0; i < sheet.domains.length; i++) {
          const updatedDomain = await this.broadcastAssignerService.execute({
            domain: sheet.domains[i],
            broadcastRules: broadcastRule,
            sheetName: sheet.sheetName,
            adminBroadcastConfig: adminConfig,
            broadcast,
            date,
            clickableCopies,
            convertibleCopies,
            warmupCopies,
            testCopies,
            domainsData,
            productsData,
            priorityCopiesData,
          });

          sheet.domains[i] = updatedDomain;
        }
      }
    }

    const copiesToForce = broadcastRule.productRules.copyMinLimitPerDay;

    const broadcastWithForcedCopies =
      await this.forceCopiesToRandomDomainsService.execute({
        broadcastRules: broadcastRule,
        copiesToForce,
        broadcast,
        fromDate,
        toDate,
        domainsData,
        productsData,
        priorityCopiesData,
        adminBroadcastConfig: adminConfig,
      });

    const broadcastWithPossibleCopies =
      await this.getPossibleReplacementCopiesService.execute({
        broadcast: broadcastWithForcedCopies,
        broadcastRules: broadcastRule,
        adminBroadcastConfig: adminConfig,
        dateRange,
        domainsData,
        productsData,
        priorityCopiesData,
        clickableCopies,
        convertibleCopies,
        warmupCopies,
        testCopies,
      });

    const broadcastWithPriorityIndicator =
      await this.addPriorityCopyIndicatorService.execute({
        broadcast: broadcastWithPossibleCopies,
        dateRange,
      });

    const broadcastWithCustomLinkIndicator =
      await this.addCustomLinkIndicatorService.execute({
        broadcast: broadcastWithPriorityIndicator,
        dateRange,
        productsData,
      });

    for (const sheet of broadcastWithCustomLinkIndicator.sheets) {
      const originalOrder = originalDomainOrderBySheet.get(sheet.sheetName);
      if (!originalOrder) continue;

      sheet.domains.sort(
        (a, b) =>
          originalOrder.indexOf(a.domain) - originalOrder.indexOf(b.domain)
      );
    }

    return broadcastWithCustomLinkIndicator;
  }
}

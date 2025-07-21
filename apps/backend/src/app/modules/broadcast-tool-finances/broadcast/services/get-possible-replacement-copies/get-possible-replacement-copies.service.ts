import {
  BroadcastCopy,
  CopyType,
  GetAllDomainsResponseDto,
} from "@epc-services/interface-adapters";
import { GetPossibleReplacementCopiesPayload } from "./get-possible-replacement-copies.payload";
import { Injectable } from "@nestjs/common";
import { VerifyCopyForDomainService } from "../../../copy-verify/services/verify-copy-for-domain/verify-copy-for-domain.service";
import { VerifyConvCopyForDomainService } from "../../../copy-verify/services/verify-conv-copy-for-domain/verify-conv-copy-for-domain.service";
import { VerifyTestCopyForDomainService } from "../../../copy-verify/services/verify-test-copy-for-domain/verify-test-copy-for-domain.service";
import { VerifyWarmupCopyForDomainService } from "../../../copy-verify/services/verify-warmup-copy-for-domain/verify-warmup-copy-for-domain.service";
import { getCopyStrategyForDomain } from "../../utils/getCopyStrategyForDomain";
import { CheckIfProductPriorityService } from "../../../rules/services/check-if-product-priority/check-if-product-priority.service";
import { cleanProductName } from "../../../rules/utils/cleanProductName";

@Injectable()
export class GetPossibleReplacementCopiesService {
  constructor(
    private readonly clickValidator: VerifyCopyForDomainService,
    private readonly conversionValidator: VerifyConvCopyForDomainService,
    private readonly testValidator: VerifyTestCopyForDomainService,
    private readonly warmUpValidator: VerifyWarmupCopyForDomainService,
    private readonly checkIfProductPriorityService: CheckIfProductPriorityService
  ) {}

  public async execute(
    payload: GetPossibleReplacementCopiesPayload
  ): Promise<GetAllDomainsResponseDto> {
    const {
      broadcast,
      broadcastRules,
      adminBroadcastConfig,
      clickableCopies,
      convertibleCopies,
      dateRange,
      warmupCopies,
      testCopies,
      productsData,
      domainsData,
      priorityCopiesData,
    } = payload;

    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        const strategy = getCopyStrategyForDomain(
          broadcastRules.copyAssignmentStrategyRules,
          domain.domain
        );
        if (!strategy) continue;

        for (const day of domain.broadcastCopies) {
          if (
            day.date < dateRange[0] ||
            day.date > dateRange[dateRange.length - 1]
          )
            continue;
          const addedNames = new Set(day.copies.map((c) => c.name));
          const usedProducts = new Set(
            day.copies.map((c) => cleanProductName(c.name))
          );          
          const proposedNames = new Set<string>();
          const possible: BroadcastCopy[] = [];

          for (const type of strategy.copiesTypes) {
            const validator = this.getValidator(type);
            const pool = this.getPool(type, {
              clickableCopies,
              convertibleCopies,
              testCopies,
              warmupCopies,
            });

            let addedForType = 0;

            for (const name of pool) {
              const product = cleanProductName(name);
              if (addedNames.has(name) || proposedNames.has(name) || usedProducts.has(product)) continue;
              if (addedForType >= 3) break;

              const result = await validator.execute({
                broadcast,
                adminBroadcastConfig,
                broadcastDomain: domain,
                copyName: name,
                broadcastRules: broadcastRules,
                sendingDate: day.date,
                productsData,
                domainsData,
                priorityCopiesData,
                sheetName: sheet.sheetName,
              });

              if (result.isValid) {
                const isCopyPriority =
                  await this.checkIfProductPriorityService.execute({
                    product: cleanProductName(name),
                    priorityCopiesData,
                  });

                possible.push({
                  name,
                  isPriority: isCopyPriority,
                  copyType: type as CopyType,
                });
                proposedNames.add(name);
                usedProducts.add(product);
                addedForType++;
              }
            }
          }

          day.possibleReplacementCopies = possible;
        }
      }
    }

    return broadcast;
  }

  private getPool(
    type: "click" | "conversion" | "test" | "warmup",
    pools: {
      clickableCopies: string[];
      convertibleCopies: string[];
      testCopies: string[];
      warmupCopies: string[];
    }
  ): string[] {
    switch (type) {
      case "click":
        return pools.clickableCopies;
      case "conversion":
        return pools.convertibleCopies;
      case "test":
        return pools.testCopies;
      case "warmup":
        return pools.warmupCopies;
    }
  }

  private getValidator(type: "click" | "conversion" | "test" | "warmup") {
    switch (type) {
      case "click":
        return this.clickValidator;
      case "conversion":
        return this.conversionValidator;
      case "test":
        return this.testValidator;
      case "warmup":
        return this.warmUpValidator;
    }
  }
}

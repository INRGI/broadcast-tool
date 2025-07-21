import { BroadcastAssignerPayload } from "./broadcast-assigner.payload";
import { BroadcastDomain } from "@epc-services/interface-adapters";
import { Injectable } from "@nestjs/common";
import { VerifyCopyForDomainService } from "../../../copy-verify/services/verify-copy-for-domain/verify-copy-for-domain.service";
import { VerifyWarmupCopyForDomainService } from "../../../copy-verify/services/verify-warmup-copy-for-domain/verify-warmup-copy-for-domain.service";
import { getCopyStrategyForDomain } from "../../utils/getCopyStrategyForDomain";
import { VerifyTestCopyForDomainService } from "../../../copy-verify/services/verify-test-copy-for-domain/verify-test-copy-for-domain.service";
import { VerifyConvCopyForDomainService } from "../../../copy-verify/services/verify-conv-copy-for-domain/verify-conv-copy-for-domain.service";

@Injectable()
export class BroadcastAssignerService {
  constructor(
    private readonly clickValidator: VerifyCopyForDomainService,
    private readonly conversionValidator: VerifyConvCopyForDomainService,
    private readonly testValidator: VerifyTestCopyForDomainService,
    private readonly warmUpValidator: VerifyWarmupCopyForDomainService
  ) {}

  public async execute(
    payload: BroadcastAssignerPayload
  ): Promise<BroadcastDomain> {
    let domain = payload.domain;
    const {
      broadcastRules,
      date,
      sheetName,
      clickableCopies,
      adminBroadcastConfig,
      convertibleCopies,
      testCopies,
      productsData,
      domainsData,
      broadcast,
      warmupCopies,
      priorityCopiesData,
    } = payload;

    const strategy = getCopyStrategyForDomain(
      broadcastRules.copyAssignmentStrategyRules,
      domain.domain
    );

    if (!strategy) return domain;
    const currentDayCopies = domain.broadcastCopies.find(
      (c) => c.date === date
    );

    if (
      currentDayCopies &&
      currentDayCopies?.copies &&
      currentDayCopies.copies.length >= strategy.copiesTypes.length
    )
      return domain;

    const added: string[] = [];

    for (const type of strategy.copiesTypes) {
      const pool = this.getCopyPool(type, {
        clickableCopies,
        convertibleCopies,
        testCopies,
        warmupCopies,
      });

      const validator = this.getValidator(type);
      if (!validator) continue;

      for (const copyName of pool) {
        if (added.includes(copyName)) continue;

        const result = await validator.execute({
          broadcast,
          broadcastDomain: domain,
          adminBroadcastConfig,
          copyName,
          sheetName,
          broadcastRules,
          sendingDate: date,
          productsData,
          domainsData,
          priorityCopiesData,
        });

        if (result.isValid) {
          domain = {
            ...domain,
            broadcastCopies: result.broadcastDomain.broadcastCopies,
          };
          added.push(copyName);
          break;
        }
      }
    }

    return domain;
  }

  private getCopyPool(
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
      default:
        return [];
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
      default:
        return null;
    }
  }
}

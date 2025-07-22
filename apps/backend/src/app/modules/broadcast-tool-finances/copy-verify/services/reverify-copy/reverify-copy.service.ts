import { Injectable } from "@nestjs/common";
import { ReverifyCopyPayload } from "./reverify-copy.payload";
import { RecheckCopyService } from "../../../rules/services/recheck-copy/recheck-copy.service";
import { CheckIfCopyBlacklistedService } from "../../../rules/services/check-if-copy-blacklisted/check-if-copy-blacklisted.service";

@Injectable()
export class ReverifyCopyService {
  constructor(
    private readonly recheckCopyService: RecheckCopyService,
    private readonly checkIfCopyBlacklistedService: CheckIfCopyBlacklistedService,
  ) {}
  public async execute(payload: ReverifyCopyPayload): Promise<boolean> {
    const {
      sendingDate,
      copyName,
      broadcastRules,
      adminBroadcastConfig,
      broadcastDomain,
      productsData,
    } = payload;

    const checkIfCopyBlacklistedServiceResult =
      await this.checkIfCopyBlacklistedService.execute({
        copyName,
        blacklistedCopies: broadcastRules.productRules.blacklistedCopies,
      });

    if (checkIfCopyBlacklistedServiceResult) {
      return false;
    }

    const recheckCopyServiceResult = await this.recheckCopyService.execute({
      sendingDate,
      copyName,
      broadcastRules,
      adminBroadcastConfig,
      broadcastDomain,
      productsData,
    });

    if (!recheckCopyServiceResult) {
      return false;
    }

    return true;
  }
}

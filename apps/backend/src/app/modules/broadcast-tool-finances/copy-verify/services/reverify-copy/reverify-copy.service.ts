import { Injectable } from "@nestjs/common";
import { ReverifyCopyPayload } from "./reverify-copy.payload";
import { RecheckCopyService } from "../../../rules/services/recheck-copy/recheck-copy.service";
import { CheckIfCopyBlacklistedService } from "../../../rules/services/check-if-copy-blacklisted/check-if-copy-blacklisted.service";
import { CheckIfPartnerCanBeSendService } from "../../../rules/services/check-if-partner-can-be-send/check-if-partner-can-be-send.service";
import { CheckIfSectorCanBeSendService } from "../../../rules/services/check-if-sector-can-be-send/check-if-sector-can-be-send.service";

@Injectable()
export class ReverifyCopyService {
  constructor(
    private readonly recheckCopyService: RecheckCopyService,
    private readonly checkIfCopyBlacklistedService: CheckIfCopyBlacklistedService,
    private readonly checkIfPartnerCanBeSendService: CheckIfPartnerCanBeSendService,
    private readonly checkIfSectorCanBeSendService: CheckIfSectorCanBeSendService
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

    const checkIfPartnerCanBeSendServiceResult =
      await this.checkIfPartnerCanBeSendService.execute({
        copyName,
        broadcastDomain,
        partnerRules: adminBroadcastConfig.partnerRules,
        productsData,
        sendingDate,
      });

    if (!checkIfPartnerCanBeSendServiceResult) {
      return false;
    }

    const checkIfSectorCanBeSendServiceResult =
      await this.checkIfSectorCanBeSendService.execute({
        copyName,
        broadcastDomain,
        productRules: broadcastRules.productRules,
        productsData,
        sendingDate,
      });

    if (!checkIfSectorCanBeSendServiceResult) {
      return false;
    }

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

    if (recheckCopyServiceResult) {
      return false;
    }

    return true;
  }
}

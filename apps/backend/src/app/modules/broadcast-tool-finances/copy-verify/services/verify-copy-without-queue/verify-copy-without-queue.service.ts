import { Injectable } from "@nestjs/common";
import { CheckCopyLastSendService } from "../../../rules/services/check-copy-last-send/check-copy-last-send.service";
import { CheckProductLastSendService } from "../../../rules/services/check-product-last-send/check-product-last-send.service";
import { CheckIfProductCanBeSendService } from "../../../rules/services/check-if-product-can-be-send/check-if-product-can-be-send.service";
import { CheckIfDomainActiveService } from "../../../rules/services/check-if-domain-active/check-if-domain-active.service";
import { CheckIfCopyBlacklistedService } from "../../../rules/services/check-if-copy-blacklisted/check-if-copy-blacklisted.service";
import {
  CopyType,
  VerifyCopyForDomainResponseDto,
} from "@epc-services/interface-adapters";
import { CheckIfProductPriorityService } from "../../../rules/services/check-if-product-priority/check-if-product-priority.service";
import { VerifyCopyWithoutQueuePayload } from "./verify-copy-without-queue.payload";
import { CheckIfPartnerCanBeSendService } from "../../../rules/services/check-if-partner-can-be-send/check-if-partner-can-be-send.service";
import { cleanCopyName } from "../../../rules/utils/cleanCopyName";
import { cleanProductName } from "../../../rules/utils/cleanProductName";

@Injectable()
export class VerifyCopyWithoutQueueService {
  constructor(
    private readonly checkCopyLastSendService: CheckCopyLastSendService,
    private readonly checkProductLastSendService: CheckProductLastSendService,
    private readonly checkIfProductCanBeSendService: CheckIfProductCanBeSendService,
    private readonly checkIfDomainActiveService: CheckIfDomainActiveService,
    private readonly checkIfCopyBlacklistedService: CheckIfCopyBlacklistedService,
    private readonly checkIfProductPriorityService: CheckIfProductPriorityService,
    private readonly checkIfPartnerCanBeSendService: CheckIfPartnerCanBeSendService,
  ) {}
  public async execute(
    payload: VerifyCopyWithoutQueuePayload
  ): Promise<VerifyCopyForDomainResponseDto> {
    const {
      broadcastDomain,
      copyName,
      sheetName,
      adminBroadcastConfig,
      broadcastRules,
      sendingDate,
      productsData,
      domainsData,
      broadcast,
      priorityCopiesData,
    } = payload;

    const tabCopyLimit = broadcastRules.usageRules.copyTabLimit?.find(
      (tab) => tab.sheetName === sheetName
    );

    if (tabCopyLimit.limit === 0) return { isValid: false, broadcastDomain };

    const checkCopyLastSendResult = await this.checkCopyLastSendService.execute(
      {
        copyName,
        broadcastDomain,
        possibleSendingDate: sendingDate,
        copyMinDelayPerDays: broadcastRules.usageRules.copyMinDelayPerDays,
      }
    );
    if (!checkCopyLastSendResult) {
      return { isValid: false, broadcastDomain };
    }

    const checkProductLastSendResult =
      await this.checkProductLastSendService.execute({
        copyName,
        broadcastDomain,
        possibleSendingDate: sendingDate,
        productMinDelayPerDays:
          broadcastRules.usageRules.productMinDelayPerDays,
      });

    if (!checkProductLastSendResult) {
      return { isValid: false, broadcastDomain };
    }

    const checkIfCopyBlacklistedServiceResult =
      await this.checkIfCopyBlacklistedService.execute({
        copyName,
        blacklistedCopies: broadcastRules.productRules.blacklistedCopies,
      });

    if (checkIfCopyBlacklistedServiceResult) {
      return { isValid: false, broadcastDomain };
    }

    const checkIfDomainActiveResult =
      await this.checkIfDomainActiveService.execute({
        domainRules: adminBroadcastConfig.domainRules,
        domain: broadcastDomain.domain,
        broadcast: broadcast,
        sendingDate,
        domainsData,
      });

    if (!checkIfDomainActiveResult) {
      return { isValid: false, broadcastDomain };
    }

    const checkIfPartnerCanBeSendServiceResult =
      await this.checkIfPartnerCanBeSendService.execute({
        copyName,
        broadcastDomain,
        partnerRules: adminBroadcastConfig.partnerRules,
        productsData,
        sendingDate,
        productRules: broadcastRules.productRules,
        broadcast,
        sheetName,
      });

    if (!checkIfPartnerCanBeSendServiceResult) {
      return { isValid: false, broadcastDomain };
    }

    const productName = cleanProductName(copyName);
    const matchingProducts = productsData.filter(
      (product) =>
        product.productName.startsWith(`${productName} -`) ||
        product.productName.startsWith(`*${productName} -`)
    );
    const productData = matchingProducts.find((p) => p.productStatus);
    if (!productData) return { isValid: false, broadcastDomain };

    if (
      broadcastRules.productRules.blacklistedSectors.includes(
        productData.sector
      )
    ) {
      return { isValid: false, broadcastDomain };
    }

    const checkIfProductCanBeSendResult =
      await this.checkIfProductCanBeSendService.execute({
        copyName,
        broadcast,
        productRules: broadcastRules.productRules,
        domain: broadcastDomain.domain,
        domainRules: adminBroadcastConfig.domainRules,
        domainsData,
        productsData,
        sendingDate,
        sheetName,
      });

    if (!checkIfProductCanBeSendResult) {
      return { isValid: false, broadcastDomain };
    }

    const isCopyHasSendingLimits =
      broadcastRules.productRules.copySendingLimitPerDay.find(
        (copySendingLimitPerDay) => {
          if (
            cleanCopyName(copySendingLimitPerDay.copyName) ===
            cleanCopyName(copyName)
          ) {
            return true;
          }
        }
      );

    if (isCopyHasSendingLimits) {
      let sendingCount = 0;

      for (const sheet of broadcast.sheets) {
        for (const domain of sheet.domains) {
          const sendingDateObj = domain.broadcastCopies.find(
            (date) => date.date === sendingDate
          );

          if (
            sendingDateObj &&
            sendingDateObj.copies.find(
              (copy) => cleanCopyName(copy.name) === cleanCopyName(copyName)
            )
          ) {
            sendingCount++;
          }
        }
      }

      if (sendingCount >= isCopyHasSendingLimits.limit) {
        return { isValid: false, broadcastDomain };
      }
    }

    const isCopyPriority = await this.checkIfProductPriorityService.execute({
      product: cleanProductName(copyName),
      priorityCopiesData,
    });

    let existingDate = broadcastDomain.broadcastCopies.find(
      (b) => b.date === sendingDate
    );

    if (!existingDate) {
      existingDate = {
        date: sendingDate,
        copies: [],
        isModdified: false,
        possibleReplacementCopies: [],
      };

      broadcastDomain.broadcastCopies.push(existingDate);
    }

    const updatedBroadcastCopies = broadcastDomain.broadcastCopies.map(
      (broadcastCopy) => {
        if (
          new Date(broadcastCopy.date).getUTCDate() ===
            new Date(sendingDate).getUTCDate() &&
          new Date(broadcastCopy.date).getUTCDay() ===
            new Date(sendingDate).getUTCDay()
        ) {
          const copies = [...broadcastCopy.copies];

          const indexToReplace = copies.findIndex(
            (c) => c.copyType === CopyType.Conversion
          );

          const replacement = {
            name: copyName,
            isPriority: isCopyPriority,
            copyType: CopyType.Unknown,
          };

          if (indexToReplace !== -1) {
            copies[indexToReplace] = replacement;
          } else if (copies.length > 0) {
            copies[copies.length - 1] = replacement;
          }

          return {
            ...broadcastCopy,
            copies,
            isModdified: true,
          };
        }
        return broadcastCopy;
      }
    );

    const isBroadcastCopyAdded = updatedBroadcastCopies.some(
      (broadcastCopy) =>
        broadcastCopy.date === sendingDate &&
        broadcastCopy.copies.some((copy) => copy.name === copyName)
    );

    if (!isBroadcastCopyAdded) {
      return { isValid: false, broadcastDomain };
    }

    return {
      isValid: true,
      broadcastDomain: {
        ...broadcastDomain,
        broadcastCopies: updatedBroadcastCopies,
      },
    };
  }
}

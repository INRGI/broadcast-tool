import { Injectable } from "@nestjs/common";
import { CheckIfPartnerCanBeSendPayload } from "./check-if-partner-can-be-send.payload";
import { cleanProductName } from "../../utils/cleanProductName";

@Injectable()
export class CheckIfPartnerCanBeSendService {
  public async execute(
    payload: CheckIfPartnerCanBeSendPayload
  ): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      partnerRules,
      productsData,
      sendingDate,
    } = payload;

    const productName = cleanProductName(copyName);
    if (!productName || productsData.length === 0) return false;

    const matchingProducts = productsData.filter(
      (product) =>
        product.productName.startsWith(`${productName} -`) ||
        product.productName.startsWith(`*${productName} -`)
    );

    const productData = matchingProducts.find((p) => p.productStatus);
    if (!productData) return false;

    if (partnerRules.blacklistedPartners.includes(productData.partner)) {
      return false;
    }

    const sendingDayRule = partnerRules.partnerAllowedSendingDays.find(
      (rule) => rule.partner === productData.partner
    );

    if (sendingDayRule) {
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const dayOfWeek = daysOfWeek[new Date(sendingDate).getDay()];
      if (!sendingDayRule.allowedSendingDays[dayOfWeek]) {
        return false;
      }
    }

    const broadcastCopiesForDate = broadcastDomain.broadcastCopies.find(
      (copy) => copy.date === sendingDate
    );

    if (!broadcastCopiesForDate) return true;

    let partnerCopyCount = 0;
    for (const c of broadcastCopiesForDate.copies) {
      const cProductName = cleanProductName(c.name);
      const match = productsData.find(
        (p) =>
          p.productName.startsWith(`${cProductName} -`) ||
          p.productName.startsWith(`*${cProductName} -`)
      );
      if (match?.partner === productData.partner) {
        partnerCopyCount++;
        if (partnerCopyCount >= partnerRules.similarPartnerDomainLimit) {
          return false;
        }
      }
    }

    return true;
  }
}

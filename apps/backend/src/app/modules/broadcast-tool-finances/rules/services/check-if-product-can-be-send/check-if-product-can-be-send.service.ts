import { Injectable } from "@nestjs/common";
import { CheckIfProductCanBeSendPayload } from "./check-if-product-can-be-send.payload";
import { cleanProductName } from "../../utils/cleanProductName";
import { normalizeDomain } from "../../utils/normalizeDomain";

@Injectable()
export class CheckIfProductCanBeSendService {
  public async execute(
    payload: CheckIfProductCanBeSendPayload
  ): Promise<boolean> {
    const {
      copyName,
      broadcast,
      productRules,
      domainRules,
      domain,
      domainsData,
      productsData,
      sendingDate,
    } = payload;

    const productName = cleanProductName(copyName);
    if (!productName || domainsData.length === 0 || productsData.length === 0)
      return false;

    const matchingProducts = productsData.filter(
      (product) =>
        product.productName.startsWith(`${productName} -`) ||
        product.productName.startsWith(`*${productName} -`)
    );

    const productData = matchingProducts.find((p) => p.productStatus);
    if (!productData) return false;

    const domainData = domainsData.find(
      (domainName) =>
        normalizeDomain(domain) === normalizeDomain(domainName.domainName) ||
        domainName.domainName.trim().endsWith(`_${domain}`) ||
        domainName.domainName.trim().endsWith(`-${domain}`)
    );

    if (!domainData || !domainData.domainStatus) return false;

    const sendingLimit = productRules.productsSendingLimitPerDay.find(
      (rule) => rule.productName === productName
    );

    if (sendingLimit) {
      let sendingCount = 0;
      for (const sheet of broadcast.sheets) {
        for (const d of sheet.domains) {
          const sendingDateObj = d.broadcastCopies.find(
            (date) => date.date === sendingDate
          );

          if (
            sendingDateObj &&
            sendingDateObj.copies.some(
              (copy) => cleanProductName(copy.name) === productName
            )
          ) {
            sendingCount++;
            if (sendingCount >= sendingLimit.limit) return false;
          }
        }
      }
    }

    const dayRule = productRules.productAllowedSendingDays.find(
      (rule) => rule.product === productName
    );

    if (dayRule) {
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
      if (!dayRule.allowedSendingDays[dayOfWeek]) return false;
    }

    const isAllowed =
      productRules.allowedMondayStatuses.includes(productData.productStatus) &&
      domainRules.domainSending.some(
        (rule) =>
          rule.parentCompany === domainData.parentCompany &&
          rule.allowedMondayStatuses.includes(productData.domainSending)
      );

    return isAllowed;
  }
}

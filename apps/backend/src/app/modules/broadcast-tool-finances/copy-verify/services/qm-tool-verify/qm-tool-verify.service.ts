import { Injectable } from "@nestjs/common";
import { QmToolVerifyPayload } from "./qm-tool-verify.payload";
import { cleanProductName } from "../../../rules/utils/cleanProductName";
import { normalizeDomain } from "../../../rules/utils/normalizeDomain";

@Injectable()
export class QmToolVerifyService {
  public async execute(
    payload: QmToolVerifyPayload
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const {
      copyName,
      domainsData,
      adminBroadcastConfig,
      productsData,
      domain,
      sendingDate,
    } = payload;

    const errors: string[] = [];
    let isValid = true;

    const productName = cleanProductName(copyName);
    if (!productName || productsData.length === 0) {
      isValid = false;
      errors.push("Invalid copy name. Can't find product");
    }

    const matchingProducts = productsData.filter(
      (product) =>
        product.productName.startsWith(`${productName} -`) ||
        product.productName.startsWith(`*${productName} -`)
    );

    const productData = matchingProducts.find((p) => p.productStatus);
    if (!productData) {
      isValid = false;
      errors.push("Invalid copy name. Product not found");
    }

    const domainData = domainsData.find(
      (domainName) =>
        normalizeDomain(domain) === normalizeDomain(domainName.domainName) ||
        domainName.domainName.trim().endsWith(`_${domain}`) ||
        domainName.domainName.trim().endsWith(`-${domain}`)
    );

    if (!domainData || !domainData.domainStatus) {
      isValid = false;
      errors.push("Invalid domain. Domain not found");
    }
    console.log(
        sendingDate
    )
    const sendingDayRule =
      adminBroadcastConfig.partnerRules.partnerAllowedSendingDays.find(
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
        isValid = false;
        errors.push(
          `Partner ${productData.partner} is not allowed to send on ${dayOfWeek}`
        );
      }
    }

    if (
      adminBroadcastConfig.partnerRules.blacklistedPartners.includes(
        productData.partner
      )
    ) {
      isValid = false;
      errors.push(
        `Partner ${productData.partner} is blacklisted for this broadcast`
      );
    }

    const forbiddenProductStatuses = ["On Hold", "Closed", "Pending"];
    const isProductStatusForbidden = forbiddenProductStatuses.includes(
      productData.productStatus
    );

    if (isProductStatusForbidden) {
      isValid = false;
      errors.push(
        `Product status ${productData.productStatus} is not allowed ${productData.productStatus}`
      );
    }

    const isAllowed = adminBroadcastConfig.domainRules.domainSending.some(
      (rule) =>
        rule.parentCompany === domainData.parentCompany &&
        rule.allowedMondayStatuses.includes(productData.domainSending)
    );

    if (!isAllowed) {
      isValid = false;
      errors.push(
        `Domain ${domainData.parentCompany} is not allowed to send ${productData.domainSending}`
      );
    }

    return {
      isValid,
      errors,
    };
  }
}

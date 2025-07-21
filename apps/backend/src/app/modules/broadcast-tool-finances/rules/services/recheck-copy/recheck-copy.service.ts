import { Injectable } from "@nestjs/common";
import { RecheckCopyPayload } from "./recheck-copy.payload";
import { cleanProductName } from "../../utils/cleanProductName";

@Injectable()
export class RecheckCopyService {
  public async execute(payload: RecheckCopyPayload): Promise<boolean> {
    const {
      copyName,
      sendingDate,
      broadcastDomain,
      adminBroadcastConfig,
      broadcastRules,
      productsData,
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

    const dayRule = broadcastRules.productRules.productAllowedSendingDays.find(
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
      broadcastRules.productRules.allowedMondayStatuses.includes(
        productData.productStatus
      ) &&
      adminBroadcastConfig.domainRules.domainSending.some((rule) =>
        rule.allowedMondayStatuses.includes(productData.domainSending)
      );

    return isAllowed;
    return;
  }
}

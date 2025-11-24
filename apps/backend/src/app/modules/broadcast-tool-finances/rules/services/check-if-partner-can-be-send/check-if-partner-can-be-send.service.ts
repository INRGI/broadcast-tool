import { Injectable } from "@nestjs/common";
import { CheckIfPartnerCanBeSendPayload } from "./check-if-partner-can-be-send.payload";
import { cleanProductName } from "../../utils/cleanProductName";
import {
  GetAllDomainsResponseDto,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";

@Injectable()
export class CheckIfPartnerCanBeSendService {
  public async execute(
    payload: CheckIfPartnerCanBeSendPayload
  ): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      partnerRules,
      productRules,
      broadcast,
      sheetName,
      productsData,
      sendingDate,
      usageRules,
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

    const tabPartnerLimit = usageRules?.partnerMaxTabLimit?.find(
      (tab) =>
        tab.sheetName === sheetName && tab.partnerName === productData.partner
    );

    if (tabPartnerLimit) {
      if (tabPartnerLimit?.limit === 0) return false;

      const tabPartnerCount = this.countPartnerCopiesOnDate(
        broadcast,
        sheetName,
        sendingDate,
        productData.partner,
        productsData
      );

      if (tabPartnerCount >= tabPartnerLimit.limit) return false;
    }

    const sendingLimit = productRules.partnersSendingLimitPerDay.find(
      (rule) => rule.partnerName === productData.partner
    );

    if (sendingLimit) {
      if (sendingLimit.limit === 0) return false;
      let sendingCount = 0;

      const sheet = broadcast.sheets.find(
        (sheet) => sheet.sheetName === sheetName
      );
      for (const d of sheet.domains) {
        const sendingDateObj = d.broadcastCopies.find(
          (date) => date.date === sendingDate
        );

        if (sendingDateObj) {
          for (const copy of sendingDateObj.copies) {
            const copyProductName = cleanProductName(copy.name);
            const matchedProduct = productsData.find(
              (p) =>
                p.productName.startsWith(`${copyProductName} -`) ||
                p.productName.startsWith(`*${copyProductName} -`)
            );

            if (matchedProduct?.partner === productData.partner) {
              sendingCount++;
              if (sendingCount >= sendingLimit.limit) return false;
            }
          }
        }
      }
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

  private countPartnerCopiesOnDate(
    broadcast: GetAllDomainsResponseDto,
    sheetName: string,
    sendingDate: string,
    partnerName: string,
    productsData: GetProductDataResponse[]
  ): number {
    let count = 0;
    const sheet = broadcast.sheets.find((s) => s.sheetName === sheetName);

    if (!sheet || !sheet?.domains) return 0;

    for (const domain of sheet.domains) {
      const sendingDateObj = domain.broadcastCopies.find(
        (date) => date.date === sendingDate
      );

      if (sendingDateObj) {
        for (const copy of sendingDateObj.copies) {
          const copyProductName = cleanProductName(copy.name);

          const matchedProduct = productsData.find(
            (p) =>
              p.productName.startsWith(`${copyProductName} -`) ||
              p.productName.startsWith(`*${copyProductName} -`)
          );

          if (matchedProduct?.partner === partnerName) {
            count++;
          }
        }
      }
    }

    return count;
  }
}

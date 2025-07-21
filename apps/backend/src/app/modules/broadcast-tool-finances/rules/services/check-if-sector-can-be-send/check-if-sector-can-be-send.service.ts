import { Injectable } from "@nestjs/common";
import { CheckIfSectorCanBeSendPayload } from "./check-if-sector-can-be-send.payload";
import { cleanProductName } from "../../utils/cleanProductName";

@Injectable()
export class CheckIfSectorCanBeSendService {
  public async execute(
    payload: CheckIfSectorCanBeSendPayload
  ): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      productRules,
      productsData,
      sendingDate,
    } = payload;

    if (!productsData.length) return false;

    const targetProductPrefix = cleanProductName(copyName);
    if (!targetProductPrefix) return false;

    const prefixMap = new Map<string, (typeof productsData)[0]>();
    for (const product of productsData) {
      const prefix = this.extractPrefixBeforeDash(product.productName);
      if (prefix && !prefixMap.has(prefix)) {
        prefixMap.set(prefix, product);
      }
    }

    const productData = prefixMap.get(targetProductPrefix);
    if (!productData || !productData.productStatus) return false;

    if (productRules.blacklistedSectors.includes(productData.sector)) {
      return false;
    }

    const broadcastCopiesForDate = broadcastDomain.broadcastCopies.find(
      (copy) => copy.date === sendingDate
    );

    if (!broadcastCopiesForDate) return true;

    let currentSectorCopyCount = 0;

    for (const copy of broadcastCopiesForDate.copies) {
      const cleanedPrefix = cleanProductName(copy.name);
      const otherProduct = prefixMap.get(cleanedPrefix);

      if (otherProduct?.sector === productData.sector) {
        currentSectorCopyCount++;
        if (currentSectorCopyCount >= productRules.similarSectorDomainLimit) {
          return false;
        }
      }
    }

    return true;
  }

  private extractPrefixBeforeDash(productName: string): string | null {
    const match = productName.match(/^\*?([a-zA-Z]+)\s*-/);
    return match ? match[1] : null;
  }
}

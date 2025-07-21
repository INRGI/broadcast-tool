import { Injectable } from "@nestjs/common";
import { CheckProductLastSendPayload } from "./check-product-last-send.payload";
import { cleanProductName } from "../../utils/cleanProductName";

@Injectable()
export class CheckProductLastSendService {
  async execute(payload: CheckProductLastSendPayload): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      possibleSendingDate,
      productMinDelayPerDays,
    } = payload;

    const targetProductName = cleanProductName(copyName);
    let latestDate: Date | null = null;

    for (const broadcastCopy of broadcastDomain.broadcastCopies) {
      const hasMatchingProduct = broadcastCopy.copies.some(
        (c) => cleanProductName(c.name) === targetProductName
      );

      if (hasMatchingProduct) {
        const currentDate = new Date(broadcastCopy.date);
        if (!latestDate || currentDate > latestDate) {
          latestDate = currentDate;
        }
      }
    }

    if (!latestDate) {
      return true;
    }

    const possibleDate = new Date(possibleSendingDate);
    const diffInDays = Math.round(
      (possibleDate.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diffInDays >= productMinDelayPerDays;
  }
}

import { Injectable } from "@nestjs/common";
import { CheckCopyLastSendPayload } from "./check-copy-last-send.payload";
import { cleanCopyName } from "../../utils/cleanCopyName";

@Injectable()
export class CheckCopyLastSendService {
  async execute(payload: CheckCopyLastSendPayload): Promise<boolean> {
    const {
      copyName,
      broadcastDomain,
      possibleSendingDate,
      copyMinDelayPerDays,
    } = payload;

    const targetName = cleanCopyName(copyName);
    let latestDate: string | null = null;

    for (const copyEntry of broadcastDomain.broadcastCopies) {
      const hasMatch = copyEntry.copies.some(
        (c) => cleanCopyName(c.name) === targetName
      );
      if (hasMatch) {
        if (!latestDate || copyEntry.date > latestDate) {
          latestDate = copyEntry.date;
        }
      }
    }

    if (!latestDate) return true;

    const lastDate = new Date(latestDate);
    const possibleDate = new Date(possibleSendingDate);
    const diffDays = Math.round(
      (possibleDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
    );

    return diffDays >= copyMinDelayPerDays;
  }
}

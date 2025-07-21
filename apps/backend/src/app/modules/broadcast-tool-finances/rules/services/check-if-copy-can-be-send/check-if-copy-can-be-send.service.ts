import { Injectable } from "@nestjs/common";
import { CheckIfCopyCanBeSendPayload } from "./check-if-copy-can-be-send.payload";
import { cleanCopyName } from "../../utils/cleanCopyName";

@Injectable()
export class CheckIfCopyCanBeSendService {
  public async execute(payload: CheckIfCopyCanBeSendPayload): Promise<boolean> {
    const {
      copyName,
      broadcast,
      usageRules,
      sheetName,
      sendingDate,
      productRules,
    } = payload;

    const cleanedName = cleanCopyName(copyName);
    if (!cleanedName) return false;

    const tabCopyLimit = usageRules.copyTabLimit?.find(
      (tab) => tab.sheetName === sheetName
    );

    if (tabCopyLimit) {
      const tabCopyCount = this.countCopiesOnDate(
        broadcast,
        sendingDate,
        cleanedName
      );
      if (tabCopyCount >= tabCopyLimit.limit) return false;
    }

    const sendingLimitRule = productRules.copySendingLimitPerDay.find(
      (rule) => cleanCopyName(rule.copyName) === cleanedName
    );

    if (sendingLimitRule) {
      const totalCopyCount = this.countCopiesOnDate(
        broadcast,
        sendingDate,
        cleanedName
      );
      if (totalCopyCount >= sendingLimitRule.limit) return false;
    }

    return true;
  }

  private countCopiesOnDate(
    broadcast: any,
    sendingDate: string,
    cleanedName: string
  ): number {
    let count = 0;
    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        const sendingDateObj = domain.broadcastCopies.find(
          (date) => date.date === sendingDate
        );
        if (
          sendingDateObj &&
          sendingDateObj.copies.some(
            (copy) => cleanCopyName(copy.name) === cleanedName
          )
        ) {
          count++;
        }
      }
    }
    return count;
  }
}

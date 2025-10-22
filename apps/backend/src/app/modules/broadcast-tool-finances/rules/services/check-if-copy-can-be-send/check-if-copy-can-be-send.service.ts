import { Injectable } from "@nestjs/common";
import { CheckIfCopyCanBeSendPayload } from "./check-if-copy-can-be-send.payload";
import { cleanCopyName } from "../../utils/cleanCopyName";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";

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
      if(!tabCopyLimit?.limit || tabCopyLimit.limit === 0) return false;
      const tabCopyCount = this.countCopiesOnDate(
        broadcast,
        sheetName,
        sendingDate,
        cleanedName,
      );
      if (tabCopyCount >= tabCopyLimit.limit) return false;
    }

    const sendingLimitRule = productRules.copySendingLimitPerDay.find(
      (rule) => cleanCopyName(rule.copyName) === cleanedName
    );

    if (sendingLimitRule) {
      if (sendingLimitRule.limit === 0) return false;
      const totalCopyCount = this.countCopiesOnDate(
        broadcast,
        sheetName,
        sendingDate,
        cleanedName
      );
      if (totalCopyCount >= sendingLimitRule.limit) return false;
    }

    return true;
  }

  private countCopiesOnDate(
    broadcast: GetAllDomainsResponseDto,
    sheetName: string,
    sendingDate: string,
    cleanedName: string
  ): number {
    let count = 0;
    const sheet = broadcast.sheets.find((sheet) => sheet.sheetName === sheetName);
    if(!sheet || !sheet?.domains) return 999;
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
    return count;
  }
}

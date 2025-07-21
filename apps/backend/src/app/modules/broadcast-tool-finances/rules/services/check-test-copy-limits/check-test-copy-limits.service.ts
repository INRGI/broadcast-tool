import { Injectable } from "@nestjs/common";
import { CheckTestCopyLimitsPayload } from "./check-test-copy-limits.payload";
import { cleanCopyName } from "../../utils/cleanCopyName";

@Injectable()
export class CheckTestCopyLimitsService {
  public async execute(payload: CheckTestCopyLimitsPayload): Promise<boolean> {
    const { copyName, broadcast, testingRules } = payload;

    const cleanTargetName = cleanCopyName(copyName);
    if (!cleanTargetName) return false;

    const testCopySendingLimit = testingRules.similarTestCopyLimitPerDay;

    let sendingCount = 0;

    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        for (const copy of domain.broadcastCopies) {
          const matches = copy.copies.some(
            (c) => cleanCopyName(c.name) === cleanTargetName
          );
          if (matches) {
            sendingCount++;
            if (sendingCount >= testCopySendingLimit) return false;
          }
        }
      }
    }

    return true;
  }
}

import { Injectable } from "@nestjs/common";
import { CheckWarmupCopyLimitsPayload } from "./check-warmup-copy-limits.payload";
import { cleanCopyName } from "../../utils/cleanCopyName";

@Injectable()
export class CheckWarmupCopyLimitsService {
  public async execute(
    payload: CheckWarmupCopyLimitsPayload
  ): Promise<boolean> {
    const { copyName, broadcast } = payload;

    const cleanTargetName = cleanCopyName(copyName);
    if (!cleanTargetName) return false;

    const warmUpSendingLimit = 1;

    let sendingCount = 0;

    for (const sheet of broadcast.sheets) {
      for (const domain of sheet.domains) {
        for (const copy of domain.broadcastCopies) {
          const matches = copy.copies.some(
            (c) => cleanCopyName(c.name) === cleanTargetName
          );
          if (matches) {
            sendingCount++;
            if (sendingCount >= warmUpSendingLimit) return false;
          }
        }
      }
    }

    return true;
  }
}

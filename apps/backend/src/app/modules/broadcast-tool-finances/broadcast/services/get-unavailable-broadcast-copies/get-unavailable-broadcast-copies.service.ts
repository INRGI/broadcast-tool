import { Injectable } from "@nestjs/common";
import { GetUnavailableBroadcastCopiesPayload } from "./get-unavailable-broadcast-copies.payload";
import { ReverifyCopyService } from "../../../copy-verify/services/reverify-copy/reverify-copy.service";
import { cleanCopyName } from "../../../rules/utils/cleanCopyName";

@Injectable()
export class GetUnavailableBroadcastCopiesService {
  constructor(private readonly reverifyCopyService: ReverifyCopyService) {}
  public async execute(
    payload: GetUnavailableBroadcastCopiesPayload
  ): Promise<string[]> {
    try {
      const {
        dateRange,
        broadcast,
        broadcastRules,
        adminBroadcastConfig,
        productsData,
      } = payload;

      const unavailableCopies = new Set<string>();
      const checkedCopies = new Set<string>();

      for (const date of dateRange) {
        const allDomains = broadcast.sheets.flatMap(
          (sheet) => sheet.domains ?? []
        );

        for (const domain of allDomains) {
          const copyNames = domain.broadcastCopies
            .find((c) => c.date === date)
            ?.copies.map((c) => c.name) ?? [];

          for (const copyName of copyNames) {
            if(!copyName) continue;
            const cleanedCopyName = cleanCopyName(copyName);
            if (checkedCopies.has(cleanedCopyName)) continue;
            if (copyName.includes("_SA") || copyName.startsWith("(")) continue;
            if (unavailableCopies.has(cleanedCopyName)) continue;
            const result = await this.reverifyCopyService.execute({
              broadcastDomain: domain,
              adminBroadcastConfig,
              copyName,
              broadcastRules,
              sendingDate: date,
              productsData,
            });

            if (result) {
              unavailableCopies.add(copyName);
            }
            checkedCopies.add(cleanedCopyName);
          }
        }
      }

      return Array.from(unavailableCopies);
    } catch (error) {
      return [];
    }
  }
}

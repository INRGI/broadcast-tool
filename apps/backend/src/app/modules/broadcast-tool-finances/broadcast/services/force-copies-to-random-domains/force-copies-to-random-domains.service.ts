import { Injectable } from "@nestjs/common";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";
import { ForceCopiesToRandomDomainsPayload } from "./force-copies-to-random-domains.payload";
import { VerifyCopyWithoutQueueService } from "../../../copy-verify/services/verify-copy-without-queue/verify-copy-without-queue.service";
import { getDateRange } from "../../utils/getDateRange";

@Injectable()
export class ForceCopiesToRandomDomainsService {
  constructor(
    private readonly copiesWithoutQueueValidator: VerifyCopyWithoutQueueService
  ) {}

  public async execute(
    payload: ForceCopiesToRandomDomainsPayload
  ): Promise<GetAllDomainsResponseDto> {
    const {
      broadcastRules,
      adminBroadcastConfig,
      productsData,
      copiesToForce,
      domainsData,
      broadcast,
      priorityCopiesData,
      fromDate,
      toDate,
    } = payload;

    const MIN_COPIES_DOMAIN_SEND = 2;
    const dateRange = getDateRange(fromDate, toDate);

    for (const date of dateRange) {
      let sentCount = 0;

      for (const { copyName, limit } of copiesToForce) {
        const allDomains = broadcast.sheets.flatMap((sheet) => sheet.domains);
        const shuffledDomains = this.shuffleArray(allDomains);

        for (const domain of shuffledDomains) {
          if (
            !broadcastRules.copyAssignmentStrategyRules.domainStrategies.find(
              (s) => s.domain === domain.domain
            )?.copiesTypes ||
            broadcastRules.copyAssignmentStrategyRules.domainStrategies.find(
              (s) => s.domain === domain.domain
            )?.copiesTypes.length < MIN_COPIES_DOMAIN_SEND
          )
            continue;

          if (sentCount >= limit) break;

          if (
            domain.broadcastCopies.find(
              (d) =>
                d.date === date &&
                d.copies.find((c) =>
                  copiesToForce.some((f) => f.copyName === c.name)
                )
            )
          )
            continue;

          const dailyEntry = domain.broadcastCopies.find(
            (d) => d.date === date
          );
          if (!dailyEntry) continue;

          const alreadyExists = dailyEntry.copies.some(
            (c) => c.name === copyName
          );
          if (alreadyExists) continue;

          const sheet = broadcast.sheets.find((sheet) =>
            sheet.domains.some((d) => d.domain === domain.domain)
          );
          if (!sheet) continue;

          const result = await this.copiesWithoutQueueValidator.execute({
            broadcast,
            sheetName: sheet.sheetName,
            broadcastDomain: domain,
            adminBroadcastConfig,
            copyName,
            broadcastRules,
            sendingDate: date,
            productsData,
            domainsData,
            priorityCopiesData,
          });

          if (result.isValid) {
            const updatedDomain = result.broadcastDomain;

            const domainIndex = sheet.domains.findIndex(
              (d) => d.domain === domain.domain
            );
            if (domainIndex !== -1) {
              sheet.domains[domainIndex] = updatedDomain;
            }

            sentCount++;
          }
        }
      }
    }

    return broadcast;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

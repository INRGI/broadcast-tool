import { Injectable } from "@nestjs/common";
import { VerifyCopyWithoutQueueService } from "../../../copy-verify/services/verify-copy-without-queue/verify-copy-without-queue.service";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";
import { getDateRange } from "../../utils/getDateRange";
import { cleanProductName } from "../../../rules/utils/cleanProductName";
import { ForcePartnersToRandomDomainsPayload } from "./force-partners-to-random-domains.payload";
import { GetConvertableCopiesService } from "../get-convertable-copies/get-convertable-copies.service";
import { cleanCopyName } from "../../../rules/utils/cleanCopyName";
import { GetClickableCopiesWithSendsService } from "../get-clickable-copies-by-sends/get-clickable-copies-by-sends.service";

@Injectable()
export class ForcePartnersToRandomDomainsService {
  constructor(
    private readonly copiesWithoutQueueValidator: VerifyCopyWithoutQueueService,
    private readonly getConvertableCopiesService: GetConvertableCopiesService,
    private readonly getClickableCopiesWithSendsService: GetClickableCopiesWithSendsService
  ) {}

  public async execute(
    payload: ForcePartnersToRandomDomainsPayload
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
      convertibleCopies,
    } = payload;

    const MIN_COPIES_DOMAIN_SEND = 2;
    const dateRange = getDateRange(fromDate, toDate);

    for (const date of dateRange) {
      let sentCount = 0;
      for (const { partnerName, limit } of copiesToForce) {
        sentCount = 0;

        const matchingProducts = productsData.filter(
          (product) => product.partner === partnerName
        );

        let convertibleCopiesForPartner = convertibleCopies.filter((copy) =>
          matchingProducts.some(
            (product) =>
              product.productName.startsWith(`${cleanProductName(copy)} -`) ||
              product.productName.startsWith(`*${cleanProductName(copy)} -`)
          )
        );

        if (
          convertibleCopiesForPartner.length === 0 ||
          convertibleCopiesForPartner.length < limit * 2
        ) {
          const thirtyDaysConversions =
            await this.getConvertableCopiesService.execute({
              daysBeforeInterval: 30,
              broadcastName: broadcastRules.useOnlyTeamAnalytics
                ? broadcastRules.name
                : undefined,
            });
          convertibleCopiesForPartner = [
            ...convertibleCopiesForPartner,
            ...thirtyDaysConversions.filter((copy) => {
              if (
                convertibleCopiesForPartner.some(
                  (c) => cleanCopyName(c) === cleanCopyName(copy)
                )
              )
                return false;
              return matchingProducts.some(
                (product) =>
                  product.productName.startsWith(
                    `${cleanProductName(copy)} -`
                  ) ||
                  product.productName.startsWith(`*${cleanProductName(copy)} -`)
              );
            }),
          ];

          if (
            convertibleCopiesForPartner.length === 0 ||
            convertibleCopiesForPartner.length < limit * 2
          ) {
            const thirtyDaysClicks =
              await this.getClickableCopiesWithSendsService.execute({
                daysBeforeInterval: 30,
              });
            convertibleCopiesForPartner = [
              ...convertibleCopiesForPartner,
              ...thirtyDaysClicks.filter((copy) => {
                if (
                  convertibleCopiesForPartner.some(
                    (c) => cleanCopyName(c) === cleanCopyName(copy)
                  )
                )
                  return false;
                return matchingProducts.some(
                  (product) =>
                    product.productName.startsWith(
                      `${cleanProductName(copy)} -`
                    ) ||
                    product.productName.startsWith(
                      `*${cleanProductName(copy)} -`
                    )
                );
              }),
            ];
          }
        }

        let copyIndex = 0;
        while (sentCount < limit) {
          let addedCopyThisRound = false;

          const allDomains = broadcast.sheets.flatMap((sheet) => sheet.domains);
          const shuffledDomains = this.shuffleArray(allDomains);

          for (const domain of shuffledDomains) {
            const strategy =
              broadcastRules.copyAssignmentStrategyRules.domainStrategies.find(
                (s) => s.domain === domain.domain
              );

            if (
              !strategy?.copiesTypes ||
              strategy.copiesTypes.length < MIN_COPIES_DOMAIN_SEND
            ) {
              continue;
            }

            const alreadyHasProduct = domain.broadcastCopies.some(
              (d) =>
                d.date === date &&
                d.copies.some((c) =>
                  convertibleCopiesForPartner.includes(c.name)
                )
            );
            if (alreadyHasProduct) continue;

            const dailyEntry = domain.broadcastCopies.find(
              (d) => d.date === date
            );
            if (!dailyEntry) continue;

            const copyName = convertibleCopiesForPartner[copyIndex];
            if (!copyName) break;

            const alreadyExists = dailyEntry.copies.some(
              (c) => c.name === copyName
            );
            if (alreadyExists) {
              copyIndex = (copyIndex + 1) % convertibleCopiesForPartner.length;
              continue;
            }

            const sheet = broadcast.sheets.find((sheet) =>
              sheet.domains.some((d) => d.domain === domain.domain)
            );
            if (!sheet) {
              copyIndex = (copyIndex + 1) % convertibleCopiesForPartner.length;
              continue;
            }

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
              addedCopyThisRound = true;

              copyIndex = (copyIndex + 1) % convertibleCopiesForPartner.length;
              break;
            } else {
              copyIndex = (copyIndex + 1) % convertibleCopiesForPartner.length;
            }

            if (sentCount >= limit) break;
          }

          if (!addedCopyThisRound) break;
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

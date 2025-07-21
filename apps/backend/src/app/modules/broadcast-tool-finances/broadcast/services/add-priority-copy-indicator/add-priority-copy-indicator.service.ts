import { Injectable } from "@nestjs/common";
import { AddPriorityCopyIndicatorPayload } from "./add-priority-copy-indicator.payload";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";

@Injectable()
export class AddPriorityCopyIndicatorService {
  public async execute(
    payload: AddPriorityCopyIndicatorPayload
  ): Promise<GetAllDomainsResponseDto> {
    const { broadcast, dateRange } = payload;

    const modifiedBroadcast = broadcast.sheets.map((sheet) => {
      return {
        ...sheet,
        domains: sheet.domains.map((domain) => {
          return {
            ...domain,
            broadcastCopies: domain.broadcastCopies.map((broadcastCopies) => {
              if (
                broadcastCopies.date < dateRange[0] ||
                broadcastCopies.date > dateRange[dateRange.length - 1]
              ) {
                return broadcastCopies;
              }
              return {
                ...broadcastCopies,
                copies: broadcastCopies.copies.map((c) => {
                  return {
                    ...c,
                    name: c.isPriority ? `${c.name}(P)` : c.name,
                  };
                }),
                possibleReplacementCopies:
                  broadcastCopies.possibleReplacementCopies.map((c) => {
                    return {
                      ...c,
                      name: c.isPriority ? `${c.name}(P)` : c.name,
                    };
                  }),
              };
            }),
          };
        }),
      };
    });

    return { ...broadcast, sheets: modifiedBroadcast };
  }
}

import { Injectable } from "@nestjs/common";
import { GetAllDomainsResponseDto } from "@epc-services/interface-adapters";
import { AddCustomLinkIndicatorPayload } from "./add-custom-link-indicator.payload";
import { cleanProductName } from "../../../rules/utils/cleanProductName";

@Injectable()
export class AddCustomLinkIndicatorService {
  public async execute(
    payload: AddCustomLinkIndicatorPayload
  ): Promise<GetAllDomainsResponseDto> {
    const { broadcast, dateRange, productsData } = payload;

    const handleCheckIfProductHaveCustomLink = (productName: string) => {
      const productData = productsData.find(
        (product) =>
          product.productName.startsWith(`${productName} -`) ||
          product.productName.startsWith(`*${productName} -`)
      );
      const checkResult =  productData?.partner.startsWith(`L `) || productData?.partner.startsWith(`*V L `);

      return checkResult;
    };
    

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
                    name: handleCheckIfProductHaveCustomLink(cleanProductName(c.name)) ? `${c.name}(L)` : c.name,
                  };
                }),
                possibleReplacementCopies:
                  broadcastCopies.possibleReplacementCopies.map((c) => {
                    return {
                      ...c,
                      name: handleCheckIfProductHaveCustomLink(cleanProductName(c.name)) ? `${c.name}(L)` : c.name,
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

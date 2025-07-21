import { Injectable } from "@nestjs/common";
import { CalculateBroadcastSendingPayload } from "./calculate-broadcast-sending.payload";
import {
  CalculatedBroadcastSends,
  DayBroadcastSends,
  PartnerSends,
} from "@epc-services/interface-adapters";
import { cleanProductName } from "../../../rules/utils/cleanProductName";
import { cleanCopyName } from "../../../rules/utils/cleanCopyName";

@Injectable()
export class CalculateBroadcastSendingService {
  public async execute(
    payload: CalculateBroadcastSendingPayload
  ): Promise<CalculatedBroadcastSends> {
    const { dateRange, broadcast, productsData, broadcastName } = payload;
    const result: DayBroadcastSends[] = [];

    for (const date of dateRange) {
      const partnersMap = new Map<string, PartnerSends>();

      for (const sheet of broadcast?.sheets ?? []) {
        for (const domain of sheet?.domains ?? []) {
          const day = domain.broadcastCopies.find((d) => d.date === date);
          if (!day) continue;

          for (const copy of day.copies) {
            const productName = cleanProductName(copy.name);
            const copyName = cleanCopyName(copy.name);
            const productData = productsData.find(
              (p) =>
                p.productName.startsWith(`${productName} -`) ||
                p.productName.startsWith(`*${productName} -`)
            );

            if (!productData || !productData.partner) continue;

            const partnerKey = productData.partner;
            const productKey = productName;
            const copyKey = copyName;

            if (!partnersMap.has(partnerKey)) {
              partnersMap.set(partnerKey, {
                partner: partnerKey,
                sends: 0,
                products: [],
              });
            }
            const partner = partnersMap.get(partnerKey)!;
            partner.sends += 1;

            let product = partner.products.find(
              (p) => p.product === productKey
            );
            if (!product) {
              product = {
                product: productKey,
                sends: 0,
                copies: [],
              };
              partner.products.push(product);
            }
            product.sends += 1;

            let copyEntry = product.copies.find((c) => c.copy === copyKey);
            if (!copyEntry) {
              copyEntry = {
                copy: copyKey,
                sends: 0,
              };
              product.copies.push(copyEntry);
            }
            copyEntry.sends += 1;
          }
        }
      }

      result.push({
        date,
        partners: Array.from(partnersMap.values()),
      });
    }

    return { result, name: broadcastName };
  }
}

import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger } from "@nestjs/common";
import { GetProductDataPayload } from "./get-product-data.payload";
import { GetProductDataResponse } from "@epc-services/interface-adapters";

@Injectable()
export class GetProductDataService {
  private readonly logger: Logger = new Logger(GetProductDataService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort
  ) {}

  public async getProductData(
    payload: GetProductDataPayload
  ): Promise<GetProductDataResponse> {
    const { product } = payload;

    try {
      const mondayData = await this.mondayApiService.getProductData(
        product,
        803747785
      );

      if (!mondayData.length) {
        return {
          productName: "",
          productStatus: "",
          broadcastCopies: "",
          domainSending: "",
        };
      }

      const productStatus = mondayData[0].column_values.find(
        (c) => c.column.title === "Status"
      )?.text;
      const broadcastCopies = mondayData[0].column_values.find(
        (c) => c.column.title === "(B)Broadcast Copies"
      )?.text;
      const domainSending = mondayData[0].column_values.find(
        (c) => c.column.title === "Domain Sending"
      )?.text;

      return {
        productName: product,
        productStatus,
        broadcastCopies,
        domainSending,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }
}

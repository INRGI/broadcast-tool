import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger } from "@nestjs/common";
import { GetDomainDataResponse } from "@epc-services/interface-adapters";
import { GetDomainDataPayload } from "./get-domain-data.payload";

@Injectable()
export class GetDomainDataService {
  private readonly logger: Logger = new Logger(GetDomainDataService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort
  ) {}

  public async getDomainData(
    payload: GetDomainDataPayload
  ): Promise<GetDomainDataResponse> {
    const { domain } = payload;

    try {
      const mondayData = await this.mondayApiService.getDomainData(
        domain,
        472153030
      );

      if (!mondayData.length) {
        return {
          domainName: "",
          domainStatus: "",
          parentCompany: "",
          domainEsp: "",
        };
      }

      const domainStatus = mondayData[0].column_values.find(
        (c) => c.column.title === "Status"
      )?.text;
      const parentCompany = mondayData[0].column_values.find(
        (c) => c.column.title === "Parent Company"
      )?.text;
      const domainEsp = mondayData[0].column_values.find(
        (c) => c.column.title === "ESP"
      )?.text;

      return {
        domainName: domain,
        domainStatus,
        parentCompany,
        domainEsp,
      };
    } catch (error) {
      this.logger.error(error);
    }
  }
}

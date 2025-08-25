import {
  InjectMondayApiService,
  MondayApiServicePort,
} from "@epc-services/monday-api";
import { Injectable, Logger } from "@nestjs/common";
import { GetDomainDataResponse } from "@epc-services/interface-adapters";
import { GetDomainDataPayload } from "./get-domain-data.payload";
import { MondayConfigService } from "@epc-services/core";

@Injectable()
export class GetDomainDataService {
  private readonly logger: Logger = new Logger(GetDomainDataService.name, {
    timestamp: true,
  });

  constructor(
    @InjectMondayApiService()
    private readonly mondayApiService: MondayApiServicePort,
    private readonly mondayApiConfig: MondayConfigService
  ) {}

  public async getDomainData(
    payload: GetDomainDataPayload
  ): Promise<GetDomainDataResponse> {
    const { domain } = payload;
    const boardId = Number(this.mondayApiConfig.domainsBoardId);

    try {
      const mondayData = await this.mondayApiService.getDomainData(
        domain,
        boardId
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

/* eslint-disable no-useless-escape */
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import {
  BroadcastDomainsSheetResponseDto,
  DomainStatusResponseDto,
  GetBroadcastDomainsListResponseDto,
} from "@epc-services/interface-adapters";
import { Injectable } from "@nestjs/common";
import { GetBroadcastDomainsListPayload } from "./get-broadcast-domains-list.payload";
import { GetAllDomainsDataService } from "../../../monday/services/get-all-domains-data/get-all-domains-data.service";
import { normalizeDomain } from "../../../rules/utils/normalizeDomain";
import { GetAdminBroadcastConfigByNicheQueryService } from "../../../rules/queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";

@Injectable()
export class GetBroadcastDomainsListService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort,
    private readonly getAllMondayDomainsDataService: GetAllDomainsDataService,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService
  ) {}

  public async execute(
    payload: GetBroadcastDomainsListPayload
  ): Promise<GetBroadcastDomainsListResponseDto> {
    const { spreadsheetId } = payload;

    try {
      const broadcastTableId = spreadsheetId;
      const response: BroadcastDomainsSheetResponseDto[] = [];

      const table = await this.spreadsheetService.getSpreadsheetWithData(
        broadcastTableId
      );

      const adminConfig =
        await this.getAdminBroadcastConfigByNicheQueryService.execute({
          niche: "finance",
        });

      const sheets = table?.sheets || [];

      const domainsData = await this.getAllMondayDomainsDataService.execute();

      for (const sheet of sheets) {
        const tabName = sheet.properties?.title || "";
        if (adminConfig.ignoringRules.broadcastsTabs.includes(tabName))
          continue;

        const rows = sheet.data?.[0]?.rowData || [];
        if (!rows.length) continue;

        const domainsRowValues = rows[0]?.values;
        if (!domainsRowValues) continue;

        const domains: DomainStatusResponseDto[] = [];

        for (let colIdx = 1; colIdx < domainsRowValues.length; colIdx++) {
          const domain = domainsRowValues[colIdx]?.formattedValue;
          if (domain) {
            const normalized = normalizeDomain(domain);
            const domainData = domainsData.find(({ domainName }) => {
              const normalizedName = normalizeDomain(domainName);
              return (
                normalizedName === normalized ||
                normalizedName.endsWith(`_${normalized}`) ||
                normalizedName.endsWith(`-${normalized}`)
              );
            });

            domains.push({
              domainName: domain,
              status: domainData?.domainStatus || "Unknown",
            });
          }
        }

        if (
          domains.length > 0 &&
          domains.every((domain) => domain.domainName.includes("."))
        ) {
          response.push({
            sheetName: tabName,
            domains,
          });
        }
      }

      return {
        sheets: response,
      };
    } catch  {
      return { sheets: [] };
    }
  }
}

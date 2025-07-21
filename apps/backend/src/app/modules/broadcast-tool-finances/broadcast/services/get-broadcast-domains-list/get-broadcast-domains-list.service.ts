/* eslint-disable no-useless-escape */
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import {
  BroadcastDomainsSheetResponseDto,
  GetBroadcastDomainsListResponseDto,
} from "@epc-services/interface-adapters";
import { Injectable } from "@nestjs/common";
import { GetBroadcastDomainsListPayload } from "./get-broadcast-domains-list.payload";

@Injectable()
export class GetBroadcastDomainsListService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort
  ) {}

  private readonly IGNORED_TABS = new Set(["Blacklist", "Rules"]);

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

      const sheets = table?.sheets || [];

      for (const sheet of sheets) {
        const tabName = sheet.properties?.title || "";
        if (this.IGNORED_TABS.has(tabName)) continue;

        const rows = sheet.data?.[0]?.rowData || [];
        if (!rows.length) continue;

        const domainsRowValues = rows[0]?.values;
        if (!domainsRowValues) continue;

        const domains: string[] = [];

        for (let colIdx = 1; colIdx < domainsRowValues.length; colIdx++) {
          const domain = domainsRowValues[colIdx]?.formattedValue;
          if (domain) {
            domains.push(domain);
          }
        }

        if (
          domains.length > 0 &&
          domains.every((domain) => domain.includes("."))
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
    } catch (error) {
      console.error(error);
      return { sheets: [] };
    }
  }
}

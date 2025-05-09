/* eslint-disable no-useless-escape */
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import { Injectable } from "@nestjs/common";
import { CheckForPriorityPayload } from "./check-for-priority.payload";

@Injectable()
export class CheckForPriorityService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort
  ) {}

  private readonly IGNORED_TABS = new Set(["log", "FIT(Agora) Domains"]);

  public async checkForPriority(
    payload: CheckForPriorityPayload
  ): Promise<boolean> {
    const { product } = payload;
    const spreadsheetId = "1e40khWM1dKTje_vZi4K4fL-RA8-D6jhp2wmZSXurQH0";

    try {
      const spreadsheet = await this.spreadsheetService.getSpreadsheetWithData(
        spreadsheetId
      );
      const sheets = spreadsheet?.sheets || [];

      for (const sheet of sheets) {
        const tabName = sheet.properties?.title || "";
        if (this.IGNORED_TABS.has(tabName)) continue;

        const rows = sheet.data?.[0]?.rowData || [];
        if (!rows.length) continue;

        let headerRow: string[] = [];
        let headerRowIdx = -1;

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          const row = rows[rowIndex];
          const cells = row.values || [];
          const potentialHeaders = cells.map(
            (c) => c.formattedValue?.toLowerCase() || ""
          );

          if (potentialHeaders.includes("product")) {
            headerRow = potentialHeaders;
            headerRowIdx = rowIndex;
            break;
          }
        }

        if (headerRowIdx === -1) continue;

        const productColIdx = headerRow.findIndex((h) => h === "product");

        for (
          let rowIndex = headerRowIdx + 1;
          rowIndex < rows.length;
          rowIndex++
        ) {
          const row = rows[rowIndex];
          const cells = row.values || [];

          const productCell = cells[productColIdx]?.formattedValue || "";
          const productCode = productCell.split(/[\s\/\\]+/);

          if (!productCode.includes(product)) continue;

          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }
}

/* eslint-disable no-useless-escape */
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class GetAllPriorityProductsService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  private readonly IGNORED_TABS = new Set(["log", "FIT(Agora) Domains"]);

  public async execute(): Promise<string[]> {
    const spreadsheetId = "1e40khWM1dKTje_vZi4K4fL-RA8-D6jhp2wmZSXurQH0";

    const cacheKey = `allPriorityProducts:${spreadsheetId}`;

    const cached = await this.cacheManager.get<string[]>(cacheKey);

    if (cached) return cached;

    try {
      const spreadsheet = await this.spreadsheetService.getSpreadsheetWithData(
        spreadsheetId
      );
      const sheets = spreadsheet?.sheets || [];

      const products: string[] = [];

      for (const sheet of sheets) {
        const tabName = sheet.properties?.title || "";
        if (
          this.IGNORED_TABS.has(tabName) ||
          tabName.trim().toLocaleLowerCase() !==
            "other pp".trim().toLocaleLowerCase()
        )
          continue;

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

          products.push(...productCode);
        }
      }

      const filteredProducts = products.filter(
        (product) => product.trim() !== ""
      );

      const uniqueProducts = [...new Set(filteredProducts)];

      await this.cacheManager.set(cacheKey, uniqueProducts, 3600000);
      return uniqueProducts;
    } catch (error) {
      return [];
    }
  }
}

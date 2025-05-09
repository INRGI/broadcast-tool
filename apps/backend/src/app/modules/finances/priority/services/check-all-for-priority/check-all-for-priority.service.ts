/* eslint-disable no-useless-escape */
import {
    GSpreadsheetApiServicePort,
    InjectGSpreadsheetApiService,
  } from "@epc-services/gspreadsheet-api";
  import { Injectable } from "@nestjs/common";
  import { CheckAllForPriorityPayload } from "./check-all-for-priority.payload";
  import { CheckAllForPriorityResponse } from "@epc-services/interface-adapters";
  
  @Injectable()
  export class CheckAllForPriorityService {
    constructor(
      @InjectGSpreadsheetApiService()
      private readonly spreadsheetService: GSpreadsheetApiServicePort
    ) {}
  
    private readonly IGNORED_TABS = new Set(["log", "FIT(Agora) Domains"]);
  
    public async checkAllForPriority(
      payload: CheckAllForPriorityPayload
    ): Promise<CheckAllForPriorityResponse> {
      const { products } = payload;
      const spreadsheetId = "1e40khWM1dKTje_vZi4K4fL-RA8-D6jhp2wmZSXurQH0";
      const response: CheckAllForPriorityResponse = { products: [] };
  
      try {
        const spreadsheet = await this.spreadsheetService.getSpreadsheetWithData(
          spreadsheetId
        );
        const sheets = spreadsheet?.sheets || [];
  
        const productCodes = new Set<string>();
  
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
  
            productCode.forEach((code) => productCodes.add(code));
          }
        }
  
        response.products = products.map((product) => ({
          product,
          isPriority: productCodes.has(product.match(/^[a-zA-Z]+/)[0]),
        }));
  
        return response;
      } catch (error) {
        console.error(error);
        return {
          products: products.map((product) => ({ product, isPriority: false })),
        };
      }
    }
  }
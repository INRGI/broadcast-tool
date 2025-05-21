/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import {
  BroadcastCopy,
  BroadcastDomain,
  GetAllDomainsResponse,
} from "@epc-services/interface-adapters";
import { Injectable } from "@nestjs/common";
import { GetAllDomainsPayload } from "./get-all-domains.payload";
import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from "@epc-services/gdrive-api";

@Injectable()
export class GetAllDomainsService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort,
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort
  ) {}

  private parseDateToNumber(date: string): number {
    const trimmed = date.trim();
    const [month, day] = trimmed.split(/[\/.]/).map(Number);
    if (isNaN(month) || isNaN(day)) return 99991231;
    return month * 100 + day;
  }

  private readonly IGNORED_TABS = new Set([]);

  public async getDomains(
    payload: GetAllDomainsPayload
  ): Promise<GetAllDomainsResponse> {
    const { broadcastTeam } = payload;
    try {
      const broadcastTableSearchResult =
        await this.gdriveApiService.searchFileWithQuery(
          `name contains 'Broadcast ${broadcastTeam} team' and mimeType = 'application/vnd.google-apps.spreadsheet'`,
          10
        );

      if (!broadcastTableSearchResult.files.length) {
        throw new Error(`Broadcast table not found for team ${broadcastTeam}`);
      }

      const broadcastTableId = broadcastTableSearchResult.files[0].id;
      const response: GetAllDomainsResponse = { sheets: [] };

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
        
        const domains = domainsRowValues.map((cell) => cell.formattedValue || "");
        
        const espRowValues = rows[3]?.values || [];
        const esps = espRowValues.map((cell) => cell.formattedValue || "");
        

        const domainsInSheet: BroadcastDomain[] = [];

        for (let colIdx = 1; colIdx < domains.length; colIdx++) {
          const domain = domains[colIdx];
          const esp = esps[colIdx] || "";

          const broadcastCopies: {
            date: string;
            copies: BroadcastCopy[];
            isModdified: boolean;
          }[] = [];

          for (let rowIdx = 4; rowIdx < rows.length; rowIdx++) {
            const row = rows[rowIdx];
            const cells = row.values || [];

            const dateCell = cells[0];
            if (!dateCell?.formattedValue) continue;

            const contentCell =
              colIdx < cells.length ? cells[colIdx] : { formattedValue: "" };
            if (!contentCell.formattedValue) continue;

            const date = dateCell.formattedValue;
            const rawText = contentCell.formattedValue || "";
            const runs = contentCell.textFormatRuns || [];

            const boldRanges: [number, number][] = runs
              .filter((run) => run.format?.bold)
              .map((run, i, arr) => {
                const start = run.startIndex ?? 0;
                const end = arr[i + 1]?.startIndex ?? rawText.length;
                return [start, end];
              });

            const cleanText = this.cleanCopyValue(rawText);
            const words = cleanText
              .split(" ")
              .filter((w) => w.trim() && w !== "-");

            let currentIndex = 0;
            const copies = words.map((word) => {
              const start = rawText.indexOf(word, currentIndex);
              if (start === -1) {
                return { name: word, isPriority: false };
              }
              currentIndex = start + word.length;
            
              const isBold = boldRanges.some(([from, to]) => start >= from && start < to);
              return { name: word, isPriority: isBold };
            });
            

            broadcastCopies.push({ date, copies, isModdified: false });
          }

          const sortedBroadcastCopies = broadcastCopies.sort(
            (a, b) =>
              this.parseDateToNumber(a.date) - this.parseDateToNumber(b.date)
          );

          domainsInSheet.push({
            domain,
            esp,
            broadcastCopies: sortedBroadcastCopies,
          });
        }

        response.sheets.push({
          sheetName: tabName,
          domains: domainsInSheet,
        });
      }

      return response;
    } catch (error) {
      console.error("getDomains error:", error);
      return { sheets: [] };
    }
  }

  private cleanCopyValue(value: string): string {
    return value
      .replace(/[\n\r\t]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}

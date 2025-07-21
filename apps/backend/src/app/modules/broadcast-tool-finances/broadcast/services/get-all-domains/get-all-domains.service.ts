/* eslint-disable no-useless-escape */
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";
import {
  BroadcastDomain,
  BroadcastSendingDay,
  CopyType,
  GetAllDomainsResponseDto,
} from "@epc-services/interface-adapters";
import { Injectable } from "@nestjs/common";
import { GetAllDomainsPayload } from "./get-all-domains.payload";

@Injectable()
export class GetAllDomainsService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort
  ) {}

  private parseDateToNumber(date: string): number {
    const trimmed = date.trim();
    const [month, day] = trimmed.split(/[\/.]/).map(Number);
    if (isNaN(month) || isNaN(day)) return 99991231;
    return month * 100 + day;
  }

  private readonly IGNORED_TABS = new Set(["Blacklist", "Rules"]);

  public async execute(
    payload: GetAllDomainsPayload
  ): Promise<GetAllDomainsResponseDto> {
    const { broadcastId, usageRules } = payload;

    const maxSelectedDays =
      usageRules.copyMinDelayPerDays > usageRules.productMinDelayPerDays
        ? usageRules.copyMinDelayPerDays
        : usageRules.productMinDelayPerDays;
    const dateFromFilter = new Date();
    dateFromFilter.setDate(dateFromFilter.getDate() - maxSelectedDays);

    try {
      const broadcastTableId = broadcastId;
      const response: GetAllDomainsResponseDto = { sheets: [] };

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

        const domains = domainsRowValues.map(
          (cell) => cell.formattedValue || ""
        );

        const espRowValues = rows[3]?.values || [];
        const esps = espRowValues.map((cell) => cell.formattedValue || "");

        const domainsInSheet: BroadcastDomain[] = [];

        for (let colIdx = 1; colIdx < domains.length; colIdx++) {
          const domain = domains[colIdx];
          const esp = esps[colIdx] || "";

          const broadcastCopies: BroadcastSendingDay[] = [];

          for (let rowIdx = 4; rowIdx < rows.length; rowIdx++) {
            const row = rows[rowIdx];
            const cells = row.values || [];

            const dateCell = cells[0];
            if (!dateCell?.formattedValue) continue;

            const contentCell =
              colIdx < cells.length ? cells[colIdx] : { formattedValue: "" };
            if (!contentCell.formattedValue) continue;

            const rawDate = dateCell.formattedValue;
            const date = this.formatDateToISO(rawDate);
            if (!date) continue;

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
                return { name: word, isPriority: false, copyType: CopyType.Unknown };
              }
              currentIndex = start + word.length;

              const isBold = boldRanges.some(
                ([from, to]) => start >= from && start < to
              );
              return { name: word, isPriority: isBold, copyType: CopyType.Unknown };
            });

            broadcastCopies.push({
              date,
              copies,
              isModdified: false,
              possibleReplacementCopies: [],
            });
          }

          const sortedBroadcastCopies = broadcastCopies.sort(
            (a, b) =>
              this.parseDateToNumber(a.date) - this.parseDateToNumber(b.date)
          );

          const filteredBroadcastCopies = sortedBroadcastCopies.filter(
            (copy) => {
              const copyDate = new Date(copy.date);
              const dateFromFilter = new Date();
              dateFromFilter.setDate(
                dateFromFilter.getDate() - maxSelectedDays
              );
              return copyDate >= dateFromFilter;
            }
          );

          domainsInSheet.push({
            domain,
            esp,
            broadcastCopies: filteredBroadcastCopies,
          });
        }

        response.sheets.push({
          sheetName: tabName,
          domains: domainsInSheet,
        });
      }

      return response;
    } catch (error) {
      return { sheets: [] };
    }
  }

  private cleanCopyValue(value: string): string {
    return value
      .replace(/[\n\r\t]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  private formatDateToISO(
    dateStr: string,
    defaultYear = new Date().getFullYear()
  ): string {
    const [month, day] = dateStr.split(/[\/.]/).map(Number);
    if (!month || !day) return "";
    const date = new Date(Date.UTC(defaultYear, month - 1, day));
    return date.toISOString().split("T")[0];
  }
}

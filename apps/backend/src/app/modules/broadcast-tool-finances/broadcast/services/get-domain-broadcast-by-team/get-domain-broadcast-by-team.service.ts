/* eslint-disable no-useless-escape */
import {
  GDriveApiServicePort,
  InjectGDriveApiService,
} from "@epc-services/gdrive-api";
import { Injectable } from "@nestjs/common";
import { GetAdminBroadcastConfigByNicheQueryService } from "../../../rules/queries/get-admin-broadcast-config-by-niche/get-admin-broadcast-config-by-niche.query-service";
import {
  BroadcastDomainRequestDto,
  BroadcastSendingDay,
  BroadcastSheet,
  CopyType,
} from "@epc-services/interface-adapters";
import { GetDomainBroadcastByTeamPayload } from "./get-domain-broadcast-by-team.payload";
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";

@Injectable()
export class GetDomainBroadcastByTeamService {
  constructor(
    @InjectGDriveApiService()
    private readonly gdriveApiService: GDriveApiServicePort,
    private readonly getAdminBroadcastConfigByNicheQueryService: GetAdminBroadcastConfigByNicheQueryService,
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort
  ) {}

  public async execute(
    payload: GetDomainBroadcastByTeamPayload
  ): Promise<BroadcastDomainRequestDto> {
    const { team, domain } = payload;

    const searchResult = await this.gdriveApiService.getFolderContent(
      "13Bsls3omgREiI0DyQbCauMdtHl_h0KSP",
      30
    );

    const adminConfig =
      await this.getAdminBroadcastConfigByNicheQueryService.execute({
        niche: "finance",
      });

    const filteredSearchResult: BroadcastSheet[] = searchResult.files
      .filter((file) => {
        if (
          file.mimeType === "application/vnd.google-apps.spreadsheet" &&
          !file.name.includes("Copy ") &&
          file.name.toLowerCase().includes("team")
        ) {
          if (!adminConfig.ignoringRules.broadcasts.includes(file.name)) {
            return file;
          }
        }
      })
      .map((file) => {
        return {
          fileId: file.id,
          sheetName: file.name,
        };
      });

    const broadcastId = filteredSearchResult.find((b) =>
      b.sheetName.toLocaleLowerCase().includes(team.toLocaleLowerCase())
    )?.fileId;

    const IGNORED_TABS = adminConfig.ignoringRules.broadcastsTabs;

    const response: BroadcastDomainRequestDto = {
      domain,
      esp: "",
      broadcastCopies: [],
    };

    const table = await this.spreadsheetService.getSpreadsheetWithData(
      broadcastId
    );

    const sheets = table?.sheets || [];

    for (const sheet of sheets) {
      const tabName = sheet.properties?.title || "";
      if (IGNORED_TABS.includes(tabName)) continue;

      const rows = sheet.data?.[0]?.rowData || [];
      if (!rows.length) continue;

      const domainsRowValues = rows[0]?.values;
      if (!domainsRowValues) continue;

      const domains = domainsRowValues.map((cell) => cell.formattedValue || "");

      const espRowValues = rows[3]?.values || [];
      const esps = espRowValues.map((cell) => cell.formattedValue || "");

      const domainIndex = domains.findIndex(
        (d) => d.toLowerCase() === domain.toLowerCase()
      );

      if (domainIndex === -1) continue;

      const esp = esps[domainIndex] || "";

      const broadcastCopies: BroadcastSendingDay[] = [];

      for (let rowIdx = 4; rowIdx < rows.length; rowIdx++) {
        const row = rows[rowIdx];
        const cells = row.values || [];

        const dateCell = cells[0];
        if (!dateCell?.formattedValue) continue;

        const contentCell =
          domainIndex < cells.length
            ? cells[domainIndex]
            : { formattedValue: "" };
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
        const words = cleanText.split(" ").filter((w) => w.trim() && w !== "-");

        let currentIndex = 0;
        const copies = words.map((word) => {
          const start = rawText.indexOf(word, currentIndex);
          if (start === -1) {
            return {
              name: word,
              isPriority: false,
              copyType: CopyType.Unknown,
            };
          }
          currentIndex = start + word.length;

          const isBold = boldRanges.some(
            ([from, to]) => start >= from && start < to
          );
          return {
            name: word,
            isPriority: isBold,
            copyType: CopyType.Unknown,
          };
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
      response.esp = esp;
      response.broadcastCopies = sortedBroadcastCopies;

      break;
    }

    return response;
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

  private parseDateToNumber(date: string): number {
    const trimmed = date.trim();
    const [month, day] = trimmed.split(/[\/.]/).map(Number);
    if (isNaN(month) || isNaN(day)) return 99991231;
    return month * 100 + day;
  }
}

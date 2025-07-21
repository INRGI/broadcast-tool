import { Injectable } from "@nestjs/common";
import { ApproveBroadcastSheetPayload } from "./approve-broadcast-sheet.payload";
import {
  ApproveBroadcastSheetResponseDto,
  UpdateCellResponseDto,
} from "@epc-services/interface-adapters";
import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from "@epc-services/gspreadsheet-api";

@Injectable()
export class ApproveBroadcastSheetService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort
  ) {}

  public async execute(
    payload: ApproveBroadcastSheetPayload
  ): Promise<ApproveBroadcastSheetResponseDto> {
    const { spreadsheetId, sheetName, broadcast } = payload;
    const response: UpdateCellResponseDto[] = [];

    const values = await this.spreadsheetService.getSheetValuesOnly(
      spreadsheetId,
      sheetName
    );
    const headerRow = values[0];
    const dateColIndex = 0;

    const domainColIndexMap = new Map<string, number>();
    headerRow.forEach((value, index) => {
      if (index > 0) domainColIndexMap.set(value, index);
    });

    const rowIndexMap = new Map<string, number>();
    for (let i = 4; i < values.length; i++) {
      const date = values[i][dateColIndex]?.trim();
      if (date) rowIndexMap.set(date, i);
    }

    const pendingUpdates: {
      range: string;
      values: string[][];
      meta: {
        domain: string;
        date: string;
        row: number;
        column: number;
        value: string;
      };
    }[] = [];

    for (const domain of broadcast) {
      const colIndex = domainColIndexMap.get(domain.domain);
      if (colIndex === undefined) continue;

      for (const broadcastCopy of domain.broadcastCopies) {
        if (!broadcastCopy.isModdified) continue;

        const newValue = broadcastCopy.copies
          .map((copy) => copy.name)
          .join(" ");

        const [year, month, day] = broadcastCopy.date.split("-");
        const formattedDate = `${Number(month)}/${Number(day)}`;
        if (!month || !day) continue;

        const rowIndex = rowIndexMap.get(formattedDate);

        if (rowIndex === undefined) continue;

        const columnLetter = this.columnToLetter(colIndex);

        const range = `${sheetName}!${columnLetter}${rowIndex + 1}`;

        pendingUpdates.push({
          range,
          values: [[newValue]],
          meta: {
            domain: domain.domain,
            date: formattedDate,
            row: rowIndex,
            column: colIndex,
            value: newValue,
          },
        });
      }
    }

    let updatedCells = 0;

    if (pendingUpdates.length > 0) {
      const result = await this.spreadsheetService.batchUpdateCells(
        spreadsheetId,
        pendingUpdates.map(({ range, values }) => ({ range, values }))
      );

      updatedCells = result.totalUpdatedCells ?? pendingUpdates.length;

      for (const update of pendingUpdates) {
        response.push({
          isUpdated: true,
          ...update.meta,
        });
      }
    }

    if (pendingUpdates.length > 0) {
      const result = await this.spreadsheetService.batchUpdateCells(
        spreadsheetId,
        pendingUpdates.map(({ range, values }) => ({ range, values }))
      );

      updatedCells = result.totalUpdatedCells ?? pendingUpdates.length;

      for (const update of pendingUpdates) {
        response.push({
          isUpdated: true,
          ...update.meta,
        });
      }

      const sheetInfo = await this.spreadsheetService.getSheetMetadata(
        spreadsheetId
      );
      const sheetId = sheetInfo.sheets.find(
        (s) => s.properties.title === sheetName
      )?.properties.sheetId;

      if (sheetId !== undefined) {
        const formatRanges = pendingUpdates.map(({ meta }) => ({
          sheetId,
          row: meta.row,
          column: meta.column,
        }));

        await this.spreadsheetService.formatCellsColor(
          spreadsheetId,
          formatRanges,
          {
            red: 0.5,
            green: 0.0,
            blue: 0.5,
          }
        );
      }
    }

    return { response };
  }

  private columnToLetter(col: number): string {
    let letter = "";
    while (col >= 0) {
      letter = String.fromCharCode((col % 26) + 65) + letter;
      col = Math.floor(col / 26) - 1;
    }
    return letter;
  }
}

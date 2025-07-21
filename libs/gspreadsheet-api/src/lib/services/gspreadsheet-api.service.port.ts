import { sheets_v4 } from "googleapis";

export interface GSpreadsheetApiServicePort {
  getSheetWithRichText(
    spreadsheetId: string,
    sheetName?: string
  ): Promise<sheets_v4.Schema$Sheet | undefined>;

  getAllSheets(
    spreadsheetId: string
  ): Promise<sheets_v4.Schema$Sheet[] | undefined>;

  getSheetValuesOnly(
    spreadsheetId: string,
    sheetName?: string
  ): Promise<string[][]>;

  getSpreadsheetWithData(
    spreadsheetId: string
  ): Promise<sheets_v4.Schema$Spreadsheet | undefined>;

  updateCell(
    spreadsheetId: string,
    sheetName: string,
    rowIndex: number,
    columnIndex: number,
    value: string
  ): Promise<sheets_v4.Schema$UpdateValuesResponse>;

  batchUpdateCells(
    spreadsheetId: string,
    updates: { range: string; values: string[][] }[]
  ): Promise<sheets_v4.Schema$BatchUpdateValuesResponse>;

  formatCellsColor(
    spreadsheetId: string,
    ranges: { sheetId: number; row: number; column: number }[],
    color: { red: number; green: number; blue: number }
  ): Promise<void>;

  getSheetMetadata(
    spreadsheetId: string
  ): Promise<sheets_v4.Schema$Spreadsheet>;
}

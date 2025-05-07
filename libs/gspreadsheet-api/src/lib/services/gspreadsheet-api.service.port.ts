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
  ): Promise<sheets_v4.Schema$Spreadsheet | undefined>
}

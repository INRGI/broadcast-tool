import { google, sheets_v4 } from "googleapis";
import { Inject, Injectable } from "@nestjs/common";
import { GSpreadsheetApiTokens } from "../gspreadsheet-api.tokens";
import { GSpreadsheetApiConnectionOptions } from "../interfaces";
import { GSpreadsheetApiServicePort } from "./gspreadsheet-api.service.port";

@Injectable()
export class GSpreadsheetApiService implements GSpreadsheetApiServicePort {
  constructor(
    @Inject(GSpreadsheetApiTokens.GSpreadsheetApiModuleOptions)
    private readonly options: GSpreadsheetApiConnectionOptions
  ) {}

  public async getSheetWithRichText(
    spreadsheetId: string,
    sheetName?: string
  ): Promise<sheets_v4.Schema$Sheet | undefined> {
    const sheetsApi = await this.createClient();

    const encodedSheetName = sheetName?.includes(" ")
      ? `'${sheetName}'`
      : sheetName;

    const response = await sheetsApi.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
      ranges: encodedSheetName ? [encodedSheetName] : undefined,
      fields:
        "sheets.data.rowData.values(formattedValue,textFormatRuns,userEnteredValue)",
    });

    return response.data.sheets?.[0];
  }

  public async getSheetValuesOnly(
    spreadsheetId: string,
    sheetName?: string
  ): Promise<string[][]> {
    const sheetsApi = await this.createClient();

    const response = await sheetsApi.spreadsheets.values.get({
      spreadsheetId,
      range: sheetName,
    });

    return response.data.values ?? [];
  }

  public async getAllSheets(
    spreadsheetId: string
  ): Promise<sheets_v4.Schema$Sheet[] | undefined> {
    const sheetsApi = await this.createClient();

    const response = await sheetsApi.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
      ranges: undefined,
      fields:
        "sheets.data.rowData.values(formattedValue,textFormatRuns,userEnteredValue)",
    });

    return response.data.sheets;
  }

  public async getSpreadsheetWithData(
    spreadsheetId: string
  ): Promise<sheets_v4.Schema$Spreadsheet | undefined> {
    const sheetsApi = await this.createClient();

    const response = await sheetsApi.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
      fields:
        "sheets.properties,sheets.data.rowData.values(formattedValue,textFormatRuns,userEnteredValue)",
    });

    return response.data;
  }

  public async updateCell(
    spreadsheetId: string,
    sheetName: string,
    rowIndex: number,
    columnIndex: number,
    value: string
  ): Promise<sheets_v4.Schema$UpdateValuesResponse> {
    const sheetsApi = await this.createClient();

    const range = `${sheetName}!${this.columnToLetter(columnIndex)}${
      rowIndex + 1
    }`;

    const response = await sheetsApi.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[value]],
      },
    });

    return response.data;
  }

  public async batchUpdateCells(
    spreadsheetId: string,
    updates: { range: string; values: string[][] }[]
  ): Promise<sheets_v4.Schema$BatchUpdateValuesResponse> {
    const sheetsApi = await this.createClient();

    const response = await sheetsApi.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: updates,
      },
    });

    return response.data;
  }

  public async formatCellsColor(
    spreadsheetId: string,
    ranges: { sheetId: number; row: number; column: number }[],
    color: { red: number; green: number; blue: number }
  ): Promise<void> {
    const sheetsApi = await this.createClient();
  
    const requests = ranges.map(({ sheetId, row, column }) => ({
      repeatCell: {
        range: {
          sheetId,
          startRowIndex: row,
          endRowIndex: row + 1,
          startColumnIndex: column,
          endColumnIndex: column + 1,
        },
        cell: {
          userEnteredFormat: {
            textFormat: {
              foregroundColor: color,
            },
          },
        },
        fields: "userEnteredFormat.textFormat.foregroundColor",
      },
    }));
  
    await sheetsApi.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });
  }

  public async getSheetMetadata(spreadsheetId: string): Promise<sheets_v4.Schema$Spreadsheet> {
    const sheetsApi = await this.createClient();
    const { data } = await sheetsApi.spreadsheets.get({
      spreadsheetId,
      includeGridData: false,
    });
    return data;
  }

  private columnToLetter(col: number): string {
    let letter = "";
    while (col >= 0) {
      letter = String.fromCharCode((col % 26) + 65) + letter;
      col = Math.floor(col / 26) - 1;
    }
    return letter;
  }

  private async createClient(): Promise<sheets_v4.Sheets> {
    const jwtAuth = new google.auth.JWT(
      this.options.client_email,
      undefined,
      this.options.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    return google.sheets({ version: "v4", auth: jwtAuth });
  }
}

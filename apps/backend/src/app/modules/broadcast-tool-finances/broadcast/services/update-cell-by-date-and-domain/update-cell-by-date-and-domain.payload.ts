export interface UpdateCellByDateAndDomainPayload {
  spreadsheetId: string;
  sheetName: string;
  date: string;
  domain: string;
  newValue: string;
}

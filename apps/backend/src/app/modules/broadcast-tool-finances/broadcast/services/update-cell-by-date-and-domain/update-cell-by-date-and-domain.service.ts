import {
  GSpreadsheetApiServicePort,
  InjectGSpreadsheetApiService,
} from '@epc-services/gspreadsheet-api';
import { Injectable } from '@nestjs/common';
import { UpdateCellByDateAndDomainPayload } from './update-cell-by-date-and-domain.payload';
import { UpdateCellResponseDto } from '@epc-services/interface-adapters';

@Injectable()
export class UpdateCellByDateAndDomainService {
  constructor(
    @InjectGSpreadsheetApiService()
    private readonly spreadsheetService: GSpreadsheetApiServicePort
  ) {}

  public async execute(
    payload: UpdateCellByDateAndDomainPayload
  ): Promise<UpdateCellResponseDto> {
    const { spreadsheetId, sheetName, date, domain, newValue } = payload;

    const values = await this.spreadsheetService.getSheetValuesOnly(
      spreadsheetId,
      sheetName
    );
    const headerRow = values[0];
    const dateColIndex = 0;
    const domainColIndex = headerRow.indexOf(domain);
    if (domainColIndex === -1)
      return {
        isUpdated: false,
        domain: domain,
        date: date,
        value: newValue,
        row: 0,
        column: domainColIndex,
      };

    const rowIndex = values.findIndex(
      (row, idx) => idx >= 4 && row[dateColIndex]?.trim() === date.trim()
    );

    if (rowIndex === -1)
      return {
        isUpdated: false,
        domain: domain,
        date: date,
        value: newValue,
        row: rowIndex,
        column: domainColIndex,
      };
    const response = await this.spreadsheetService.updateCell(
      spreadsheetId,
      sheetName,
      rowIndex,
      domainColIndex,
      newValue
    );

    return response.updatedCells === 1
      ? {
          isUpdated: true,
          domain: domain,
          date: date,
          value: newValue,
          row: rowIndex,
          column: domainColIndex,
        }
      : {
          isUpdated: false,
          domain: domain,
          date: date,
          value: newValue,
          row: rowIndex,
          column: domainColIndex,
        };
  }
}

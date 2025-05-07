import { Inject } from '@nestjs/common';
import { GSpreadsheetApiTokens } from '../gspreadsheet-api.tokens';

export const InjectGSpreadsheetApiService = (): ReturnType<typeof Inject> =>
  Inject(GSpreadsheetApiTokens.GSpreadsheetApiService);

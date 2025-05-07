import { ClassProvider } from '@nestjs/common';
import { GSpreadsheetApiTokens } from '../gspreadsheet-api.tokens';
import { GSpreadsheetApiService } from '../services';

export const serviceProviders: ClassProvider[] = [
  {
    provide: GSpreadsheetApiTokens.GSpreadsheetApiService,
    useClass: GSpreadsheetApiService,
  },
];

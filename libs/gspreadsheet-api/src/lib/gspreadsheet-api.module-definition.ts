import { ConfigurableModuleBuilder } from '@nestjs/common';
import { GSpreadsheetApiTokens } from './gspreadsheet-api.tokens';
import { GSpreadsheetApiModuleOptions } from './interfaces';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<GSpreadsheetApiModuleOptions>({
  optionsInjectionToken: GSpreadsheetApiTokens.GSpreadsheetApiModuleOptions,
}).build();

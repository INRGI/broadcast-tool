import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './gspreadsheet-api.module-definition';
import { serviceProviders } from './providers';

@Module({
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class GSpreadsheetApiModule extends ConfigurableModuleClass{}

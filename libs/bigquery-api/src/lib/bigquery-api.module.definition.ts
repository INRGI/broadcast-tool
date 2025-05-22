import { ConfigurableModuleBuilder } from '@nestjs/common';
import { BigQueryApiTokens } from './bigquery-api.tokens';
import { BigQueryApiModuleOptions } from './interfaces';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<BigQueryApiModuleOptions>({
  optionsInjectionToken: BigQueryApiTokens.BigQueryApiModuleOptions,
}).build();

import { ConfigurableModuleBuilder } from '@nestjs/common';
import { StatisticApiModuleOptions } from './interfaces/statistic-api.options.interface';
import { StatisticApiTokens } from './statistic-api.tokens';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<StatisticApiModuleOptions>({
  optionsInjectionToken: StatisticApiTokens.StatisticApiModuleOptions,
}).build();

import { ConfigurableModuleBuilder } from '@nestjs/common';
import { MondayApiModuleOptions } from './interfaces';
import { MondayApiTokens } from './monday-api.tokens';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<MondayApiModuleOptions>({
  optionsInjectionToken: MondayApiTokens.MondayApiModuleOptions,
}).build();

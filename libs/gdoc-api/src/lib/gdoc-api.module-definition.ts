import { ConfigurableModuleBuilder } from '@nestjs/common';
import { GDocApiModuleOptions } from './interfaces';
import { GDocApiTokens } from './gdoc-api.tokens';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<GDocApiModuleOptions>({
  optionsInjectionToken: GDocApiTokens.GDocApiModuleOptions,
}).build();

import { ConfigurableModuleBuilder } from '@nestjs/common';
import { LookerStudioApiTokens } from './looker-studio-api.tokens';
import { LookerStudioApiModuleOptions } from './interfaces/looker-studio-api.options.interface';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<LookerStudioApiModuleOptions>({
  optionsInjectionToken: LookerStudioApiTokens.LookerStudioApiModuleOptions,
}).build();

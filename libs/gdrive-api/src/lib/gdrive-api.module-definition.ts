import { ConfigurableModuleBuilder } from '@nestjs/common';
import { GDriveApiTokens } from './gdrive-api.tokens';
import { GDriveApiModuleOptions } from './interfaces';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<GDriveApiModuleOptions>({
  optionsInjectionToken: GDriveApiTokens.GDriveApiModuleOptions,
}).build();

import { DynamicModule, Module } from '@nestjs/common';
import { serviceProviders } from './providers';
import { HttpModule } from '@nestjs/axios';
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from './monday-api.module-definition';
import { MONDAY_API_BASE_URL } from './constants';
import { MondayApiModuleOptions } from './interfaces';

@Module({
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class MondayApiModule extends ConfigurableModuleClass {
  public static register(options?: typeof OPTIONS_TYPE): DynamicModule {
    const m = super.register(options);
    m.imports ??= [];
    m.imports.push(
      HttpModule.register({ baseURL: MONDAY_API_BASE_URL, ...options })
    );
    return m;
  }

  public static registerAsync(
    options: typeof ASYNC_OPTIONS_TYPE
  ): DynamicModule {
    const m = super.registerAsync(options);
    m.imports ??= [];
    m.imports.push(
      HttpModule.registerAsync({
        imports: options.imports || [],
        useFactory: async (options: MondayApiModuleOptions) => ({
          baseURL: MONDAY_API_BASE_URL,
          ...options,
        }),
        inject: [MODULE_OPTIONS_TOKEN],
        extraProviders: m.providers,
      })
    );
    return m;
  }
}

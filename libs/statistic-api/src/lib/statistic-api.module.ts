import { DynamicModule, Module } from "@nestjs/common";
import { serviceProviders } from "./providers";
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from "./statistic-api.module.definition";
import { HttpModule } from "@nestjs/axios";
import { StatisticApiModuleOptions } from "./interfaces/statistic-api.options.interface";
import { STATISTIC_API_BASE_URL } from "./constants/statistic-api.constants";

@Module({
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class StatisticApiModule extends ConfigurableModuleClass {
  public static register(options?: typeof OPTIONS_TYPE): DynamicModule {
    const m = super.register(options);
    m.imports ??= [];
    m.imports.push(HttpModule.register({ baseURL: STATISTIC_API_BASE_URL, ...options }));
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
        useFactory: async (options: StatisticApiModuleOptions) => ({
          baseURL: STATISTIC_API_BASE_URL,
          ...options,
        }),
        inject: [MODULE_OPTIONS_TOKEN],
        extraProviders: m.providers,
      })
    );
    return m;
  }
}

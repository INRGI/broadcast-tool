import { DynamicModule, Module } from "@nestjs/common";
import { serviceProviders } from "./providers";
import {
  ASYNC_OPTIONS_TYPE,
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
} from "./bigquery-api.module.definition";
import { HttpModule } from "@nestjs/axios";
import { BigQueryApiModuleOptions } from "./interfaces";
import { BIGQUERY_API_BASE_URL } from "./constants";

@Module({
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class BigQueryApiModule extends ConfigurableModuleClass {
  public static register(options?: typeof OPTIONS_TYPE): DynamicModule {
    const m = super.register(options);
    m.imports ??= [];
    m.imports.push(HttpModule.register({ baseURL: BIGQUERY_API_BASE_URL, ...options }));
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
        useFactory: async (options: BigQueryApiModuleOptions) => ({
          baseURL: BIGQUERY_API_BASE_URL,
          ...options,
        }),
        inject: [MODULE_OPTIONS_TOKEN],
        extraProviders: m.providers,
      })
    );
    return m;
  }
}

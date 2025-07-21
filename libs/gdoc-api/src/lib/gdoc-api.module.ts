import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './gdoc-api.module-definition';
import { serviceProviders } from './providers';

@Module({
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class GDocApiModule extends ConfigurableModuleClass{}

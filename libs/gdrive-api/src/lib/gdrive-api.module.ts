import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './gdrive-api.module-definition';
import { serviceProviders } from './providers';

@Module({
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class GDriveApiModule extends ConfigurableModuleClass {}

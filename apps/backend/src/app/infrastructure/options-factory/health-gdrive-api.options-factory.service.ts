import { Injectable } from '@nestjs/common';
import { GdriveConfigService } from '@epc-services/core';
import { GDriveApiModuleOptions } from '@epc-services/gdrive-api';
@Injectable()
export class HealthGdriveApiOptionsFactoryService {
  constructor(private readonly gdriveApiConfig: GdriveConfigService) {}

  create(): Promise<GDriveApiModuleOptions> | GDriveApiModuleOptions {
    return {
      client_email: this.gdriveApiConfig.healthGdriveClientEmail,
      private_key: this.gdriveApiConfig.healthGdrivePrivateKey.split('\\n').join('\n'),
    };
  }
}

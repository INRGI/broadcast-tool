import { Injectable } from '@nestjs/common';
import { GdriveConfigService } from '@epc-services/core';
import { GDriveApiModuleOptions } from '@epc-services/gdrive-api';
@Injectable()
export class GdriveApiOptionsFactoryService {
  constructor(private readonly gdriveApiConfig: GdriveConfigService) {}

  create(): Promise<GDriveApiModuleOptions> | GDriveApiModuleOptions {
    return {
      client_email: this.gdriveApiConfig.gdriveClientEmail,
      private_key: this.gdriveApiConfig.gdrivePrivateKey.split('\\n').join('\n'),
    };
  }
}

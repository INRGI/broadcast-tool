import { Injectable } from '@nestjs/common';
import { MondayConfigService } from '@epc-services/core';
import { MondayApiModuleOptions } from '@epc-services/monday-api';
@Injectable()
export class MondayApiOptionsFactoryService {
  constructor(private readonly mondayApiConfig: MondayConfigService) {}

  create(): Promise<MondayApiModuleOptions> | MondayApiModuleOptions {
    return {
      accessToken: this.mondayApiConfig.accessToken,
    };
  }
}

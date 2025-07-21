import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MondayConfigService {
  constructor(private configService: ConfigService) {}

  get accessToken(): string {
    return this.configService.get<string>('monday.accessToken');
  }

  get productsBoardId(): string {
    return this.configService.get<string>('monday.productsBoardId');
  }

  get testCopiesBoardId(): string {
    return this.configService.get<string>('monday.testCopiesBoardId');
  }

  get domainsBoardId(): string {
    return this.configService.get<string>('monday.domainsBoardId');
  }

  get ogAccessToken(): string {
    return this.configService.get<string>('monday.ogAccessToken');
  }

  get ogProductsBoardId(): string {
    return this.configService.get<string>('monday.ogProductsBoardId');
  }

  get ogDomainsBoardId(): string {
    return this.configService.get<string>('monday.ogDomainsBoardId');
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MondayConfigService {
  constructor(private configService: ConfigService) {}

  get accessToken(): string {
    return this.configService.get<string>('monday.accessToken');
  }
}

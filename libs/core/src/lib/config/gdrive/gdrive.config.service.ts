import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GdriveConfigService {
  constructor(private configService: ConfigService) {}

  get gdriveClientEmail(): string {
    return this.configService.get<string>("gdrive.clientEmail");
  }

  get gdrivePrivateKey(): string {
    return this.configService.get<string>("gdrive.privateKey");
  }
}

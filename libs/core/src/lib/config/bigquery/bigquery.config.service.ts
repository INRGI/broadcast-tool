import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BigQueryConfigService {
  constructor(private configService: ConfigService) {}

  get bigqueryClientEmail(): string {
    return this.configService.get<string>("bigquery.clientEmail");
  }

  get bigqueryPrivateKey(): string {
    return this.configService.get<string>("bigquery.privateKey");
  }

  get bigqueryProjectId(): string {
    return this.configService.get<string>("bigquery.projectId");
  }
}

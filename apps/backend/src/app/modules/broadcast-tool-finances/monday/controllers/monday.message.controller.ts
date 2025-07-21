import { Controller, Get } from "@nestjs/common";
import {
  GetDomainStatusesResponseDto,
  GetProductStatusesResponseDto,
} from "@epc-services/interface-adapters";
import { GetDomainStatusesService } from "../services/get-domain-statuses/get-domain-statuses.service";
import { GetProductStatusesService } from "../services/get-product-statuses/get-product-statuses.service";

@Controller("finances/broadcast-tool/monday")
export class MondayController {
  constructor(
    private readonly getDomainStatusesService: GetDomainStatusesService,
    private readonly getProductStatusesService: GetProductStatusesService
  ) {}

  @Get("product-statuses")
  public async getProductStatuses(): Promise<GetProductStatusesResponseDto> {
    const result = await this.getProductStatusesService.execute();
    return result;
  }

  @Get("domain-statuses")
  public async getDomainStatuses(): Promise<GetDomainStatusesResponseDto> {
    const result = await this.getDomainStatusesService.execute();
    return result;
  }
}

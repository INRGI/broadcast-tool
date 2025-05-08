import { Controller, Get, Param } from "@nestjs/common";
import { GetProductDataService } from "../services/get-product-data/get-product-data.service";
import {
  GetDomainDataResponse,
  GetProductDataResponse,
} from "@epc-services/interface-adapters";
import { GetDomainDataService } from "../services/get-domain-data/get-domain-data.service";

@Controller("finances/monday")
export class MondayController {
  constructor(
    private readonly getProductDataService: GetProductDataService,
    private readonly getDomainDataService: GetDomainDataService
  ) {}

  @Get("product/:product")
  public async getProductData(
    @Param("product") product: string
  ): Promise<GetProductDataResponse> {
    const result = await this.getProductDataService.getProductData({ product });
    return await result;
  }

  @Get("domain/:domain")
  public async getDomainData(
    @Param("domain") domain: string
  ): Promise<GetDomainDataResponse> {
    const result = await this.getDomainDataService.getDomainData({ domain });
    return await result;
  }
}

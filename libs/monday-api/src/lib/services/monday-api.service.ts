import { Inject, Injectable } from "@nestjs/common";
import { MondayApiServicePort } from "./monday-api.service.port";
import { HttpService } from "@nestjs/axios";
import {
  MondayApiProductBoardData,
  MondayApiConnectionOptions,
  MondayApiGetProductDataResponse,
  MondayApiDomainBoardData,
} from "../interfaces";
import { firstValueFrom } from "rxjs";
import { MONDAY_API_BASE_URL } from "../constants";
import { MondayApiUtils } from "../utils";
import { MondayApiTokens } from "../monday-api.tokens";

@Injectable()
export class MondayApiService implements MondayApiServicePort {
  constructor(
    private readonly httpService: HttpService,
    @Inject(MondayApiTokens.MondayApiModuleOptions)
    private readonly options: MondayApiConnectionOptions
  ) {}

  private async queryItems(
    boardId: number,
    searchName: string
  ): Promise<MondayApiProductBoardData[]> {
    const { data }: { data: MondayApiGetProductDataResponse } =
      await firstValueFrom(
        this.httpService.post(
          `${MONDAY_API_BASE_URL}`,
          MondayApiUtils.queryData(boardId, searchName),
          {
            headers: MondayApiUtils.auth(this.options.accessToken),
          }
        )
      );

    return await data.data.boards[0].items_page.items;
  }

  private async queryItemsEndsWith(
    boardId: number,
    searchName: string
  ): Promise<MondayApiProductBoardData[]> {
    const { data }: { data: MondayApiGetProductDataResponse } =
      await firstValueFrom(
        this.httpService.post(
          `${MONDAY_API_BASE_URL}`,
          MondayApiUtils.queryDataEndsWith(boardId, searchName),
          {
            headers: MondayApiUtils.auth(this.options.accessToken),
          }
        )
      );

    return await data.data.boards[0].items_page.items;
  }

  public async getProductData(
    productName: string,
    boardId: number
  ): Promise<MondayApiProductBoardData[]> {
    return await this.queryItems(boardId, productName);
  }

  public async getProductDataByEndsWith(
    productName: string,
    boardId: number
  ): Promise<MondayApiProductBoardData[]> {
    return await this.queryItemsEndsWith(boardId, productName);
  }

  public async getDomainData(
    domainName: string,
    boardId: number
  ): Promise<MondayApiDomainBoardData[]> {
    return await this.queryItems(boardId, domainName);
  }
}

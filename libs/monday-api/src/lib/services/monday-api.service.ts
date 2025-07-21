import { Inject, Injectable } from "@nestjs/common";
import { MondayApiServicePort } from "./monday-api.service.port";
import { HttpService } from "@nestjs/axios";
import {
  MondayApiProductBoardData,
  MondayApiConnectionOptions,
  MondayApiGetProductDataResponse,
  MondayApiDomainBoardData,
  MondayApiGetDataResponse,
  MondayApiBoardData,
  MondayApiQueryParams,
  MondayGroup,
  MondayApiGroupBoardData,
  MondayApiGetGroupDataResponse,
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

  private async queryWithParams(
    queryParams: MondayApiQueryParams
  ): Promise<[]> {
    const { data }: { data: MondayApiGetDataResponse } = await firstValueFrom(
      this.httpService.post(`${MONDAY_API_BASE_URL}`, queryParams, {
        headers: MondayApiUtils.auth(this.options.accessToken),
      })
    );

    return data.data.boards[0].items_page.items;
  }

  private async groupQueryWithParams(
    queryParams: MondayApiQueryParams
  ): Promise<MondayGroup[]> {
    const { data }: { data: MondayApiGetDataResponse } = await firstValueFrom(
      this.httpService.post(`${MONDAY_API_BASE_URL}`, queryParams, {
        headers: MondayApiUtils.auth(this.options.accessToken),
      })
    );

    return data.data.boards[0].groups;
  }

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

  private async queryItemsWithCursor(
    queryParams: MondayApiQueryParams
  ): Promise<{
    items: MondayApiBoardData[];
    cursor: string | null;
  }> {
    const { data }: { data: MondayApiGetDataResponse } = await firstValueFrom(
      this.httpService.post(`${MONDAY_API_BASE_URL}`, queryParams, {
        headers: MondayApiUtils.auth(this.options.accessToken),
      })
    );

    const itemsPage = data.data.boards[0].items_page;

    return {
      items: itemsPage.items,
      cursor: itemsPage.cursor,
    };
  }

  private async queryGroupItemsWithCursor(
    queryParams: MondayApiQueryParams
  ): Promise<{
    items: MondayApiGroupBoardData[];
    cursor: string | null;
  }> {
    const { data }: { data: MondayApiGetGroupDataResponse } =
      await firstValueFrom(
        this.httpService.post(`${MONDAY_API_BASE_URL}`, queryParams, {
          headers: MondayApiUtils.auth(this.options.accessToken),
        })
      );

    const itemsPage = data.data.boards[0].groups[0].items_page;

    return {
      items: itemsPage.items,
      cursor: itemsPage.cursor,
    };
  }

  public async getMultipleProductsData(
    productNames: string[],
    boardId: number
  ): Promise<MondayApiProductBoardData[]> {
    const { data }: { data: MondayApiGetProductDataResponse } =
      await firstValueFrom(
        this.httpService.post(
          `${MONDAY_API_BASE_URL}`,
          MondayApiUtils.queryMultipleItems(boardId, productNames),
          {
            headers: MondayApiUtils.auth(this.options.accessToken),
          }
        )
      );
    console.log(data);
    return data.data.boards[0].items_page.items;
  }

  public async getItemsWithCursor(queryParams: MondayApiQueryParams): Promise<{
    items: MondayApiBoardData[];
    cursor: string | null;
  }> {
    return await this.queryItemsWithCursor(queryParams);
  }

  public async getGroupItemsWithCursor(
    queryParams: MondayApiQueryParams
  ): Promise<{
    items: MondayApiGroupBoardData[];
    cursor: string | null;
  }> {
    return await this.queryGroupItemsWithCursor(queryParams);
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

  public async getItemsByQuery(
    queryParams: MondayApiQueryParams
  ): Promise<MondayApiBoardData[]> {
    return await this.queryWithParams(queryParams);
  }

  public async getGroupsByQuery(
    queryParams: MondayApiQueryParams
  ): Promise<MondayGroup[]> {
    return await this.groupQueryWithParams(queryParams);
  }
}

import {
  MondayApiProductBoardData,
  MondayApiDomainBoardData,
  MondayApiQueryParams,
  MondayApiBoardData,
  MondayGroup,
  MondayApiGroupBoardData,
} from "../interfaces";

export interface MondayApiServicePort {
  getProductData(
    productName: string,
    boardId: number
  ): Promise<MondayApiProductBoardData[]>;

  getDomainData(
    domainName: string,
    boardId: number
  ): Promise<MondayApiDomainBoardData[]>;

  getProductDataByEndsWith(
    productName: string,
    boardId: number
  ): Promise<MondayApiProductBoardData[]>;

  getMultipleProductsData(
    productNames: string[],
    boardId: number
  ): Promise<MondayApiProductBoardData[]>;

  getItemsWithCursor(queryParams: MondayApiQueryParams): Promise<{
    items: MondayApiBoardData[];
    cursor: string | null;
  }>;

  getGroupItemsWithCursor(queryParams: MondayApiQueryParams): Promise<{
    items: MondayApiGroupBoardData[];
    cursor: string | null;
  }>;

  getItemsByQuery(
    queryParams: MondayApiQueryParams
  ): Promise<MondayApiBoardData[]>;

  getGroupsByQuery(queryParams: MondayApiQueryParams): Promise<MondayGroup[]>;
}

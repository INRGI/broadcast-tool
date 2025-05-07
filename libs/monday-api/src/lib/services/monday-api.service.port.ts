import {
  MondayApiProductBoardData,
  MondayApiDomainBoardData,
} from '../interfaces';

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
}

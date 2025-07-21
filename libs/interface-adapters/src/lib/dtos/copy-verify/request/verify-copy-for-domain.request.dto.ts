import { BroadcastDomain } from "../../../interfaces";
import { BroadcastRulesResponseDto } from "../../broadcast-rules";
import { GetDomainDataResponse, GetProductDataResponse } from "../../monday";
import { GetAllDomainsResponseDto } from "../../broadcast";

export class VerifyCopyForDomainRequestDto {
  public broadcastDomain: BroadcastDomain;

  public broadcast: GetAllDomainsResponseDto;

  public copyName: string;

  public sendingDate: string;

  public broadcastRules: BroadcastRulesResponseDto;

  public domainsData: GetDomainDataResponse[];

  public productsData: GetProductDataResponse[];
}

import { BroadcastDomain } from "../../../interfaces";

export class VerifyCopyForDomainResponseDto {
  public isValid: boolean;

  public broadcastDomain: BroadcastDomain;
}

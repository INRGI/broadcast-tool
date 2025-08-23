import { IsArray, IsNumber, IsString } from "class-validator";

export class DomainTabPrioritiesRequestDto {
  @IsString()
  public tabName: string;

  @IsNumber()
  public randomDomainQuantity: number;

  @IsArray()
  public selectedDomains: string[];
}

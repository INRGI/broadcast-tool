import { UpdateCellResponseDto } from "./update-cell.response.dto";
import { IsArray } from "class-validator";

export class ApproveBroadcastSheetResponseDto {
  @IsArray()
  public response: UpdateCellResponseDto[];
}

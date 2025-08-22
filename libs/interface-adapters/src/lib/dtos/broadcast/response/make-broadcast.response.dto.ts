import { BroadcastSheetResponseDto } from "./broadcast-sheet.response.dto";
import { CalculatedBroadcastSendsResponseDto } from "./calculated-broadcast-sends.response.dto";

export class MakeBroadcastResponseDto {
  public sheets: BroadcastSheetResponseDto[];
  public calculatedChanges: CalculatedBroadcastSendsResponseDto;
}

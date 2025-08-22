import { BroadcastSheetResponse } from "./broadcast-sheet.response.dto";
import { CalculatedBroadcastSendsResponseDto } from "./calculated-broadcast-sends.response.dto";

export interface MakeBroadcastResponseDto {
  sheets: BroadcastSheetResponse[];
  calculatedChanges: CalculatedBroadcastSendsResponseDto;
}

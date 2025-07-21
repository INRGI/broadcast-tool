import { IsString } from "class-validator";

export class BroadcastListItemResponseDto {
  @IsString()
  sheetName: string;

  @IsString()
  fileId: string;
}

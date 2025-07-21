import { IsBoolean, IsString } from "class-validator";
import { CopyType } from "../../../interfaces";

export class BroadcastCopyRequestDto {
  @IsString()
  name: string;

  @IsBoolean()
  isPriority: boolean;

  @IsString()
  copyType: CopyType;
}

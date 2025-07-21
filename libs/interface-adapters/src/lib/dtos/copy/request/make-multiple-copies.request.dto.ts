import { Preset } from "../../../interfaces";

export class MakeMulitpleCopiesRequestDto {
  preset: Preset;

  fromDate?: Date;

  toDate?: Date;
}

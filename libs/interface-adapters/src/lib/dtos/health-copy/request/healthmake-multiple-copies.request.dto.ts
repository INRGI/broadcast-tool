import { HealthPreset } from "../../../interfaces";

export class HealthMakeMulitpleCopiesRequestDto {
  preset: HealthPreset;

  fromDate?: Date;

  toDate?: Date;
}

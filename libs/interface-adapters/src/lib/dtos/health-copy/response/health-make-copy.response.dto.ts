import { HealthUnsubData } from "../../../interfaces";

export class HealthMakeCopyResponseDto {
  html: string;
  copyName: string;
  unsubData: HealthUnsubData;
  subjects: string[];
  imageLinks: string[];
  buildedLink: string;
  sendingDate: Date;
}

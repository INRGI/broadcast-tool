import { UnsubData } from "../../../interfaces";

export class MakeCopyResponseDto {
  html: string;
  copyName: string;
  unsubData: UnsubData;
  subjects: string[];
  imageLinks: string[];
  buildedLink: string;
  sendingDate: Date;
  isForValidation?: boolean;
}

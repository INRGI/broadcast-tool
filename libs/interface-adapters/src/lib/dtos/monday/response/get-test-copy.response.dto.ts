import { IsString } from "class-validator";

export class GetTestCopyResponseDto {
  @IsString()
  public copyName: string;

  @IsString()
  public checkStatus: string;

  @IsString()
  public createDate: string;
}

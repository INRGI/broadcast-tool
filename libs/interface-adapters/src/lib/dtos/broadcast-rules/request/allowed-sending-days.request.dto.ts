import { IsBoolean } from "class-validator";

export class AllowedSendingDaysRequestDto {
  @IsBoolean()
  public monday: boolean;

  @IsBoolean()
  public tuesday: boolean;

  @IsBoolean()
  public wednesday: boolean;

  @IsBoolean()
  public thursday: boolean;

  @IsBoolean()
  public friday: boolean;

  @IsBoolean()
  public saturday: boolean;

  @IsBoolean()
  public sunday: boolean;
}

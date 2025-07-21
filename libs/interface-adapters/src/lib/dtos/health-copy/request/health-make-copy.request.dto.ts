import { IsObject, IsString } from 'class-validator';
import { HealthPreset } from '../../../interfaces';

export class HealthMakeCopyRequestDto {
  @IsString()
  copyName: string;
  
  @IsObject()
  preset: HealthPreset;
}

import { IsObject, IsString } from 'class-validator';
import { Preset } from '../../../interfaces';

export class MakeCopyRequestDto {
  @IsString()
  copyName: string;
  
  @IsObject()
  preset: Preset;
}

import { HttpModuleOptions } from '@nestjs/axios';

export interface MondayApiModuleOptions extends HttpModuleOptions {
  accessToken: string;
}
